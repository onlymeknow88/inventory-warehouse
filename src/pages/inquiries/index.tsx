import { getItemById, getUserById, getVendorById, inquiries } from '@/services/dummy';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function InquiriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInquiries = inquiries.filter(inquiry => {
    const vendor = getVendorById(inquiry.vendor_id);
    const item = getItemById(inquiry.item_id);
    
    const matchSearch = 
      item?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.vendor_item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || inquiry.vendor_status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getVendorStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Inquiry</h1>
          <p className="text-gray-600 mt-1">Kelola inquiry ke vendor</p>
        </div>
        <Link
          href="/inquiries/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Tambah Inquiry
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Inquiry</div>
          <div className="text-3xl font-bold mt-2">{inquiries.length}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Pending</div>
          <div className="text-3xl font-bold mt-2">
            {inquiries.filter(i => i.vendor_status === 'pending').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Approved</div>
          <div className="text-3xl font-bold mt-2">
            {inquiries.filter(i => i.vendor_status === 'approved').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Rejected</div>
          <div className="text-3xl font-bold mt-2">
            {inquiries.filter(i => i.vendor_status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Cari nama barang atau vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          >
            <option value="all">Semua Status Vendor</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Menampilkan {filteredInquiries.length} dari {inquiries.length} inquiry
        </p>
      </div>

      {/* Inquiries Table */}
      {filteredInquiries.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Nama Barang dari Vendor
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Harga Satuan
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Status Vendor
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => {
                  const vendor = getVendorById(inquiry.vendor_id);
                  const item = getItemById(inquiry.item_id);
                  const user = getUserById(inquiry.user_id);
                  return (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{item?.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{inquiry.vendor_item_name || '-'}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {inquiry.link_url ? (
                          <a 
                            href={inquiry.link_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            title={inquiry.link_url}
                          >
                            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{vendor?.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-semibold text-gray-900">{inquiry.qty} {inquiry.unit}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">{formatRupiah(inquiry.price_unit)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">{formatRupiah(inquiry.price_total)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getVendorStatusBadge(inquiry.vendor_status)}`}>
                          {inquiry.vendor_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user?.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-1">
                          <Link 
                            href={`/inquiries/${inquiry.id}`} 
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Lihat
                          </Link>
                          <Link 
                            href={`/inquiries/${inquiry.id}/edit`} 
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => confirm('Yakin ingin menghapus?') && alert('Hapus: ' + item?.name)} 
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
          <p className="text-gray-500">Belum ada data inquiry.</p>
        </div>
      )}

      
    </Layout>
  );
}
