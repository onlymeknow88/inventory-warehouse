import { accountsReceivables, getVendorById } from '@/services/dummy';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountsReceivablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const filteredData = accountsReceivables.filter(ar => {
    const matchSearch = 
      ar.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ar.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ar.offer_letter_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ar.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || ar.status === filterStatus;
    const matchUser = filterUser === 'all' || ar.user_name === filterUser;

    return matchSearch && matchStatus && matchUser;
  });

  const uniqueUsers = Array.from(new Set(accountsReceivables.map(ar => ar.user_name)));

  const totalPiutang = filteredData.reduce((sum, ar) => sum + ar.price_total, 0);
  const totalOverdue = filteredData.filter(ar => ar.status === 'overdue').reduce((sum, ar) => sum + ar.price_total, 0);
  const totalPending = filteredData.filter(ar => ar.status === 'pending').reduce((sum, ar) => sum + ar.price_total, 0);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-yellow-100 text-yellow-800 border-yellow-300', text: 'PENDING' },
      paid: { class: 'bg-green-100 text-green-800 border-green-300', text: 'LUNAS' },
      overdue: { class: 'bg-red-100 text-red-800 border-red-300', text: 'OVERDUE' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Rekap Piutang</h1>
        <p className="text-gray-600 mt-1">Laporan piutang barang/jasa yang belum lunas atau ter-PO</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-2">Total Piutang</div>
          <div className="text-2xl font-bold">{formatRupiah(totalPiutang)}</div>
          <div className="text-xs opacity-75 mt-1">{filteredData.length} transaksi</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-2">Overdue</div>
          <div className="text-2xl font-bold">{formatRupiah(totalOverdue)}</div>
          <div className="text-xs opacity-75 mt-1">{filteredData.filter(ar => ar.status === 'overdue').length} transaksi</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-sm opacity-90 mb-2">Pending</div>
          <div className="text-2xl font-bold">{formatRupiah(totalPending)}</div>
          <div className="text-xs opacity-75 mt-1">{filteredData.filter(ar => ar.status === 'pending').length} transaksi</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Cari nama barang, PO, surat penawaran, user..."
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
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Lunas</option>
          </select>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          >
            <option value="all">Semua User</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Menampilkan {filteredData.length} dari {accountsReceivables.length} data piutang
        </p>
      </div>

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">No</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Tgl. Req</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">No Surat Penawaran</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Tgl. Pengiriman</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">No DO</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Bukti</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Pending (Day)</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">User / PO</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase">Nama Barang</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Qty</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Satuan</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase">Harga</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase">Total</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((ar, index) => {
                  const status = getStatusBadge(ar.status);
                  const vendor = getVendorById(ar.vendor_id);
                  
                  return (
                    <tr key={ar.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(ar.request_date)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{ar.offer_letter_number}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(ar.delivery_date)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{ar.do_number || '-'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {ar.delivery_proof_url && ar.delivery_proof_url !== '#' ? (
                          <a href={ar.delivery_proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                            📷 Lihat
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {ar.pending_days > 0 ? (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            ar.pending_days > 300 ? 'bg-red-100 text-red-800' :
                            ar.pending_days > 100 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ar.pending_days} hari
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="font-semibold">{ar.user_name}</div>
                        <div className="text-xs text-blue-600">{ar.po_number || 'Belum PO'}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="line-clamp-2">{ar.item_name}</div>
                        {vendor && (
                          <div className="text-xs text-gray-500 mt-1">Vendor: {vendor.name}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">{ar.qty}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">{ar.unit}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">{formatRupiah(ar.price_unit)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">{formatRupiah(ar.price_total)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={12} className="px-4 py-4 text-right text-sm font-bold text-gray-900">
                    Total Piutang:
                  </td>
                  <td className="px-4 py-4 text-right text-lg font-bold text-green-600">
                    {formatRupiah(totalPiutang)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg text-center py-12">
          <p className="text-gray-500">Tidak ada data piutang yang sesuai dengan filter.</p>
        </div>
      )}
    </Layout>
  );
}
