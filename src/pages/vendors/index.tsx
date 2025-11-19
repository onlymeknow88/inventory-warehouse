import { getItemsByVendor, vendors } from '@/services/dummy';

import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState } from 'react';

export default function VendorsIndex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone.includes(searchTerm) ||
      vendor.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || vendor.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Vendor</h1>
        <p className="text-gray-600 mt-1">Kelola vendor dan supplier</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Vendor</div>
          <div className="text-3xl font-bold mt-2">{vendors.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Active</div>
          <div className="text-3xl font-bold mt-2">
            {vendors.filter(v => v.status === 'active').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Inactive</div>
          <div className="text-3xl font-bold mt-2">
            {vendors.filter(v => v.status === 'inactive').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Hasil Pencarian</div>
          <div className="text-3xl font-bold mt-2">{filteredVendors.length}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Cari nama, telepon, atau alamat vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Link
              href="/vendors/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              + Tambah
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Menampilkan {filteredVendors.length} dari {vendors.length} vendor
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Nama Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Rekening
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                  Barang
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
              {filteredVendors.map((vendor) => {
                const items = getItemsByVendor(vendor.id);
                return (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{vendor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{vendor.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{vendor.account_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.payment_term}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-bold text-blue-600">{items.length}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(vendor.status)}`}>
                        {vendor.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <Link 
                          href={`/vendors/${vendor.id}`} 
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          Detail
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link 
                          href={`/vendors/${vendor.id}/edit`} 
                          className="text-green-600 hover:text-green-800 hover:underline font-medium"
                        >
                          Edit
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button 
                          onClick={() => alert('Hapus: ' + vendor.name)} 
                          className="text-red-600 hover:text-red-800 hover:underline font-medium"
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

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada vendor ditemukan</h3>
            <p className="mt-1 text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}
      </div>

      
    </Layout>
  );
}
