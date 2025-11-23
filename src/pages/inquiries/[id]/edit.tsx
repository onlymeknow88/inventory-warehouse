import { getInquiryById, items, vendors } from '@/services/dummy';
import { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

interface InquiryItem {
  id: string;
  item_id: number;
  vendor_item_name: string;
  link_url?: string;
  qty: number;
  unit: string;
  price_unit: number;
  price_total: number;
  warranty?: string;
  documents?: string;
  photo_url?: string;
  photo_file?: File | null;
}

export default function EditInquiryPage() {
  const router = useRouter();
  const { id } = router.query;
  const inquiry = getInquiryById(Number(id));

  const [headerData, setHeaderData] = useState({
    vendor_id: '',
    subject: '',
    message: '',
    reply_message: '',
    vendor_status: 'pending',
    status: 'sent',
  });

  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([
    {
      id: '1',
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
    }
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (inquiry) {
      setHeaderData({
        vendor_id: inquiry.vendor_id.toString(),
        subject: inquiry.subject,
        message: inquiry.message,
        reply_message: inquiry.reply_message || '',
        vendor_status: inquiry.vendor_status,
        status: inquiry.status,
      });

      // Load items from inquiry
      if (inquiry.items && inquiry.items.length > 0) {
        setInquiryItems(inquiry.items);
      } else {
        // Fallback to single item format
        setInquiryItems([{
          id: '1',
          item_id: inquiry.item_id,
          vendor_item_name: inquiry.vendor_item_name || '',
          link_url: inquiry.link_url || '',
          qty: inquiry.qty,
          unit: inquiry.unit,
          price_unit: inquiry.price_unit,
          price_total: inquiry.qty * inquiry.price_unit,
        }]);
      }
    }
  }, [inquiry]);

  if (!inquiry) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Inquiry tidak ditemukan</h2>
        </div>
      </Layout>
    );
  }

  const handleHeaderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({
      ...prev,
      [name]: name === 'vendor_id' ? value : value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: keyof InquiryItem, value: any) => {
    const updatedItems = [...inquiryItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto-calculate price_total when qty or price_unit changes
    if (field === 'qty' || field === 'price_unit') {
      const qty = field === 'qty' ? Number(value) : updatedItems[index].qty;
      const price_unit = field === 'price_unit' ? Number(value) : updatedItems[index].price_unit;
      updatedItems[index].price_total = qty * price_unit;
    }

    setInquiryItems(updatedItems);
    
    // Clear error for this item field
    const errorKey = `item_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    const updatedItems = [...inquiryItems];
    updatedItems[index] = {
      ...updatedItems[index],
      photo_file: file,
      photo_url: file ? URL.createObjectURL(file) : updatedItems[index].photo_url || '',
    };
    setInquiryItems(updatedItems);
  };

  const addItem = () => {
    const newId = (Math.max(...inquiryItems.map(item => Number(item.id)), 0) + 1).toString();
    setInquiryItems([...inquiryItems, {
      id: newId,
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

  const removeItem = (index: number) => {
    if (inquiryItems.length > 1) {
      setInquiryItems(inquiryItems.filter((_, i) => i !== index));
    } else {
      alert('Minimal harus ada 1 item!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};

    // Validate header
    if (!headerData.vendor_id) newErrors.vendor_id = 'Vendor wajib diisi';
    if (!headerData.subject.trim()) newErrors.subject = 'Subject wajib diisi';

    // Validate items
    inquiryItems.forEach((item, index) => {
      if (!item.item_id || item.item_id === 0) {
        newErrors[`item_${index}_item_id`] = 'Barang wajib dipilih';
      }
      if (item.qty <= 0) {
        newErrors[`item_${index}_qty`] = 'Qty harus > 0';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }

    console.log('Data inquiry diupdate:', {
      ...headerData,
      items: inquiryItems,
      id: inquiry.id,
    });

    alert('Inquiry berhasil diupdate!');
    router.push(`/inquiries/${inquiry.id}`);
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
        <h1 className="text-3xl font-bold text-gray-800">Edit Inquiry</h1>
        <p className="text-gray-600 mt-1">Update informasi inquiry #{inquiry.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* HEADER SECTION */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Inquiry</h2>
            
            {/* Vendor */}
            <div className="mb-4">
              <label htmlFor="vendor_id" className="block text-sm font-bold text-gray-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={headerData.vendor_id}
                onChange={handleHeaderChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
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
              {errors.vendor_id && (
                <p className="text-red-500 text-xs mt-1">{errors.vendor_id}</p>
              )}
            </div>

            {/* Subject */}
            <div className="mb-4">
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
                placeholder="Masukkan subject inquiry"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400 ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                value={headerData.message}
                onChange={handleHeaderChange}
                rows={4}
                placeholder="Masukkan pesan inquiry (opsional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
              ></textarea>
            </div>

            {/* Reply Message */}
            <div className="mb-4">
              <label htmlFor="reply_message" className="block text-sm font-bold text-gray-700 mb-2">
                Balasan dari Vendor
              </label>
              <textarea
                id="reply_message"
                name="reply_message"
                value={headerData.reply_message}
                onChange={handleHeaderChange}
                rows={3}
                placeholder="Balasan vendor (jika ada)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
              ></textarea>
            </div>

            {/* Status Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="vendor_status" className="block text-sm font-bold text-gray-700 mb-2">
                  Status Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  id="vendor_status"
                  name="vendor_status"
                  value={headerData.vendor_status}
                  onChange={handleHeaderChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
                  Status Inquiry <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={headerData.status}
                  onChange={handleHeaderChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="sent">Sent</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ITEMS SECTION */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Daftar Barang</h2>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                + Tambah Barang
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[50px]">NO</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[200px]">BARANG</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[180px]">NAMA VENDOR</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[150px]">LINK</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[80px]">QTY</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[100px]">SATUAN</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[140px]">HARGA SATUAN</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[140px]">TOTAL</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[120px]">GARANSI</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-bold text-gray-700 min-w-[150px]">DOKUMEN</th>
                    <th className="border border-gray-300 px-3 py-2 text-center text-sm font-bold text-gray-700 min-w-[150px]">FOTO</th>
                    <th className="border border-gray-300 px-3 py-2 text-center text-sm font-bold text-gray-700 min-w-[80px]">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiryItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <select
                          value={item.item_id}
                          onChange={(e) => handleItemChange(index, 'item_id', Number(e.target.value))}
                          className={`w-full px-2 py-1 border rounded text-sm text-gray-900 bg-white ${
                            errors[`item_${index}_item_id`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value={0}>-- Pilih Barang --</option>
                          {items.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                        </select>
                        {errors[`item_${index}_item_id`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_item_id`]}</p>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={item.vendor_item_name}
                          onChange={(e) => handleItemChange(index, 'vendor_item_name', e.target.value)}
                          placeholder="Nama dari vendor"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder-gray-400"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="url"
                          value={item.link_url}
                          onChange={(e) => handleItemChange(index, 'link_url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder-gray-400"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))}
                          min="1"
                          className={`w-full px-2 py-1 border rounded text-sm text-gray-900 bg-white ${
                            errors[`item_${index}_qty`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        >
                          <option value="EA">EA</option>
                          <option value="PCS">PCS</option>
                          <option value="SET">SET</option>
                          <option value="UNIT">UNIT</option>
                          <option value="BOX">BOX</option>
                          <option value="ROLL">ROLL</option>
                          <option value="METER">METER</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="number"
                          value={item.price_unit}
                          onChange={(e) => handleItemChange(index, 'price_unit', Number(e.target.value))}
                          min="0"
                          step="1000"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-semibold">
                        {formatRupiah(item.price_total)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={item.warranty || ''}
                          onChange={(e) => handleItemChange(index, 'warranty', e.target.value)}
                          placeholder="Contoh: 1 Tahun"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder-gray-400"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          type="text"
                          value={item.documents || ''}
                          onChange={(e) => handleItemChange(index, 'documents', e.target.value)}
                          placeholder="Contoh: MSDS, COA"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white placeholder-gray-400"
                        />
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange(index, file);
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
                                onClick={() => handleFileChange(index, null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                                title="Hapus foto"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50">
                  <tr>
                    <td colSpan={10} className="border border-gray-300 px-3 py-3 text-right font-bold text-gray-800">
                      GRAND TOTAL:
                    </td>
                    <td className="border border-gray-300 px-3 py-3 text-right font-bold text-blue-600 text-lg">
                      {formatRupiah(grandTotal)}
                    </td>
                    <td className="border border-gray-300"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold"
            >
              Update Inquiry
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
      </div>
    </Layout>
  );
}
