import { FORM_CODE_LABELS, FormCode } from '@/types';
import { getPurchaseById, vendors } from '@/services/dummy';
import { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface PurchaseItem {
  id: string;
  detail_pekerjaan: string;
  qty: number;
  satuan: string;
  harga_satuan: number;
  ongkir: number;
  admin: number;
  fee: number;
  total: number;
}

export default function EditPurchase() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  
  // Header data
  const [headerData, setHeaderData] = useState({
    user: '',
    po_number: '',
    vendor_id: '',
    no_rek_va: '',
    payment_term: '',
    delivery_deadline: '',
    expedition: '',
    form_code: '' as FormCode | '',
    is_urgent: false,
    has_po: false,
  });

  // Multiple items
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      id: Date.now().toString(),
      detail_pekerjaan: '',
      qty: 1,
      satuan: 'EA',
      harga_satuan: 0,
      ongkir: 0,
      admin: 0,
      fee: 0,
      total: 0,
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const purchase = getPurchaseById(Number(id));
      if (purchase) {
        setHeaderData({
          user: '', // Will be loaded from user_id
          po_number: purchase.po_number,
          vendor_id: String(purchase.vendor_id),
          no_rek_va: '', // Can be loaded if available
          payment_term: purchase.payment_term,
          delivery_deadline: purchase.delivery_deadline || '',
          expedition: purchase.expedition,
          form_code: (purchase.form_code || '') as '' | FormCode,
          is_urgent: purchase.is_urgent || false,
          has_po: purchase.has_po || false,
        });
        
        // Load existing items - support both multiple items and single item format
        if (purchase.items && purchase.items.length > 0) {
          // Load from items array if available
          setItems(purchase.items.map((item: any) => ({
            id: item.id || Date.now().toString(),
            detail_pekerjaan: item.detail_pekerjaan,
            qty: item.qty,
            satuan: item.satuan,
            harga_satuan: item.harga_satuan,
            ongkir: item.ongkir,
            admin: item.admin,
            fee: item.fee,
            total: item.total,
          })));
        } else {
          // Fallback to single item format
          setItems([{
            id: Date.now().toString(),
            detail_pekerjaan: purchase.job_detail,
            qty: purchase.qty,
            satuan: purchase.unit,
            harga_satuan: purchase.price_unit,
            ongkir: purchase.price_shipping,
            admin: purchase.price_admin,
            fee: purchase.price_fee,
            total: purchase.price_total,
          }]);
        }
      }
      setLoading(false);
    }
  }, [id]);

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setHeaderData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'vendor_id' ? Number(value) || '' : value
    }));
  };

  const handleItemChange = (id: string, field: keyof PurchaseItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Auto calculate total when relevant fields change
        if (['qty', 'harga_satuan', 'ongkir', 'admin', 'fee'].includes(field)) {
          updatedItem.total = (updatedItem.qty * updatedItem.harga_satuan) + 
                              updatedItem.ongkir + updatedItem.admin + updatedItem.fee;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      detail_pekerjaan: '',
      qty: 1,
      satuan: 'EA',
      harga_satuan: 0,
      ongkir: 0,
      admin: 0,
      fee: 0,
      total: 0,
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    } else {
      alert('Minimal harus ada 1 item');
    }
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!headerData.form_code) newErrors.form_code = 'Kode Form wajib dipilih';
    if (!headerData.po_number.trim()) newErrors.po_number = 'PO Number wajib diisi';
    if (!headerData.user.trim()) newErrors.user = 'User wajib diisi';
    if (!headerData.vendor_id) newErrors.vendor_id = 'Vendor wajib dipilih';
    if (!headerData.payment_term.trim()) newErrors.payment_term = 'Payment Term wajib diisi';
    if (!headerData.expedition.trim()) newErrors.expedition = 'Expedisi wajib diisi';
    
    // Validate items
    items.forEach((item, index) => {
      if (!item.detail_pekerjaan.trim()) {
        newErrors[`item_${index}_detail`] = `Item ${index + 1}: Detail pekerjaan wajib diisi`;
      }
      if (item.qty <= 0) {
        newErrors[`item_${index}_qty`] = `Item ${index + 1}: Qty harus lebih dari 0`;
      }
      if (item.harga_satuan <= 0) {
        newErrors[`item_${index}_price`] = `Item ${index + 1}: Harga satuan harus lebih dari 0`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    const updatedPurchase = {
      ...headerData,
      items: items,
      grand_total: calculateGrandTotal(),
      id: Number(id),
      status: 'pending',
      updated_at: new Date().toISOString(),
    };

    console.log('Updating purchase with multiple items:', updatedPurchase);
    alert(`Pembelian dengan ${items.length} item berhasil diupdate!\nTotal: ${formatRupiah(calculateGrandTotal())}`);
    router.push(`/purchases/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!getPurchaseById(Number(id))) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pembelian Tidak Ditemukan</h1>
          <Link href="/purchases" className="text-blue-600 hover:underline">
            Kembali ke Daftar Pembelian
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link href={`/purchases/${id}`} className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Detail
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Edit Pembelian (Multiple Items)</h1>
          {headerData.form_code && (
            <span 
              className={`px-3 py-1 rounded text-sm font-bold ${
                headerData.form_code === 'U' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                headerData.form_code === 'J' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                'bg-blue-100 text-blue-800 border border-blue-300'
              }`}
            >
              {headerData.form_code} - {FORM_CODE_LABELS[headerData.form_code as FormCode]}
            </span>
          )}
        </div>
        <p className="text-gray-600 mt-1">PO Number: <span className="font-bold text-blue-600">{headerData.po_number}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-red-600 text-white px-4 py-1 rounded">FORM PEMBELIAN</span>
            {headerData.form_code && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                {FORM_CODE_LABELS[headerData.form_code as FormCode]}
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                KODE FORM <span className="text-red-500">*</span>
              </label>
              <select
                name="form_code"
                value={headerData.form_code}
                onChange={handleHeaderChange}
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.form_code ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Pilih Kode --</option>
                <option value="U">U - Urgent</option>
                <option value="J">J - Jasa</option>
                <option value="P">P - PO</option>
              </select>
              {errors.form_code && <p className="text-red-500 text-xs mt-1">{errors.form_code}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                USER <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="user"
                value={headerData.user}
                onChange={handleHeaderChange}
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.user ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nama User"
              />
              {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                NO PO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="po_number"
                value={headerData.po_number}
                onChange={handleHeaderChange}
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.po_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="PO-2024-001"
              />
              {errors.po_number && <p className="text-red-500 text-xs mt-1">{errors.po_number}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                VENDOR <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor_id"
                value={headerData.vendor_id}
                onChange={handleHeaderChange}
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.vendor_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Pilih Vendor --</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {errors.vendor_id && <p className="text-red-500 text-xs mt-1">{errors.vendor_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                NO REK / VA
              </label>
              <input
                type="text"
                name="no_rek_va"
                value={headerData.no_rek_va}
                onChange={handleHeaderChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Bank / No Rekening"
              />
              {headerData.vendor_id && (() => {
                const vendor = vendors.find(v => v.id === Number(headerData.vendor_id));
                return vendor ? (
                  <p className="text-xs text-gray-600 mt-1">
                    {vendor.bank_name} - {vendor.account_number}
                  </p>
                ) : null;
              })()}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                TERM PEMBAYARAN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="payment_term"
                value={headerData.payment_term}
                onChange={handleHeaderChange}
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.payment_term ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="TRANSFER / COD"
              />
              {errors.payment_term && <p className="text-red-500 text-xs mt-1">{errors.payment_term}</p>}
            </div>

            <div className="flex items-center gap-4 md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_urgent"
                  checked={headerData.is_urgent}
                  onChange={handleHeaderChange}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-bold text-orange-600">🔥 URGENT</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="has_po"
                  checked={headerData.has_po}
                  onChange={handleHeaderChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-bold text-green-600">✓ Sudah TER-PO</span>
              </label>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-bold">DAFTAR BARANG / JASA</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold text-sm"
            >
              ➕ Tambah Item
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-12">NO</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase w-16">USER</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase w-24">NO PO</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase min-w-[250px]">DETAIL PEKERJAAN</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-20">QTY</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-20">SATUAN</th>
                  <th colSpan={5} className="px-3 py-3 text-center text-xs font-bold uppercase bg-red-700">HARGA</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-32">VENDOR</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-32">NO REK / VA</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-32">TERM PEMBAYARAN</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-20">AKSI</th>
                </tr>
                <tr className="bg-red-700">
                  <th colSpan={6}></th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase min-w-[140px]">SATUAN</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase min-w-[140px]">ONGKIR</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase min-w-[140px]">ADMIN</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase min-w-[140px]">FEE</th>
                  <th className="px-3 py-2 text-center text-xs font-bold uppercase min-w-[160px]">TOTAL</th>
                  <th colSpan={4}></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => {
                  const vendor = vendors.find(v => v.id === Number(headerData.vendor_id));
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-center text-sm font-bold">{index + 1}</td>
                      <td className="px-3 py-3 text-sm">
                        <span className="text-gray-600">{headerData.user || '-'}</span>
                      </td>
                      <td className="px-3 py-3 text-sm">
                        <span className="text-gray-600">{headerData.po_number || '-'}</span>
                      </td>
                      <td className="px-3 py-3">
                        <textarea
                          value={item.detail_pekerjaan}
                          onChange={(e) => handleItemChange(item.id, 'detail_pekerjaan', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                            errors[`item_${index}_detail`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          rows={2}
                          placeholder="Deskripsi barang/jasa..."
                        />
                        {errors[`item_${index}_detail`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_detail`]}</p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                          className={`w-full px-2 py-1 text-sm text-center border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                            errors[`item_${index}_qty`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          min="1"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={item.satuan}
                          onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                          className="w-full px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="EA"
                        />
                      </td>
                      <td className="px-3 py-3 min-w-[140px]">
                        <div className="text-xs text-gray-500 mb-1">Rp</div>
                        <input
                          type="number"
                          value={item.harga_satuan}
                          onChange={(e) => handleItemChange(item.id, 'harga_satuan', Number(e.target.value))}
                          className={`w-full min-w-[120px] px-2 py-1 text-sm text-right border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400 ${
                            errors[`item_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          min="0"
                          step="1000"
                          placeholder="0"
                        />
                        {item.harga_satuan > 0 && (
                          <div className="text-xs text-gray-600 mt-1">{formatRupiah(item.harga_satuan)}</div>
                        )}
                      </td>
                      <td className="px-3 py-3 min-w-[140px]">
                        <div className="text-xs text-gray-500 mb-1">Rp</div>
                        <input
                          type="number"
                          value={item.ongkir}
                          onChange={(e) => handleItemChange(item.id, 'ongkir', Number(e.target.value))}
                          className="w-full min-w-[120px] px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                          min="0"
                          step="1000"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-3 min-w-[140px]">
                        <div className="text-xs text-gray-500 mb-1">Rp</div>
                        <input
                          type="number"
                          value={item.admin}
                          onChange={(e) => handleItemChange(item.id, 'admin', Number(e.target.value))}
                          className="w-full min-w-[120px] px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                          min="0"
                          step="1000"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-3 min-w-[140px]">
                        <div className="text-xs text-gray-500 mb-1">Rp</div>
                        <input
                          type="number"
                          value={item.fee}
                          onChange={(e) => handleItemChange(item.id, 'fee', Number(e.target.value))}
                          className="w-full min-w-[120px] px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                          min="0"
                          step="1000"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-3 py-3 bg-blue-50 min-w-[160px]">
                        <div className="text-xs text-gray-500 mb-1">Rp</div>
                        <div className="font-bold text-sm text-blue-900 text-right">
                          {formatRupiah(item.total)}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-center">
                        <span className="text-gray-700">{vendor?.name || '-'}</span>
                      </td>
                      <td className="px-3 py-3 text-sm text-center">
                        <span className="text-gray-700">
                          {vendor ? `${vendor.bank_name}\n${vendor.account_number}` : '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm text-center">
                        <span className="text-gray-700">{headerData.payment_term || '-'}</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-bold"
                          title="Hapus Item"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="bg-gray-800 text-white font-bold">
                  <td colSpan={6} className="px-3 py-4 text-right">TOTAL</td>
                  <td className="px-3 py-4"></td>
                  <td className="px-3 py-4"></td>
                  <td className="px-3 py-4"></td>
                  <td className="px-3 py-4 text-right">Rp</td>
                  <td className="px-3 py-4 text-right text-lg">{formatRupiah(calculateGrandTotal())}</td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Link
            href={`/purchases/${id}`}
            className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg shadow-lg"
          >
            💾 Update Pembelian ({items.length} Item)
          </button>
        </div>
      </form>
    </Layout>
  );
}
