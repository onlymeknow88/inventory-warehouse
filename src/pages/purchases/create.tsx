import Layout from '@/components/Layout';
import { vendors } from '@/services/dummy';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CreatePurchase() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    po_number: '',
    job_detail: '',
    qty: 1,
    unit: '',
    price_unit: 0,
    price_shipping: 0,
    price_admin: 0,
    price_fee: 0,
    vendor_id: '',
    payment_term: '',
    delivery_deadline: '',
    expedition: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['qty', 'price_unit', 'price_shipping', 'price_admin', 'price_fee', 'vendor_id'].includes(name)
        ? Number(value) || 0
        : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.qty * formData.price_unit;
    return subtotal + formData.price_shipping + formData.price_admin + formData.price_fee;
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
    
    if (!formData.po_number.trim()) newErrors.po_number = 'PO Number wajib diisi';
    if (!formData.job_detail.trim()) newErrors.job_detail = 'Detail Pekerjaan wajib diisi';
    if (formData.qty <= 0) newErrors.qty = 'Quantity harus lebih dari 0';
    if (!formData.unit.trim()) newErrors.unit = 'Unit wajib diisi';
    if (formData.price_unit <= 0) newErrors.price_unit = 'Harga Satuan harus lebih dari 0';
    if (!formData.vendor_id) newErrors.vendor_id = 'Vendor wajib dipilih';
    if (!formData.payment_term.trim()) newErrors.payment_term = 'Payment Term wajib diisi';
    if (!formData.expedition.trim()) newErrors.expedition = 'Expedisi wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Simulate save
    const newPurchase = {
      ...formData,
      id: Math.floor(Math.random() * 10000),
      price_total: calculateTotal(),
      status: 'pending',
      user_id: 1, // Current user
      created_at: new Date().toISOString(),
    };

    console.log('Saving purchase:', newPurchase);
    alert('Pembelian berhasil disimpan! (Dummy data)');
    router.push('/purchases');
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/purchases" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Daftar Pembelian
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Tambah Pembelian Baru</h1>
        <p className="text-gray-600 mt-1">Isi form di bawah untuk membuat pembelian baru</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Dasar</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="po_number"
                    value={formData.po_number}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.po_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: PO-2024-001"
                  />
                  {errors.po_number && <p className="text-red-500 text-sm mt-1">{errors.po_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detail Pekerjaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="job_detail"
                    value={formData.job_detail}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.job_detail ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deskripsikan detail pekerjaan atau barang yang dibeli..."
                  />
                  {errors.job_detail && <p className="text-red-500 text-sm mt-1">{errors.job_detail}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.qty ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.unit ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: pcs, kg, m"
                    />
                    {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rincian Harga</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Satuan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price_unit"
                    value={formData.price_unit}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price_unit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.price_unit && <p className="text-red-500 text-sm mt-1">{errors.price_unit}</p>}
                  {formData.price_unit > 0 && (
                    <p className="text-gray-600 text-sm mt-1">{formatRupiah(formData.price_unit)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ongkir
                  </label>
                  <input
                    type="number"
                    name="price_shipping"
                    value={formData.price_shipping}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  {formData.price_shipping > 0 && (
                    <p className="text-gray-600 text-sm mt-1">{formatRupiah(formData.price_shipping)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Admin
                  </label>
                  <input
                    type="number"
                    name="price_admin"
                    value={formData.price_admin}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  {formData.price_admin > 0 && (
                    <p className="text-gray-600 text-sm mt-1">{formatRupiah(formData.price_admin)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Lainnya
                  </label>
                  <input
                    type="number"
                    name="price_fee"
                    value={formData.price_fee}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  {formData.price_fee > 0 && (
                    <p className="text-gray-600 text-sm mt-1">{formatRupiah(formData.price_fee)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Pengiriman</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expedisi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="expedition"
                    value={formData.expedition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.expedition ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: JNE, JNT, SiCepat"
                  />
                  {errors.expedition && <p className="text-red-500 text-sm mt-1">{errors.expedition}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline Pengiriman
                  </label>
                  <input
                    type="date"
                    name="delivery_deadline"
                    value={formData.delivery_deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Term <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="payment_term"
                    value={formData.payment_term}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.payment_term ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: 30 hari, COD, DP 50%"
                  />
                  {errors.payment_term && <p className="text-red-500 text-sm mt-1">{errors.payment_term}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendor Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vendor</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                {errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id}</p>}

                {formData.vendor_id && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    {(() => {
                      const selectedVendor = vendors.find(v => v.id === Number(formData.vendor_id));
                      return selectedVendor ? (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Telepon:</span>
                            <p className="text-gray-900">{selectedVendor.phone}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Alamat:</span>
                            <p className="text-gray-900">{selectedVendor.address}</p>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Total Pembelian</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(formData.qty * formData.price_unit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Ongkir:</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(formData.price_shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Admin:</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(formData.price_admin)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Fee:</span>
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(formData.price_fee)}
                  </span>
                </div>
                
                <div className="border-t-2 border-blue-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-900">TOTAL:</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {formatRupiah(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg shadow-lg"
              >
                💾 Simpan Pembelian
              </button>
              <Link
                href="/purchases"
                className="block w-full px-4 py-3 bg-gray-300 text-gray-800 text-center rounded-lg hover:bg-gray-400 font-medium"
              >
                Batal
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
}
