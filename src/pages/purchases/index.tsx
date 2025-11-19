import Layout from '@/components/Layout';
import { purchases, getVendorById, getUserById } from '@/services/dummy';
import Link from 'next/link';
import { useState } from 'react';

export default function PurchasesIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      approved: 'bg-green-100 text-green-800 border border-green-300',
      rejected: 'bg-red-100 text-red-800 border border-red-300',
      completed: 'bg-blue-100 text-blue-800 border border-blue-300',
    };
    return `px-3 py-1 rounded-full text-xs font-bold ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100'}`;
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.job_detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getVendorById(purchase.vendor_id)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || purchase.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daftar Pembelian</h1>
        <p className="text-gray-600">Kelola semua transaksi pembelian warehouse</p>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm text-yellow-800 font-medium">Pending</div>
          <div className="text-2xl font-bold text-yellow-900">
            {purchases.filter(p => p.status === 'pending').length}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-800 font-medium">Approved</div>
          <div className="text-2xl font-bold text-green-900">
            {purchases.filter(p => p.status === 'approved').length}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-sm text-red-800 font-medium">Rejected</div>
          <div className="text-2xl font-bold text-red-900">
            {purchases.filter(p => p.status === 'rejected').length}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800 font-medium">Completed</div>
          <div className="text-2xl font-bold text-blue-900">
            {purchases.filter(p => p.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Pembelian
            </label>
            <input
              type="text"
              placeholder="Cari PO Number, Detail Pekerjaan, atau Vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-semibold">{filteredPurchases.length}</span> dari <span className="font-semibold">{purchases.length}</span> pembelian
          </div>
          <Link 
            href="/purchases/create" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            + Tambah Pembelian
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Detail Pekerjaan
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase, index) => (
                  <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-blue-600">{purchase.po_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(purchase.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getVendorById(purchase.vendor_id)?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">
                        {purchase.job_detail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {purchase.qty} {purchase.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {formatRupiah(purchase.price_total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={getStatusBadge(purchase.status)}>
                        {purchase.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <Link 
                          href={`/purchases/${purchase.id}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          Detail
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link 
                          href={`/purchases/${purchase.id}/edit`} 
                          className="text-green-600 hover:text-green-800 hover:underline font-medium"
                        >
                          Edit
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button 
                          onClick={() => alert('Hapus purchase: ' + purchase.po_number)}
                          className="text-red-600 hover:text-red-800 hover:underline font-medium"
                        >
                          Hapus
                        </button>
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
                      <p className="mt-2 text-sm">Tidak ada data ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </Layout>
  );
}
