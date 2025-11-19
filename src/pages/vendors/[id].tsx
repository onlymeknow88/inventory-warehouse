import Layout from '@/components/Layout';
import { getVendorById, getItemsByVendor, itemVendors } from '@/services/dummy';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function VendorDetail() {
  const router = useRouter();
  const { id } = router.query;
  const vendor = getVendorById(Number(id));

  if (!vendor) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Vendor Tidak Ditemukan</h1>
          <Link href="/vendors" className="text-blue-600 hover:underline">
            Kembali ke Daftar Vendor
          </Link>
        </div>
      </Layout>
    );
  }

  const vendorItems = getItemsByVendor(vendor.id);
  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/vendors" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Daftar Vendor
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{vendor.name}</h1>
            <p className="text-gray-600 mt-1">Detail informasi vendor</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Edit Vendor
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Hapus
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Vendor</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Vendor</label>
                <p className="text-lg font-bold text-gray-900 mt-1">{vendor.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusBadge(vendor.status)}`}>
                    {vendor.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Telepon</label>
                <p className="text-gray-900 mt-1">{vendor.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{vendor.email}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Alamat</label>
                <p className="text-gray-900 mt-1">{vendor.address}</p>
              </div>
            </div>
          </div>

          {/* Banking Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Bank</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Bank</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{vendor.bank_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Nomor Rekening</label>
                <p className="text-lg font-mono font-semibold text-gray-900 mt-1">{vendor.account_number}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Atas Nama</label>
                <p className="text-gray-900 mt-1">{vendor.account_name}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-bold text-gray-800">
                Barang dari Vendor Ini ({vendorItems.length})
              </h2>
            </div>
            
            {vendorItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-12">No</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Barang</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kategori</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Min Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Link</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vendorItems.map((item, index) => {
                      const itemVendor = itemVendors.find(
                        iv => iv.item_id === item.id && iv.vendor_id === vendor.id
                      );
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{item.unit}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {item.min_stock || '-'}
                          </td>
                          <td className="px-4 py-3">
                            {itemVendor?.link_url ? (
                              <a 
                                href={itemVendor.link_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                                Marketplace
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Link 
                              href={`/items/${item.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Detail
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-2">Belum ada barang dari vendor ini</p>
                <Link 
                  href="/items/create"
                  className="inline-block mt-3 text-blue-600 hover:underline text-sm"
                >
                  Tambah barang baru
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Aksi Cepat</h3>
            <div className="space-y-2">
              <Link
                href={`/inquiries/create?vendor_id=${vendor.id}`}
                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
              >
                📝 Buat Inquiry
              </Link>
              <Link
                href={`/purchases/create?vendor_id=${vendor.id}`}
                className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium"
              >
                🛒 Buat Pembelian
              </Link>
              <Link
                href={`/tenders/create?vendor_id=${vendor.id}`}
                className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 font-medium"
              >
                📊 Buat Tender
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Barang</span>
                <span className="text-2xl font-bold text-blue-600">{vendorItems.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Transaksi</span>
                <span className="text-2xl font-bold text-green-600">-</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Nilai</span>
                <span className="text-2xl font-bold text-purple-600">-</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Kontak Cepat</h3>
            <div className="space-y-3">
              <a 
                href={`tel:${vendor.phone}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                📞 {vendor.phone}
              </a>
              <a 
                href={`mailto:${vendor.email}`}
                className="flex items-center gap-2 text-blue-600 hover:underline break-all"
              >
                📧 {vendor.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
