import { items, vendors } from '@/services/dummy';

import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface InquiryItem {
  id: string;
  item_id: number;
  vendor_item_name: string;
  link_url: string;
  qty: number;
  unit: string;
  price_unit: number;
  price_total: number;
  warranty?: string;
  documents?: string;
  photo_url?: string;
  photo_file?: File | null;
}

export default function CreateInquiryPage() {
  const router = useRouter();
  const [headerData, setHeaderData] = useState({
    vendor_id: '',
    subject: '',
    message: '',
  });

  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([
    {
      id: Date.now().toString(),
      item_id: 0,
      vendor_item_name: '',
      link_url: '',
      qty: 1,
      unit: 'EA',
      price_unit: 0,
      price_total: 0,
      warranty: '',
      documents: '',
      photo_url: '',
      photo_file: null,
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({
      ...prev,
      [name]: name === 'vendor_id' ? Number(value) || '' : value,
    }));
  };

  const handleItemChange = (id: string, field: keyof InquiryItem, value: string | number) => {
    setInquiryItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Auto calculate total
        if (['qty', 'price_unit'].includes(field)) {
          updatedItem.price_total = updatedItem.qty * updatedItem.price_unit;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleFileChange = (id: string, file: File | null) => {
    setInquiryItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          photo_file: file,
          photo_url: file ? URL.createObjectURL(file) : '',
        };
      }
      return item;
    }));
  };

  const addItem = () => {
    setInquiryItems(prev => [...prev, {
      id: Date.now().toString(),
      item_id: 0,
      vendor_item_name: '',
      link_url: '',
      qty: 1,
      unit: 'EA',
      price_unit: 0,
      price_total: 0,
      warranty: '',
      documents: '',
      photo_url: '',
      photo_file: null,
    }]);
  };

  const removeItem = (id: string) => {
    if (inquiryItems.length > 1) {
      setInquiryItems(prev => prev.filter(item => item.id !== id));
    } else {
      alert('Minimal harus ada 1 item');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    const newErrors: Record<string, string> = {};
    
    if (!headerData.vendor_id) {
      newErrors.vendor_id = 'Vendor wajib dipilih';
    }
    
    if (!headerData.subject) {
      newErrors.subject = 'Subject wajib diisi';
    }

    inquiryItems.forEach((item, index) => {
      if (!item.item_id) {
        newErrors[`item_${index}_barang`] = 'Barang wajib dipilih';
      }
      if (item.qty < 1) {
        newErrors[`item_${index}_qty`] = 'Qty minimal 1';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Mohon lengkapi data yang wajib diisi!');
      return;
    }

    const grandTotal = inquiryItems.reduce((sum, item) => sum + item.price_total, 0);

    console.log('Data inquiry baru:', {
      ...headerData,
      items: inquiryItems,
      grand_total: grandTotal,
      vendor_status: 'pending',
      status: 'sent',
      inquiry_date: new Date().toISOString().split('T')[0],
    });

    alert('Inquiry berhasil dibuat!');
    router.push('/inquiries');
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const grandTotal = inquiryItems.reduce((sum, item) => sum + item.price_total, 0);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Inquiry (Multiple Items)</h1>
        <p className="text-gray-600 mt-1">Buat inquiry baru ke vendor dengan multiple items</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Utama</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vendor */}
            <div>
              <label htmlFor="vendor_id" className="block text-sm font-bold text-gray-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={headerData.vendor_id}
                onChange={handleHeaderChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
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

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={headerData.subject}
                onChange={handleHeaderChange}
                required
                placeholder="Inquiry Harga Produk"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
          </div>

          {/* Message */}
          <div className="mt-4">
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              value={headerData.message}
              onChange={handleHeaderChange}
              rows={3}
              placeholder="Mohon info harga, stock, dan estimasi pengiriman..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            ></textarea>
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
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-12">NO</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase min-w-[200px]">BARANG</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase min-w-[200px]">NAMA VENDOR</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase min-w-[200px]">LINK PRODUK</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-20">QTY</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-24">SATUAN</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase min-w-[140px]">HARGA SATUAN</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase min-w-[160px]">TOTAL</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase min-w-[150px]">GARANSI</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase min-w-[150px]">DOKUMEN</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase min-w-[150px]">FOTO</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase w-20">AKSI</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiryItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-center text-sm font-bold">{index + 1}</td>
                    
                    {/* Barang */}
                    <td className="px-3 py-3">
                      <select
                        value={item.item_id}
                        onChange={(e) => handleItemChange(item.id, 'item_id', Number(e.target.value))}
                        className={`w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                          errors[`item_${index}_barang`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="0">-- Pilih Barang --</option>
                        {items.map(i => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </select>
                      {errors[`item_${index}_barang`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_barang`]}</p>
                      )}
                    </td>

                    {/* Nama Vendor */}
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={item.vendor_item_name}
                        onChange={(e) => handleItemChange(item.id, 'vendor_item_name', e.target.value)}
                        placeholder="Nama dari vendor"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </td>

                    {/* Link */}
                    <td className="px-3 py-3">
                      <input
                        type="url"
                        value={item.link_url}
                        onChange={(e) => handleItemChange(item.id, 'link_url', e.target.value)}
                        placeholder="https://"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </td>

                    {/* Qty */}
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                        min="1"
                        className={`w-full px-2 py-1 text-sm text-center border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                          errors[`item_${index}_qty`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </td>

                    {/* Satuan */}
                    <td className="px-3 py-3">
                      <select
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        className="w-full px-2 py-1 text-sm text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      >
                        <option value="EA">EA</option>
                        <option value="PCS">PCS</option>
                        <option value="SET">SET</option>
                        <option value="UNIT">UNIT</option>
                        <option value="BOX">BOX</option>
                        <option value="ROLL">ROLL</option>
                      </select>
                    </td>

                    {/* Harga Satuan */}
                    <td className="px-3 py-3 min-w-[140px]">
                      <div className="text-xs text-gray-500 mb-1">Rp</div>
                      <input
                        type="number"
                        value={item.price_unit}
                        onChange={(e) => handleItemChange(item.id, 'price_unit', Number(e.target.value))}
                        min="0"
                        step="1000"
                        placeholder="0"
                        className="w-full min-w-[120px] px-2 py-1 text-sm text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                      />
                      {item.price_unit > 0 && (
                        <div className="text-xs text-gray-600 mt-1">{formatRupiah(item.price_unit)}</div>
                      )}
                    </td>

                    {/* Total */}
                    <td className="px-3 py-3 bg-blue-50 min-w-[160px]">
                      <div className="text-xs text-gray-500 mb-1">Rp</div>
                      <div className="font-bold text-sm text-blue-900 text-right">
                        {formatRupiah(item.price_total)}
                      </div>
                    </td>

                    {/* Garansi */}
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={item.warranty || ''}
                        onChange={(e) => handleItemChange(item.id, 'warranty', e.target.value)}
                        placeholder="Contoh: 1 Tahun"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                      />
                    </td>

                    {/* Dokumen */}
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={item.documents || ''}
                        onChange={(e) => handleItemChange(item.id, 'documents', e.target.value)}
                        placeholder="Contoh: MSDS, COA"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                      />
                    </td>

                    {/* Foto */}
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange(item.id, file);
                          }}
                          className="block w-full text-xs text-gray-900 border border-gray-300 rounded cursor-pointer bg-white focus:outline-none"
                        />
                        {item.photo_url && (
                          <div className="relative">
                            <div className="w-20 h-20 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                              <span className="text-gray-500">📷</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileChange(item.id, null)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                              title="Hapus foto"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Hapus item"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-blue-50">
                <tr>
                  <td colSpan={10} className="px-3 py-3 text-right text-sm font-bold text-blue-900">GRAND TOTAL:</td>
                  <td className="px-3 py-3 text-right text-lg font-bold text-blue-900">{formatRupiah(grandTotal)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
          >
            💾 Simpan Inquiry
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </Layout>
  );
}
