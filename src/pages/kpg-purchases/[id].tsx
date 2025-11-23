import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getKPGPurchaseById } from '@/services/dummy';

export default function KPGPurchaseDetail() {
  const router = useRouter();
  const { id } = router.query;

  const kpg = getKPGPurchaseById(Number(id));

  if (!kpg) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Data KPG tidak ditemukan
          </div>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPeriod = (periodeAwal: string, periodeAkhir: string) => {
    const months: Record<string, string> = {
      '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR',
      '05': 'MEI', '06': 'JUN', '07': 'JUL', '08': 'AGS',
      '09': 'SEP', '10': 'OKT', '11': 'NOV', '12': 'DES',
    };
    const [monthStart, yearStart] = periodeAwal.split('-');
    const [monthEnd, yearEnd] = periodeAkhir.split('-');
    return `REQ ${months[monthStart]} - ${months[monthEnd]} ${yearStart}`;
  };

  const profit = kpg.total_harga_jual - kpg.total_harga_beli;
  const profitMargin = kpg.total_harga_beli > 0 
    ? ((profit / kpg.total_harga_beli) * 100).toFixed(2) 
    : '0';

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Kembali
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Detail KPG - {kpg.nama_tabung}</h1>
              <p className="text-gray-600 mt-1">{formatPeriod(kpg.periode_awal, kpg.periode_akhir)}</p>
            </div>
            <div>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                kpg.status === 'approved' ? 'bg-green-100 text-green-800' :
                kpg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {kpg.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informasi Periode */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Periode</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Periode Kontrak</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPeriod(kpg.periode_awal, kpg.periode_akhir)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tahun</p>
                  <p className="text-lg font-semibold text-gray-900">{kpg.tahun}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Dibuat</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(kpg.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {kpg.updated_at && (
                  <div>
                    <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(kpg.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Gas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Gas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Tabung</p>
                  <p className="text-lg font-semibold text-gray-900">{kpg.nama_tabung}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock Code</p>
                  <p className="text-lg font-semibold text-gray-900">{kpg.stock_code}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Vendor</p>
                  <p className="text-lg font-semibold text-gray-900">{kpg.vendor}</p>
                </div>
              </div>
            </div>

            {/* Kuantitas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Kuantitas</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Qty PO</p>
                  <p className="text-2xl font-bold text-blue-600">{kpg.qty_po}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Qty Terealisasi</p>
                  <p className="text-2xl font-bold text-green-600">{kpg.qty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sisa Qty</p>
                  <p className="text-2xl font-bold text-orange-600">{kpg.qty_po - kpg.qty}</p>
                </div>
              </div>
              {kpg.qty_po > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress Realisasi</span>
                    <span>{((kpg.qty / kpg.qty_po) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${(kpg.qty / kpg.qty_po) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Harga & Biaya */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Harga & Biaya</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Harga Beli Lama</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(kpg.harga_beli_lama)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Harga Beli Baru</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(kpg.harga_beli_baru)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700 font-medium">Harga Beli (Aktual)</span>
                  <span className="font-bold text-blue-600">{formatCurrency(kpg.harga_beli)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="text-gray-700 font-medium">Harga Jual</span>
                  <span className="font-bold text-purple-600">{formatCurrency(kpg.harga_jual_item)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Total Summary */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Ringkasan Total</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm">Total Harga Beli</p>
                  <p className="text-2xl font-bold">{formatCurrency(kpg.total_harga_beli)}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Total Harga Jual</p>
                  <p className="text-2xl font-bold">{formatCurrency(kpg.total_harga_jual)}</p>
                </div>
                <div className="pt-4 border-t border-blue-400">
                  <p className="text-blue-100 text-sm">Total Profit</p>
                  <p className="text-3xl font-bold">{formatCurrency(profit)}</p>
                  <p className="text-blue-100 text-sm mt-1">Margin: {profitMargin}%</p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Informasi Cepat</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="font-semibold text-gray-900">#{kpg.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    kpg.status === 'approved' ? 'bg-green-100 text-green-800' :
                    kpg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {kpg.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Realisasi</span>
                  <span className="font-semibold text-gray-900">
                    {kpg.qty_po > 0 ? `${((kpg.qty / kpg.qty_po) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi</h2>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/kpg-purchases/${id}/edit`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                      alert('Data berhasil dihapus (dummy action)');
                      router.push('/kpg-purchases');
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Hapus Data
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cetak Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
