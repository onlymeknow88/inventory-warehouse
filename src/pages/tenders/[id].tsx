import Layout from '@/components/Layout';
import { getTenderById, getUserById } from '@/services/dummy';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function TenderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const tender = getTenderById(Number(id));
  const user = tender ? getUserById(tender.user_id) : null;

  if (!tender) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Tender tidak ditemukan</h2>
          <Link href="/tenders" className="text-blue-600 hover:underline mt-4 inline-block">
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      menang_tender: 'bg-green-100 text-green-800 border-green-300',
      kalah_tender: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    const statusText = {
      menang_tender: 'MENANG TENDER',
      kalah_tender: 'KALAH TENDER',
      pending: 'PENDING',
    };
    return {
      class: statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100',
      text: statusText[status as keyof typeof statusText] || status,
    };
  };

  const status = getStatusBadge(tender.status_tender);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Detail Tender</h1>
          <p className="text-gray-600 mt-1">Informasi lengkap tender #{tender.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/tenders/${tender.id}/edit`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Edit Tender
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
            <h2 className="text-2xl font-bold text-gray-900">{tender.job_title}</h2>
            <p className="text-gray-600 mt-1">No. Surat: {tender.letter_number}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${status.class}`}>
            {status.text}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-600">Tanggal Tender</label>
              <div className="mt-1 text-lg text-gray-900">{formatDate(tender.tender_date)}</div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Nama Perusahaan</label>
              <div className="mt-1 text-lg text-gray-900">{tender.company_name}</div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">Status PO</label>
              <div className="mt-1 text-lg text-gray-900">{tender.status_po || '-'}</div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">User yang Membuat</label>
              <div className="mt-1 text-lg text-gray-900">{user?.name}</div>
            </div>
          </div>

          {/* Right Column - Financial Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Keuangan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Nominal Modal:</span>
                <span className="text-base font-bold text-gray-900">{formatRupiah(tender.nominal_modal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Penawaran Exc:</span>
                <span className="text-base font-bold text-gray-900">{formatRupiah(tender.penawaran_exc)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Spare Nego:</span>
                <span className="text-base font-bold text-gray-900">{formatRupiah(tender.spare_nego)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Nominal Nego:</span>
                <span className="text-base font-bold text-gray-900">{formatRupiah(tender.nominal_nego)}</span>
              </div>
              <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                <span className="text-base font-bold text-gray-800">Nominal Pemenang:</span>
                <span className="text-xl font-bold text-green-600">{formatRupiah(tender.nominal_pemenang)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {tender.notes && (
          <div>
            <label className="text-sm font-bold text-gray-600">Catatan</label>
            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{tender.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Nominal Modal</p>
              <p className="text-xl font-bold text-gray-900">{formatRupiah(tender.nominal_modal)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Modal awal untuk tender</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Nominal Pemenang</p>
              <p className="text-xl font-bold text-green-600">{formatRupiah(tender.nominal_pemenang)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Nilai akhir pemenang tender</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Selisih</p>
              <p className={`text-xl font-bold ${tender.nominal_pemenang - tender.nominal_modal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatRupiah(tender.nominal_pemenang - tender.nominal_modal)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Keuntungan/Kerugian tender</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Timeline Aktivitas</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Tender dibuat</p>
              <p className="text-xs text-gray-600">{formatDate(tender.created_at)}</p>
            </div>
          </div>

          {tender.status_tender === 'menang_tender' && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Menang tender</p>
                <p className="text-xs text-gray-600">Nominal: {formatRupiah(tender.nominal_pemenang)}</p>
              </div>
            </div>
          )}

          {tender.status_tender === 'kalah_tender' && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Kalah tender</p>
                <p className="text-xs text-gray-600">Tender tidak dimenangkan</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
