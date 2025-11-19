import Layout from '@/components/Layout';
import { getItemById, getVendorsByItem, itemVendors } from '@/services/dummy';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const item = getItemById(Number(id));

  if (!item) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Barang Tidak Ditemukan</h1>
          <Link href="/items" className="text-blue-600 hover:underline">
            Kembali ke Daftar Barang
          </Link>
        </div>
      </Layout>
    );
  }

  const vendors = getVendorsByItem(item.id);

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/items" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Daftar Barang
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/items/${id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Edit
            </Link>
            <button 
              onClick={() => {
                if (confirm('Yakin ingin menghapus barang ini?')) {
                  alert('Hapus item: ' + item.name);
                  router.push('/items');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Foto Barang</h2>
            <div className="flex justify-center">
              <img 
                src={item.photo_url} 
                alt={item.name}
                className="w-full max-w-lg h-auto object-cover rounded-lg border-2 border-gray-300 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Barang</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama Barang</label>
                <p className="text-lg font-bold text-gray-900 mt-1">{item.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Kategori</label>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                  {item.category}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Unit</label>
                <p className="text-gray-900 mt-1 font-semibold">{item.unit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Minimum Stock</label>
                <p className="text-gray-900 mt-1 font-semibold">{item.min_stock || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Garansi</label>
                <p className="text-gray-900 mt-1 font-semibold">{item.warranty}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tanggal Dibuat</label>
                <p className="text-gray-900 mt-1 font-semibold">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                <p className="text-gray-900 mt-1">{item.description}</p>
              </div>
            </div>
          </div>

          {/* Vendors */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Vendor yang Menjual ({vendors.length})
            </h2>
            
            {vendors.length > 0 ? (
              <div className="space-y-3">
                {vendors.map((vendor) => {
                  const itemVendor = itemVendors.find(
                    iv => iv.item_id === item.id && iv.vendor_id === vendor.id
                  );
                  return (
                    <div key={vendor.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>📞 {vendor.phone}</span>
                            <span>📧 {vendor.email}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{vendor.address}</p>
                          {itemVendor?.link_url && (
                            <a 
                              href={itemVendor.link_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline text-sm font-medium"
                            >
                              🔗 Buka Link Marketplace
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link 
                            href={`/vendors/${vendor.id}`}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 text-center"
                          >
                            Detail
                          </Link>
                          <Link 
                            href={`/inquiries/create?vendor_id=${vendor.id}&item_id=${item.id}`}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 text-center"
                          >
                            Inquiry
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada vendor untuk barang ini</p>
                <Link 
                  href="/vendors"
                  className="inline-block mt-3 text-blue-600 hover:underline"
                >
                  Lihat Daftar Vendor
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Vendor</span>
                <span className="text-2xl font-bold text-blue-600">{vendors.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Link Marketplace</span>
                <span className="text-2xl font-bold text-green-600">
                  {itemVendors.filter(iv => iv.item_id === item.id && iv.link_url).length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Aksi Cepat</h3>
            <div className="space-y-2">
              <Link
                href={`/inquiries/create?item_id=${item.id}`}
                className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
              >
                📝 Buat Inquiry
              </Link>
              <Link
                href={`/purchases/create?item_id=${item.id}`}
                className="block w-full px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium"
              >
                🛒 Buat Pembelian
              </Link>
              <button
                onClick={() => alert('Lihat riwayat pembelian untuk: ' + item.name)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                📊 Riwayat Pembelian
              </button>
            </div>
          </div>

          {/* Category Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Kategori</h3>
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-lg font-bold rounded-lg">
                {item.category}
              </span>
              <Link
                href={`/items?category=${item.category}`}
                className="block mt-3 text-sm text-blue-600 hover:underline"
              >
                Lihat barang lain di kategori ini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
