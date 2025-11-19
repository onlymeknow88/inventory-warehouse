import Layout from '@/components/Layout';
import { tenders } from '@/services/dummy';
import { useState } from 'react';

export default function TenderRecapPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedStatus, setSelectedStatus] = useState('all');

  const years = Array.from(new Set(tenders.map(t => new Date(t.created_at).getFullYear())));

  const filteredTenders = tenders.filter(t => {
    const year = new Date(t.created_at).getFullYear().toString();
    const matchYear = year === selectedYear;
    const matchStatus = selectedStatus === 'all' || t.status_tender === selectedStatus;
    return matchYear && matchStatus;
  });

  const totalModalTender = filteredTenders.reduce((sum, t) => sum + t.nominal_modal, 0);
  const totalPenawaranExc = filteredTenders.reduce((sum, t) => sum + t.penawaran_exc, 0);
  const totalPemenang = filteredTenders.filter(t => t.status_tender === 'menang_tender').reduce((sum, t) => sum + t.nominal_pemenang, 0);
  const winRate = filteredTenders.length > 0 ? (filteredTenders.filter(t => t.status_tender === 'menang_tender').length / filteredTenders.length) * 100 : 0;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      menang_tender: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'MENANG' },
      kalah_tender: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', label: 'KALAH' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', label: 'PENDING' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return { classes: `${config.bg} ${config.text} ${config.border}`, label: config.label };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('Export ke Excel/PDF (fitur dalam pengembangan)');
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Rekap Tender</h1>
            <p className="text-gray-600 mt-1">Laporan rekapitulasi tender per tahun</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              📥 Export
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="menang_tender">Menang Tender</option>
              <option value="kalah_tender">Kalah Tender</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Tender</div>
          <div className="text-3xl font-bold mt-2">{filteredTenders.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Menang</div>
          <div className="text-3xl font-bold mt-2">
            {filteredTenders.filter(t => t.status_tender === 'menang_tender').length}
          </div>
          <div className="text-xs opacity-75 mt-1">{winRate.toFixed(1)}% win rate</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Kalah</div>
          <div className="text-3xl font-bold mt-2">
            {filteredTenders.filter(t => t.status_tender === 'kalah_tender').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Pending</div>
          <div className="text-3xl font-bold mt-2">
            {filteredTenders.filter(t => t.status_tender === 'pending').length}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 mb-2">Total Modal Tender</div>
          <div className="text-2xl font-bold text-purple-600">{formatRupiah(totalModalTender)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-2">Total Penawaran Exc.</div>
          <div className="text-2xl font-bold text-blue-600">{formatRupiah(totalPenawaranExc)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-2">Total Nilai Pemenang</div>
          <div className="text-2xl font-bold text-green-600">{formatRupiah(totalPemenang)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  No. Surat
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Judul Pekerjaan
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Perusahaan
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Modal
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Penawaran Exc.
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Nilai Pemenang
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenders.map((tender) => {
                const statusBadge = getStatusBadge(tender.status_tender);
                return (
                  <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(tender.tender_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">{tender.letter_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{tender.job_title}</div>
                      {tender.notes && (
                        <div className="text-xs text-gray-500 mt-1">{tender.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tender.company_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-purple-600">
                        {formatRupiah(tender.nominal_modal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-blue-600">
                        {formatRupiah(tender.penawaran_exc)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-green-600">
                        {tender.status_tender === 'menang_tender' 
                          ? formatRupiah(tender.nominal_pemenang)
                          : '-'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.classes}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr className="font-bold">
                <td colSpan={4} className="px-6 py-4 text-right text-gray-900">
                  TOTAL:
                </td>
                <td className="px-6 py-4 text-right text-purple-600">
                  {formatRupiah(totalModalTender)}
                </td>
                <td className="px-6 py-4 text-right text-blue-600">
                  {formatRupiah(totalPenawaranExc)}
                </td>
                <td className="px-6 py-4 text-right text-green-600 text-lg">
                  {formatRupiah(totalPemenang)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {filteredTenders.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada data</h3>
            <p className="mt-1 text-sm text-gray-500">Tidak ada tender untuk filter yang dipilih</p>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      {filteredTenders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Win Rate</span>
                <span className="text-2xl font-bold text-green-600">{winRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Avg Nilai Pemenang</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatRupiah(filteredTenders.filter(t => t.status_tender === 'menang_tender').length > 0 
                    ? totalPemenang / filteredTenders.filter(t => t.status_tender === 'menang_tender').length 
                    : 0
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Proyek Menang</span>
                <span className="text-2xl font-bold text-purple-600">
                  {filteredTenders.filter(t => t.status_tender === 'menang_tender').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Status PO</h3>
            <div className="space-y-2">
              {Array.from(new Set(filteredTenders.map(t => t.status_po))).map(status => {
                const count = filteredTenders.filter(t => t.status_po === status).length;
                const percentage = (count / filteredTenders.length) * 100;
                return (
                  <div key={status} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{status}</span>
                      <span className="text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
