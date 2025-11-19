import Layout from '@/components/Layout';
import { getPurchaseById, getVendorById, getUserById } from '@/services/dummy';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PurchaseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const purchase = getPurchaseById(Number(id));

  if (!purchase) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pembelian Tidak Ditemukan</h1>
          <Link href="/purchases" className="text-blue-600 hover:underline">
            Kembali ke Daftar Pembelian
          </Link>
        </div>
      </Layout>
    );
  }

  const vendor = getVendorById(purchase.vendor_id);
  const user = getUserById(purchase.user_id);

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
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return `${config.bg} ${config.text} ${config.border}`;
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/purchases" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Kembali ke Daftar Pembelian
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Detail Pembelian</h1>
            <p className="text-gray-600 mt-1">Purchase Order: <span className="font-bold text-blue-600">{purchase.po_number}</span></p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/purchases/${id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Edit
            </Link>
            <button 
              onClick={() => {
                if (confirm('Yakin ingin menghapus pembelian ini?')) {
                  alert('Hapus purchase: ' + purchase.po_number);
                  router.push('/purchases');
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
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Status</h2>
              <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusBadge(purchase.status)}`}>
                {purchase.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Detail Pekerjaan */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Pekerjaan</h2>
            <p className="text-gray-700 leading-relaxed">{purchase.job_detail}</p>
          </div>

          {/* Quantity & Unit */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Barang</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800 font-medium">Quantity</div>
                <div className="text-3xl font-bold text-blue-900">{purchase.qty}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm text-purple-800 font-medium">Unit</div>
                <div className="text-3xl font-bold text-purple-900">{purchase.unit}</div>
              </div>
            </div>
          </div>

          {/* Rincian Harga */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rincian Harga</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Harga Satuan</span>
                <span className="text-gray-900 font-semibold">{formatRupiah(purchase.price_unit)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Subtotal ({purchase.qty} × {formatRupiah(purchase.price_unit)})</span>
                <span className="text-gray-900 font-semibold">{formatRupiah(purchase.qty * purchase.price_unit)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Ongkir</span>
                <span className="text-gray-900 font-semibold">{formatRupiah(purchase.price_shipping)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Biaya Admin</span>
                <span className="text-gray-900 font-semibold">{formatRupiah(purchase.price_admin)}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Fee Lainnya</span>
                <span className="text-gray-900 font-semibold">{formatRupiah(purchase.price_fee)}</span>
              </div>
              <div className="flex justify-between py-4 bg-blue-50 px-4 rounded-lg mt-4">
                <span className="text-lg font-bold text-blue-900">TOTAL</span>
                <span className="text-2xl font-bold text-blue-900">{formatRupiah(purchase.price_total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Pengiriman</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Expedisi:</span>
                <span className="text-gray-900 font-semibold">{purchase.expedition}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Deadline Pengiriman:</span>
                <span className="text-gray-900 font-semibold">
                  {purchase.delivery_deadline ? formatDate(purchase.delivery_deadline) : '-'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Payment Term:</span>
                <span className="text-gray-900 font-semibold">{purchase.payment_term}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vendor Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Vendor</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 font-medium">Nama Vendor</div>
                <div className="text-lg font-bold text-gray-900">{vendor?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Telepon</div>
                <div className="text-gray-900">{vendor?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Alamat</div>
                <div className="text-gray-900 text-sm">{vendor?.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Rekening</div>
                <div className="text-gray-900 font-mono">{vendor?.account_number}</div>
              </div>
              <Link 
                href={`/vendors/${vendor?.id}`}
                className="block mt-4 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
              >
                Lihat Detail Vendor
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Dibuat Oleh</h2>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-600 font-medium">User</div>
                <div className="text-gray-900 font-semibold">{user?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Email</div>
                <div className="text-gray-900 text-sm">{user?.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Tanggal Dibuat</div>
                <div className="text-gray-900">{formatDate(purchase.created_at)}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Aksi Cepat</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                ✓ Approve
              </button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                ✗ Reject
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                ✓ Complete
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
                📄 Print PO
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
