import Layout from '@/components/Layout';
import { getInquiryById, vendors, items } from '@/services/dummy';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function EditInquiryPage() {
  const router = useRouter();
  const { id } = router.query;
  const inquiry = getInquiryById(Number(id));

  const [formData, setFormData] = useState({
    vendor_id: '',
    item_id: '',
    vendor_item_name: '',
    link_url: '',
    subject: '',
    message: '',
    reply_message: '',
    qty: 1,
    unit: 'EA',
    price_unit: 0,
    vendor_status: 'pending',
    status: 'sent',
  });

  useEffect(() => {
    if (inquiry) {
      setFormData({
        vendor_id: inquiry.vendor_id.toString(),
        item_id: inquiry.item_id.toString(),
        vendor_item_name: inquiry.vendor_item_name || '',
        link_url: inquiry.link_url || '',
        subject: inquiry.subject,
        message: inquiry.message,
        reply_message: inquiry.reply_message || '',
        qty: inquiry.qty,
        unit: inquiry.unit,
        price_unit: inquiry.price_unit,
        vendor_status: inquiry.vendor_status,
        status: inquiry.status,
      });
    }
  }, [inquiry]);

  const selectedItem = formData.item_id ? items.find(item => item.id === Number(formData.item_id)) : null;

  if (!inquiry) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Inquiry tidak ditemukan</h2>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendor_id || !formData.item_id || !formData.subject) {
      alert('Vendor, Barang, dan Subject wajib diisi!');
      return;
    }

    const price_total = formData.qty * formData.price_unit;

    console.log('Data inquiry diupdate:', {
      ...formData,
      price_total,
      id: inquiry.id,
    });

    alert('Inquiry berhasil diupdate!');
    router.push(`/inquiries/${inquiry.id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vendor_id' || name === 'item_id' || name === 'qty' || name === 'price_unit'
        ? Number(value) || ''
        : value,
    }));
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const price_total = formData.qty * formData.price_unit;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Inquiry</h1>
        <p className="text-gray-600 mt-1">Update informasi inquiry #{inquiry.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor */}
          <div>
            <label htmlFor="vendor_id" className="block text-sm font-bold text-gray-700 mb-2">
              Vendor <span className="text-red-500">*</span>
            </label>
            <select
              id="vendor_id"
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="">-- Pilih Vendor --</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Item */}
          <div>
            <label htmlFor="item_id" className="block text-sm font-bold text-gray-700 mb-2">
              Barang <span className="text-red-500">*</span>
            </label>
            <select
              id="item_id"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="">-- Pilih Barang --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            
            {/* Display item photo when selected */}
            {selectedItem && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Image 
                      src={selectedItem.photo_url} 
                      alt={selectedItem.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{selectedItem.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{selectedItem.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Kategori:</span>
                        <span className="ml-1 font-semibold text-gray-900">{selectedItem.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Satuan:</span>
                        <span className="ml-1 font-semibold text-gray-900">{selectedItem.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Garansi:</span>
                        <span className="ml-1 font-semibold text-gray-900">{selectedItem.warranty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nama Barang dari Vendor */}
          <div>
            <label htmlFor="vendor_item_name" className="block text-sm font-bold text-gray-700 mb-2">
              Nama Barang dari Vendor
            </label>
            <input
              type="text"
              id="vendor_item_name"
              name="vendor_item_name"
              value={formData.vendor_item_name}
              onChange={handleChange}
              placeholder="Contoh: MAJUN MERAH - Lap Kain Premium"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Link URL */}
          <div>
            <label htmlFor="link_url" className="block text-sm font-bold text-gray-700 mb-2">
              Link Produk
            </label>
            <input
              type="url"
              id="link_url"
              name="link_url"
              value={formData.link_url}
              onChange={handleChange}
              placeholder="https://tokopedia.com/toko/produk"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
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
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            ></textarea>
          </div>

          {/* Reply Message */}
          <div>
            <label htmlFor="reply_message" className="block text-sm font-bold text-gray-700 mb-2">
              Balasan dari Vendor
            </label>
            <textarea
              id="reply_message"
              name="reply_message"
              value={formData.reply_message}
              onChange={handleChange}
              rows={3}
              placeholder="Balasan vendor (jika ada)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            ></textarea>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qty" className="block text-sm font-bold text-gray-700 mb-2">
                Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="qty"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-bold text-gray-700 mb-2">
                Satuan <span className="text-red-500">*</span>
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="EA">EA (Each)</option>
                <option value="PCS">PCS (Pieces)</option>
                <option value="SET">SET</option>
                <option value="UNIT">UNIT</option>
                <option value="BOX">BOX</option>
                <option value="ROLL">ROLL</option>
                <option value="METER">METER</option>
              </select>
            </div>
          </div>

          {/* Price Unit */}
          <div>
            <label htmlFor="price_unit" className="block text-sm font-bold text-gray-700 mb-2">
              Harga Satuan (Rp)
            </label>
            <input
              type="number"
              id="price_unit"
              name="price_unit"
              value={formData.price_unit}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Price Total */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">Total Harga:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatRupiah(price_total)}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {formData.qty} {formData.unit} × {formatRupiah(formData.price_unit)}
            </p>
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
                value={formData.vendor_status}
                onChange={handleChange}
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
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="sent">Sent</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
