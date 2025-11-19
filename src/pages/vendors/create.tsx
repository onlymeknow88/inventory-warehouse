import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function VendorCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    payment_term: '',
    status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save vendor
    console.log('Vendor data:', formData);
    alert('Vendor berhasil ditambahkan!');
    router.push('/vendors');
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Vendor Baru</h1>
        <p className="text-gray-600 mt-1">Isi formulir di bawah untuk menambahkan vendor baru</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Vendor */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Nama Vendor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Contoh: PT. Elektronik Jaya"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="vendor@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="021-12345678"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Alamat lengkap vendor"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label htmlFor="bank_name" className="block text-sm font-bold text-gray-700 mb-2">
                Nama Bank <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="bank_name"
                name="bank_name"
                required
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Contoh: BCA"
              />
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="account_number" className="block text-sm font-bold text-gray-700 mb-2">
                Nomor Rekening <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="account_number"
                name="account_number"
                required
                value={formData.account_number}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="1234567890"
              />
            </div>

            {/* Account Name */}
            <div>
              <label htmlFor="account_name" className="block text-sm font-bold text-gray-700 mb-2">
                Nama Pemilik Rekening <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="account_name"
                name="account_name"
                required
                value={formData.account_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                placeholder="Nama sesuai rekening"
              />
            </div>

            {/* Payment Term */}
            <div>
              <label htmlFor="payment_term" className="block text-sm font-bold text-gray-700 mb-2">
                Termin Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                id="payment_term"
                name="payment_term"
                required
                value={formData.payment_term}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Pilih Termin</option>
                <option value="COD">COD (Cash on Delivery)</option>
                <option value="NET 7">NET 7 (7 Hari)</option>
                <option value="NET 14">NET 14 (14 Hari)</option>
                <option value="NET 30">NET 30 (30 Hari)</option>
                <option value="NET 45">NET 45 (45 Hari)</option>
                <option value="NET 60">NET 60 (60 Hari)</option>
              </select>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === 'active'}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === 'inactive'}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              💾 Simpan Vendor
            </button>
            <Link
              href="/vendors"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              ❌ Batal
            </Link>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-bold">💡 Tips:</span> Pastikan semua data yang diisi sudah benar sebelum menyimpan. Data vendor akan digunakan untuk proses pembelian dan pembayaran.
        </p>
      </div>
    </Layout>
  );
}
