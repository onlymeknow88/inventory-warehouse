import Layout from '@/components/Layout';
import { tenders, getDashboardStats } from '@/services/dummy';
import Link from 'next/link';
import { useState } from 'react';

export default function TendersIndex() {
  const stats = getDashboardStats();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgent, setFilterUrgent] = useState('all');

  const filteredTenders = tenders.filter(tender => {
    const matchSearch = 
      tender.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.letter_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || tender.status_tender === filterStatus;
    const matchUrgent = filterUrgent === 'all' ||
      (filterUrgent === 'urgent' && tender.is_urgent) ||
      (filterUrgent === 'normal' && !tender.is_urgent);

    return matchSearch && matchStatus && matchUrgent;
  });

  const urgentTenders = tenders.filter(t => t.is_urgent);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      menang_tender: 'bg-green-100 text-green-800 border-green-300',
      kalah_tender: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    const statusText = {
      menang_tender: 'MENANG TENDER',
      kalah_tender: 'KALAH TENDER',
      pending: 'PENDING',
    };
    return {
      class: statusColors[status as keyof typeof statusColors] || 'bg-gray-100',
      text: statusText[status as keyof typeof statusText] || status,
    };
  };

  const totalNilaiMenang = filteredTenders
    .filter(t => t.status_tender === 'menang_tender')
    .reduce((sum, t) => sum + t.nominal_pemenang, 0);

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Tender</h1>
          <p className="text-gray-600 mt-1">Kelola tender dan pemenang lelang</p>
        </div>
        <Link
          href="/tenders/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Tambah Tender
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Cari judul pekerjaan, perusahaan, atau no. surat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="menang_tender">Menang Tender</option>
            <option value="kalah_tender">Kalah Tender</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filterUrgent}
            onChange={(e) => setFilterUrgent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          >
            <option value="all">Semua</option>
            <option value="urgent">🔥 Urgent Saja</option>
            <option value="normal">Normal Saja</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Menampilkan {filteredTenders.length} dari {tenders.length} tender
          {urgentTenders.length > 0 && (
            <span className="ml-2 text-orange-600 font-semibold">
              ({urgentTenders.length} Urgent)
            </span>
          )}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.totalTenders}</div>
          <div className="text-lg opacity-90">Total Tender</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.tenderByStatus.menang_tender}</div>
          <div className="text-lg opacity-90">Menang Tender</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.tenderByStatus.kalah_tender}</div>
          <div className="text-lg opacity-90">Kalah Tender</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold mb-2">{stats.tenderByStatus.pending}</div>
          <div className="text-lg opacity-90">Pending</div>
        </div>
      </div>

      {/* Total Nilai Menang */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Total Nilai Pemenang</p>
            <p className="text-2xl font-bold text-green-900">{formatRupiah(totalNilaiMenang)}</p>
          </div>
        </div>
      </div>

      {/* Tender List */}
      {filteredTenders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">No</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Tanggal</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">No. Surat</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Judul Pekerjaan</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Perusahaan</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Nominal Modal</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Nominal Pemenang</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenders.map((tender, index) => {
                  const status = getStatusBadge(tender.status_tender);
                  return (
                    <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(tender.tender_date)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{tender.letter_number}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {tender.is_urgent && (
                            <span className="text-orange-500 text-lg" title="Urgent">🔥</span>
                          )}
                          <span>{tender.job_title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{tender.company_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">{formatRupiah(tender.nominal_modal)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                        {tender.nominal_pemenang > 0 ? formatRupiah(tender.nominal_pemenang) : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-1 flex-wrap">
                          <Link 
                            href={`/tenders/${tender.id}`} 
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Lihat
                          </Link>
                          <Link 
                            href={`/tenders/${tender.id}/edit`} 
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Edit
                          </Link>
                          {/* Routing Logic */}
                          {tender.is_urgent ? (
                            <Link
                              href={`/purchases/create?tenderId=${tender.id}`}
                              className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                              title="Urgent - Langsung ke Form Pembelian"
                            >
                              🔥 Beli
                            </Link>
                          ) : tender.status_tender === 'menang_tender' ? (
                            <Link
                              href={`/purchases/create?tenderId=${tender.id}`}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              title="Menang - Lanjut ke Form Pembelian"
                            >
                              ✓ Beli
                            </Link>
                          ) : tender.status_tender === 'kalah_tender' ? (
                            <Link
                              href={`/reports/purchase-recap?tenderId=${tender.id}`}
                              className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                              title="Kalah - Input ke Rekap"
                            >
                              📄 Rekap
                            </Link>
                          ) : (
                            <Link
                              href={`/inquiries/create?tenderId=${tender.id}`}
                              className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                              title="Pending - Lanjut ke Form Barang/Jasa"
                            >
                              📋 Inquiry
                            </Link>
                          )}
                          <button 
                            onClick={() => confirm('Yakin ingin menghapus?') && alert('Hapus: ' + tender.job_title)} 
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg text-center py-12">
          <p className="text-gray-500">Belum ada data tender.</p>
        </div>
      )}
    </Layout>
  );
}
