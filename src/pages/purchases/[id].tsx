import { FORM_CODE_LABELS, FormCode } from '@/types';
import { getPurchaseById, getUserById, getVendorById } from '@/services/dummy';

import Layout from '@/components/Layout';
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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">Detail Pembelian</h1>
              {purchase.form_code && (
                <span 
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    purchase.form_code === 'U' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                    purchase.form_code === 'J' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                  title={FORM_CODE_LABELS[purchase.form_code as FormCode]}
                >
                  {purchase.form_code} - {FORM_CODE_LABELS[purchase.form_code as FormCode]}
                </span>
              )}
            </div>
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
              <div className="flex gap-2 items-center">
                {purchase.is_urgent && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                    🔥 URGENT
                  </span>
                )}
                {purchase.has_po ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                    ✓ ADA PO
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                    📋 BELUM PO
                  </span>
                )}
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusBadge(purchase.status)}`}>
                  {purchase.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table - Support Multiple Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Item Pembelian</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Detail Pekerjaan</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Qty</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Satuan</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Harga Satuan</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Ongkir</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Admin</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Fee</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchase.items && purchase.items.length > 0 ? (
                    // Display multiple items if available
                    purchase.items.map((item: any, index: number) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.detail_pekerjaan}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{item.qty}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{item.satuan}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(item.harga_satuan)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(item.ongkir)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(item.admin)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(item.fee)}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{formatRupiah(item.total)}</td>
                      </tr>
                    ))
                  ) : (
                    // Fallback to single item display if items array not available
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">1</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{purchase.job_detail}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">{purchase.qty}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">{purchase.unit}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(purchase.price_unit)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(purchase.price_shipping)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(purchase.price_admin)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">{formatRupiah(purchase.price_fee)}</td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">{formatRupiah(purchase.price_total)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-blue-50">
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-right text-sm font-bold text-blue-900">GRAND TOTAL:</td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-blue-900">
                      {purchase.items && purchase.items.length > 0 
                        ? formatRupiah(purchase.items.reduce((sum: number, item: any) => sum + item.total, 0))
                        : formatRupiah(purchase.price_total)
                      }
                    </td>
                  </tr>
                </tfoot>
              </table>
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
