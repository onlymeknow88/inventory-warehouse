import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getKPCPurchaseById } from '@/services/dummy';

export default function KPCPurchaseDetail() {
  const router = useRouter();
  const { id } = router.query;

  const kpc = getKPCPurchaseById(Number(id));

  if (!kpc) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Data KPC tidak ditemukan
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

  const profit = kpc.total_harga_jual - kpc.total_harga_beli;
  const profitMargin = kpc.total_harga_beli > 0 
    ? ((profit / kpc.total_harga_beli) * 100).toFixed(2) 
    : '0';

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-800 mb-4 flex items-center"
          >
            ← Kembali
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Detail KPC - {kpc.nama_barang}</h1>
              <p className="text-gray-600 mt-1">{formatPeriod(kpc.periode_awal, kpc.periode_akhir)}</p>
            </div>
            <div>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                kpc.status === 'approved' ? 'bg-green-100 text-green-800' :
                kpc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {kpc.status.toUpperCase()}
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
                  <p className="text-lg font-semibold text-gray-900">{formatPeriod(kpc.periode_awal, kpc.periode_akhir)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tahun</p>
                  <p className="text-lg font-semibold text-gray-900">{kpc.tahun}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Dibuat</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(kpc.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                {kpc.updated_at && (
                  <div>
                    <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(kpc.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Barang */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Barang Consumable</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Barang</p>
                  <p className="text-lg font-semibold text-gray-900">{kpc.nama_barang}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock Code</p>
                  <p className="text-lg font-semibold text-gray-900">{kpc.stock_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kategori</p>
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {kpc.kategori}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satuan</p>
                  <p className="text-lg font-semibold text-gray-900">{kpc.satuan}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Vendor</p>
                  <p className="text-lg font-semibold text-gray-900">{kpc.vendor}</p>
                </div>
              </div>
            </div>

            {/* Kuantitas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Kuantitas</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Qty PO</p>
                  <p className="text-2xl font-bold text-blue-600">{kpc.qty_po.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Qty Terealisasi</p>
                  <p className="text-2xl font-bold text-green-600">{kpc.qty.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sisa Qty</p>
                  <p className="text-2xl font-bold text-orange-600">{(kpc.qty_po - kpc.qty).toLocaleString()}</p>
                </div>
              </div>
              {kpc.qty_po > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress Realisasi</span>
                    <span>{((kpc.qty / kpc.qty_po) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${(kpc.qty / kpc.qty_po) * 100}%` }}
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
                  <span className="font-semibold text-gray-900">{formatCurrency(kpc.harga_beli_lama)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Harga Beli Baru</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(kpc.harga_beli_baru)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-gray-700 font-medium">Harga Beli (Aktual)</span>
                  <span className="font-bold text-blue-600">{formatCurrency(kpc.harga_beli)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="text-gray-700 font-medium">Harga Jual</span>
                  <span className="font-bold text-purple-600">{formatCurrency(kpc.harga_jual_item)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Total Summary */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Ringkasan Total</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-green-100 text-sm">Total Harga Beli</p>
                  <p className="text-2xl font-bold">{formatCurrency(kpc.total_harga_beli)}</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Total Harga Jual</p>
                  <p className="text-2xl font-bold">{formatCurrency(kpc.total_harga_jual)}</p>
                </div>
                <div className="pt-4 border-t border-green-400">
                  <p className="text-green-100 text-sm">Total Profit</p>
                  <p className="text-3xl font-bold">{formatCurrency(profit)}</p>
                  <p className="text-green-100 text-sm mt-1">Margin: {profitMargin}%</p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Informasi Cepat</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="font-semibold text-gray-900">#{kpc.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    kpc.status === 'approved' ? 'bg-green-100 text-green-800' :
                    kpc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {kpc.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Realisasi</span>
                  <span className="font-semibold text-gray-900">
                    {kpc.qty_po > 0 ? `${((kpc.qty / kpc.qty_po) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Kategori</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {kpc.kategori}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi</h2>
              <div className="space-y-2">
                <button
                  onClick={() => router.push(`/kpc-purchases/${id}/edit`)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                      alert('Data berhasil dihapus (dummy action)');
                      router.push('/kpc-purchases');
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
