import Layout from '@/components/Layout';
import { getInquiryById, getVendorById, getItemById, getUserById } from '@/services/dummy';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function InquiryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const inquiry = getInquiryById(Number(id));
  const vendor = inquiry ? getVendorById(inquiry.vendor_id) : null;
  const item = inquiry ? getItemById(inquiry.item_id) : null;
  const user = inquiry ? getUserById(inquiry.user_id) : null;

  if (!inquiry) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Inquiry tidak ditemukan</h2>
          <Link href="/inquiries" className="text-blue-600 hover:underline mt-4 inline-block">
            Kembali ke daftar
          </Link>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getVendorStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: 'bg-blue-100 text-blue-800 border-blue-300',
      replied: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.sent;
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Detail Inquiry</h1>
          <p className="text-gray-600 mt-1">Informasi lengkap inquiry #{inquiry.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/inquiries/${inquiry.id}/edit`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Edit Inquiry
          </Link>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{inquiry.subject}</h2>
            <p className="text-gray-600 mt-1">Tanggal: {formatDate(inquiry.inquiry_date)}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusBadge(inquiry.status)}`}>
              {inquiry.status.toUpperCase()}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getVendorStatusBadge(inquiry.vendor_status)}`}>
              VENDOR: {inquiry.vendor_status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-600">Vendor</label>
              <div className="mt-1">
                <Link 
                  href={`/vendors/${vendor?.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {vendor?.name}
                </Link>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Barang</label>
              <div className="mt-1">
                <Link 
                  href={`/items/${item?.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {item?.name}
                </Link>
              </div>
              
              {/* Display item photo */}
              {item && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <img 
                        src={item.photo_url} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">{item.description}</p>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-gray-500">Kategori:</span>
                          <span className="ml-1 font-semibold text-gray-900">{item.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Garansi:</span>
                          <span className="ml-1 font-semibold text-gray-900">{item.warranty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Nama Barang dari Vendor</label>
              <div className="mt-1 text-lg text-gray-900">{inquiry.vendor_item_name || '-'}</div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Link Produk</label>
              <div className="mt-1">
                {inquiry.link_url ? (
                  <a 
                    href={inquiry.link_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <span className="break-all">{inquiry.link_url}</span>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-600">User yang Membuat</label>
              <div className="mt-1 text-lg text-gray-900">{user?.name}</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Qty</span>
                <span className="text-lg font-bold text-gray-900">{inquiry.qty} {inquiry.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Harga Satuan</span>
                <span className="text-lg font-semibold text-gray-900">{formatRupiah(inquiry.price_unit)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-gray-700">Total Harga</span>
                <span className="text-2xl font-bold text-blue-600">{formatRupiah(inquiry.price_total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-600">Pesan Inquiry</label>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{inquiry.message}</p>
          </div>
        </div>

        {/* Reply Message */}
        {inquiry.reply_message && (
          <div>
            <label className="text-sm font-bold text-gray-600">Balasan dari Vendor</label>
            <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{inquiry.reply_message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline/Activity Log (placeholder) */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Timeline Aktivitas</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Inquiry dibuat</p>
              <p className="text-xs text-gray-600">{formatDate(inquiry.created_at)}</p>
            </div>
          </div>

          {inquiry.status === 'replied' && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Vendor memberikan balasan</p>
                <p className="text-xs text-gray-600">{formatDate(inquiry.created_at)}</p>
              </div>
            </div>
          )}

          {inquiry.vendor_status === 'approved' && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Inquiry disetujui vendor</p>
                <p className="text-xs text-gray-600">{formatDate(inquiry.created_at)}</p>
              </div>
            </div>
          )}

          {inquiry.vendor_status === 'rejected' && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Inquiry ditolak vendor</p>
                <p className="text-xs text-gray-600">{formatDate(inquiry.created_at)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
