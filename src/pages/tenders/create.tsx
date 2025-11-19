import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateTenderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tender_date: new Date().toISOString().split('T')[0],
    letter_number: '',
    job_title: '',
    company_name: '',
    status_po: '',
    nominal_modal: 0,
    penawaran_exc: 0,
    spare_nego: 0,
    nominal_nego: 0,
    status_tender: 'pending',
    nominal_pemenang: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.letter_number || !formData.job_title || !formData.company_name) {
      alert('No. Surat, Judul Pekerjaan, dan Nama Perusahaan wajib diisi!');
      return;
    }

    console.log('Data tender baru:', formData);
    alert('Tender berhasil dibuat!');
    router.push('/tenders');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nominal_modal' || 
              name === 'penawaran_exc' || 
              name === 'spare_nego' || 
              name === 'nominal_nego' || 
              name === 'nominal_pemenang'
        ? Number(value) || 0
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

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Tender</h1>
        <p className="text-gray-600 mt-1">Buat tender baru untuk lelang proyek</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tanggal Tender */}
              <div>
                <label htmlFor="tender_date" className="block text-sm font-bold text-gray-700 mb-2">
                  Tanggal Tender <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="tender_date"
                  name="tender_date"
                  value={formData.tender_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* No Surat */}
              <div>
                <label htmlFor="letter_number" className="block text-sm font-bold text-gray-700 mb-2">
                  No. Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="letter_number"
                  name="letter_number"
                  value={formData.letter_number}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: TDR/2024/001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Judul Pekerjaan */}
              <div className="md:col-span-2">
                <label htmlFor="job_title" className="block text-sm font-bold text-gray-700 mb-2">
                  Judul Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Pengadaan Alat Elektronik untuk Kantor Pusat"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Nama Perusahaan */}
              <div>
                <label htmlFor="company_name" className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: PT. Pemberi Kerja"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Status PO */}
              <div>
                <label htmlFor="status_po" className="block text-sm font-bold text-gray-700 mb-2">
                  Status PO
                </label>
                <input
                  type="text"
                  id="status_po"
                  name="status_po"
                  value={formData.status_po}
                  onChange={handleChange}
                  placeholder="Contoh: Belum ada PO"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Keuangan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nominal Modal */}
              <div>
                <label htmlFor="nominal_modal" className="block text-sm font-bold text-gray-700 mb-2">
                  Nominal Modal (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="nominal_modal"
                  name="nominal_modal"
                  value={formData.nominal_modal}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {formatRupiah(formData.nominal_modal)}
                </p>
              </div>

              {/* Penawaran Exc */}
              <div>
                <label htmlFor="penawaran_exc" className="block text-sm font-bold text-gray-700 mb-2">
                  Penawaran Exc (Rp)
                </label>
                <input
                  type="number"
                  id="penawaran_exc"
                  name="penawaran_exc"
                  value={formData.penawaran_exc}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {formatRupiah(formData.penawaran_exc)}
                </p>
              </div>

              {/* Spare Nego */}
              <div>
                <label htmlFor="spare_nego" className="block text-sm font-bold text-gray-700 mb-2">
                  Spare Nego (Rp)
                </label>
                <input
                  type="number"
                  id="spare_nego"
                  name="spare_nego"
                  value={formData.spare_nego}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {formatRupiah(formData.spare_nego)}
                </p>
              </div>

              {/* Nominal Nego */}
              <div>
                <label htmlFor="nominal_nego" className="block text-sm font-bold text-gray-700 mb-2">
                  Nominal Nego (Rp)
                </label>
                <input
                  type="number"
                  id="nominal_nego"
                  name="nominal_nego"
                  value={formData.nominal_nego}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {formatRupiah(formData.nominal_nego)}
                </p>
              </div>
            </div>
          </div>

          {/* Tender Result */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Hasil Tender</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Tender */}
              <div>
                <label htmlFor="status_tender" className="block text-sm font-bold text-gray-700 mb-2">
                  Status Tender <span className="text-red-500">*</span>
                </label>
                <select
                  id="status_tender"
                  name="status_tender"
                  value={formData.status_tender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="menang_tender">Menang Tender</option>
                  <option value="kalah_tender">Kalah Tender</option>
                </select>
              </div>

              {/* Nominal Pemenang */}
              <div>
                <label htmlFor="nominal_pemenang" className="block text-sm font-bold text-gray-700 mb-2">
                  Nominal Pemenang (Rp)
                </label>
                <input
                  type="number"
                  id="nominal_pemenang"
                  name="nominal_pemenang"
                  value={formData.nominal_pemenang}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {formatRupiah(formData.nominal_pemenang)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Catatan tambahan tentang tender ini..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            ></textarea>
          </div>

          {/* Summary Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Ringkasan Keuangan</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nominal Modal:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formatRupiah(formData.nominal_modal)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Penawaran Exc:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formatRupiah(formData.penawaran_exc)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Spare Nego:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formatRupiah(formData.spare_nego)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Nominal Nego:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formatRupiah(formData.nominal_nego)}
                </span>
              </div>
              <div className="col-span-2 border-t border-blue-300 pt-3 mt-2">
                <span className="text-gray-700 font-bold">Nominal Pemenang:</span>
                <span className="float-right font-bold text-green-600 text-lg">
                  {formatRupiah(formData.nominal_pemenang)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
            >
              Simpan Tender
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
