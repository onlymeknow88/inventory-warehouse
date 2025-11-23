import { FORM_CODE_LABELS, FormCode } from '@/types';
import { getVendorById, purchases } from '@/services/dummy';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function PurchaseRecapPage() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [filterUrgent, setFilterUrgent] = useState('all');
  const [filterPO, setFilterPO] = useState('all');

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

  const filteredRecap = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.created_at);
    const matchYear = selectedYear === 'all' || purchaseDate.getFullYear().toString() === selectedYear;
    const matchMonth = selectedMonth === 'all' || (purchaseDate.getMonth() + 1).toString() === selectedMonth;
    const matchUrgent = filterUrgent === 'all' ||
      (filterUrgent === 'urgent' && purchase.is_urgent) ||
      (filterUrgent === 'normal' && !purchase.is_urgent);
    const matchPO = filterPO === 'all' ||
      (filterPO === 'has_po' && purchase.has_po) ||
      (filterPO === 'no_po' && !purchase.has_po);

    return matchYear && matchMonth && matchUrgent && matchPO;
  });

  const totalNominal = filteredRecap.reduce((sum, p) => sum + p.price_total, 0);
  const urgentCount = filteredRecap.filter(p => p.is_urgent).length;
  const noPOCount = filteredRecap.filter(p => !p.has_po).length;
  const urgentNoPO = filteredRecap.filter(p => p.is_urgent && !p.has_po);

  const exportToExcel = () => {
    alert('Fitur export ke Excel akan segera tersedia!\nData yang akan di-export: ' + filteredRecap.length + ' items');
  };

  const exportUrgentNoPO = () => {
    const data = urgentNoPO.map(p => ({
      'Detail Pekerjaan': p.job_detail,
      'Qty': p.qty,
      'Unit': p.unit,
      'Harga Total': p.price_total,
      'Vendor': getVendorById(p.vendor_id)?.name,
      'Tanggal': formatDate(p.created_at),
    }));
    
    console.log('Export Urgent & Belum PO:', data);
    alert(`Export ${urgentNoPO.length} item URGENT yang belum PO ke Excel/Spreadsheet`);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rekap Purchasing New</h1>
        <p className="text-gray-600 mt-1">
          Input ke rekap purchasing untuk pekerjaan yang urgent dan belum ter-PO
        </p>
      </div>

      {/* Alert for Urgent without PO */}
      {urgentNoPO.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-red-800">
                  🔥 {urgentNoPO.length} Item URGENT belum memiliki PO!
                </h3>
                <p className="text-xs text-red-700 mt-1">
                  Split rekap piutang ke user Excel/Spreadsheet jika urgent dan belum ter-PO
                </p>
              </div>
            </div>
            <button
              onClick={exportUrgentNoPO}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm shadow-sm"
            >
              📤 Export Urgent & Belum PO
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-1">Total Items</div>
          <div className="text-3xl font-bold">{filteredRecap.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-1">Total Nominal</div>
          <div className="text-2xl font-bold">{formatRupiah(totalNominal)}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-1">🔥 Urgent</div>
          <div className="text-3xl font-bold">{urgentCount}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-1">📋 Belum PO</div>
          <div className="text-3xl font-bold">{noPOCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Rekap</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Semua Tahun</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Semua Bulan</option>
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgent</label>
            <select
              value={filterUrgent}
              onChange={(e) => setFilterUrgent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Semua</option>
              <option value="urgent">🔥 Urgent Saja</option>
              <option value="normal">Normal Saja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status PO</label>
            <select
              value={filterPO}
              onChange={(e) => setFilterPO(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Semua</option>
              <option value="has_po">Sudah Ada PO</option>
              <option value="no_po">📋 Belum PO</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={exportToExcel}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
            >
              📊 Export ke Excel
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      {/* <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Alur Proses:</strong> Pekerjaan yang ter-PO ditampilkan di sheet &ldquo;Lap Pekerjaan&rdquo;. 
              Pekerjaan URGENT yang belum ter-PO akan di-split ke user Excel/Spreadsheet terpisah untuk tracking.
            </p>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">No</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Kode</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Tanggal</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">PO Number</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Detail Pekerjaan</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Qty</th>
                <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Total</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecap.length > 0 ? (
                filteredRecap.map((purchase, index) => (
                  <tr 
                    key={purchase.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      purchase.is_urgent && !purchase.has_po ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {purchase.form_code && (
                        <span 
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            purchase.form_code === 'U' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                            purchase.form_code === 'J' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                          title={FORM_CODE_LABELS[purchase.form_code as FormCode]}
                        >
                          {purchase.form_code}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(purchase.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {purchase.is_urgent && (
                          <span className="text-orange-500 text-lg" title="Urgent">🔥</span>
                        )}
                        <span className="text-sm font-bold text-blue-600">
                          {purchase.po_number || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{purchase.job_detail}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getVendorById(purchase.vendor_id)?.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {purchase.qty} {purchase.unit}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      {formatRupiah(purchase.price_total)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col gap-1">
                        {purchase.has_po ? (
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                            ✓ TER-PO
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                            📋 BELUM PO
                          </span>
                        )}
                        {purchase.is_urgent && (
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                            🔥 URGENT
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="mt-2 text-sm">Tidak ada data rekap</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link 
          href="/purchases" 
          className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          ← Kembali ke Daftar Pembelian
        </Link>
      </div>
    </Layout>
  );
}
