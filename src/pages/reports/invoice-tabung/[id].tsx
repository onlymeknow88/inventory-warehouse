import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getInvoiceTabungById } from '@/services/dummy';

export default function InvoiceTabungDetail() {
  const router = useRouter();
  const { id } = router.query;

  const invoice = getInvoiceTabungById(Number(id));

  if (!invoice) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Data invoice tidak ditemukan
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
          >
            ← Kembali
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Detail Invoice - {invoice.no_inv}</h1>
              <p className="text-gray-600 mt-1">{formatDate(invoice.tanggal)}</p>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                invoice.kategori === 'KPG' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {invoice.kategori}
              </span>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                invoice.status_pembayaran === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status_pembayaran === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {invoice.status_pembayaran.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Invoice</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">No. Invoice</p>
                  <p className="text-lg font-semibold text-gray-900">{invoice.no_inv}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Invoice</p>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(invoice.tanggal)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">No. DO Vendor</p>
                  <p className="text-lg font-semibold text-gray-900">{invoice.no_do_vendor || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">No. PO PLTU</p>
                  <p className="text-lg font-semibold text-gray-900">{invoice.no_po_pltu || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">No. PO KCK</p>
                  <p className="text-lg font-semibold text-gray-900">{invoice.no_po_kck || '-'}</p>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Informasi Vendor</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nama Vendor</p>
                  <p className="text-lg font-semibold text-gray-900">{invoice.nama_vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kategori Kontrak</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    invoice.kategori === 'KPG' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {invoice.kategori === 'KPG' ? 'Kontrak Payung Gas' : 'Kontrak Payung Consumable'}
                  </span>
                </div>
              </div>
            </div>

            {/* Item Details - Gas Types */}
            {(invoice.argon_p10 || invoice.oxy_hp || invoice.nitrogen || invoice.helium || 
              invoice.ca || invoice.gas_mix || invoice.gas_mix_2 || invoice.acy || 
              invoice.oxy || invoice.argon || invoice.argon_2 || invoice.acy_hp || 
              invoice.co2_46 || invoice.hydrot) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Detail Gas (KPG)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {invoice.argon_p10 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ARGON P10</p>
                      <p className="text-xl font-bold text-blue-600">{invoice.argon_p10}</p>
                    </div>
                  )}
                  {invoice.oxy_hp && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">OXY HP</p>
                      <p className="text-xl font-bold text-green-600">{invoice.oxy_hp}</p>
                    </div>
                  )}
                  {invoice.nitrogen && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">NITROGEN</p>
                      <p className="text-xl font-bold text-purple-600">{invoice.nitrogen}</p>
                    </div>
                  )}
                  {invoice.helium && (
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">HELIUM</p>
                      <p className="text-xl font-bold text-pink-600">{invoice.helium}</p>
                    </div>
                  )}
                  {invoice.ca && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">CA</p>
                      <p className="text-xl font-bold text-yellow-600">{invoice.ca}</p>
                    </div>
                  )}
                  {invoice.gas_mix && (
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">GAS MIX</p>
                      <p className="text-xl font-bold text-indigo-600">{invoice.gas_mix}</p>
                    </div>
                  )}
                  {invoice.gas_mix_2 && (
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">GAS MIX 2</p>
                      <p className="text-xl font-bold text-indigo-600">{invoice.gas_mix_2}</p>
                    </div>
                  )}
                  {invoice.acy && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ACY</p>
                      <p className="text-xl font-bold text-red-600">{invoice.acy}</p>
                    </div>
                  )}
                  {invoice.oxy && (
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">OXY</p>
                      <p className="text-xl font-bold text-teal-600">{invoice.oxy}</p>
                    </div>
                  )}
                  {invoice.argon && (
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ARGON</p>
                      <p className="text-xl font-bold text-cyan-600">{invoice.argon}</p>
                    </div>
                  )}
                  {invoice.argon_2 && (
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ARGON 2</p>
                      <p className="text-xl font-bold text-cyan-600">{invoice.argon_2}</p>
                    </div>
                  )}
                  {invoice.acy_hp && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ACY HP</p>
                      <p className="text-xl font-bold text-orange-600">{invoice.acy_hp}</p>
                    </div>
                  )}
                  {invoice.co2_46 && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">CO2 46</p>
                      <p className="text-xl font-bold text-gray-700">{invoice.co2_46}</p>
                    </div>
                  )}
                  {invoice.hydrot && (
                    <div className="bg-lime-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">HYDROT</p>
                      <p className="text-xl font-bold text-lime-600">{invoice.hydrot}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Item Details - Consumables */}
            {(invoice.majun || invoice.kuas || invoice.sarung_tangan || invoice.masker || 
              invoice.kabel_ties || invoice.isolasi || invoice.baut) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Detail Consumable (KPC)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {invoice.majun && (
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">MAJUN</p>
                      <p className="text-xl font-bold text-amber-600">{invoice.majun}</p>
                    </div>
                  )}
                  {invoice.kuas && (
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">KUAS</p>
                      <p className="text-xl font-bold text-emerald-600">{invoice.kuas}</p>
                    </div>
                  )}
                  {invoice.sarung_tangan && (
                    <div className="bg-violet-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">SARUNG TANGAN</p>
                      <p className="text-xl font-bold text-violet-600">{invoice.sarung_tangan}</p>
                    </div>
                  )}
                  {invoice.masker && (
                    <div className="bg-sky-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">MASKER</p>
                      <p className="text-xl font-bold text-sky-600">{invoice.masker}</p>
                    </div>
                  )}
                  {invoice.kabel_ties && (
                    <div className="bg-fuchsia-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">KABEL TIES</p>
                      <p className="text-xl font-bold text-fuchsia-600">{invoice.kabel_ties}</p>
                    </div>
                  )}
                  {invoice.isolasi && (
                    <div className="bg-rose-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">ISOLASI</p>
                      <p className="text-xl font-bold text-rose-600">{invoice.isolasi}</p>
                    </div>
                  )}
                  {invoice.baut && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">BAUT</p>
                      <p className="text-xl font-bold text-slate-600">{invoice.baut}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {invoice.keterangan && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Keterangan</h2>
                <p className="text-gray-700">{invoice.keterangan}</p>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Ringkasan Pembayaran</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-indigo-100 text-sm">Status Pembayaran</p>
                  <p className="text-2xl font-bold">
                    {invoice.status_pembayaran === 'paid' ? 'LUNAS' :
                     invoice.status_pembayaran === 'pending' ? 'PENDING' : 'PARTIAL'}
                  </p>
                </div>
                <div className="pt-4 border-t border-indigo-400">
                  <p className="text-indigo-100 text-sm">Total Invoice</p>
                  <p className="text-3xl font-bold" suppressHydrationWarning>{formatCurrency(invoice.nominal || 0)}</p>
                </div>
                {invoice.status_pembayaran === 'partial' && invoice.nominal && (
                  <div className="pt-2">
                    <p className="text-indigo-100 text-sm">Sisa Pembayaran</p>
                    <p className="text-xl font-bold" suppressHydrationWarning>{formatCurrency(invoice.nominal / 2)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Informasi Cepat</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">ID Invoice</span>
                  <span className="font-semibold text-gray-900">#{invoice.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Kategori</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    invoice.kategori === 'KPG' ? 'bg-blue-100 text-blue-800' : 
                    invoice.kategori === 'KPC' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {invoice.kategori}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total Qty</span>
                  <span className="font-semibold text-gray-900" suppressHydrationWarning>
                    {((invoice.argon_p10 || 0) + (invoice.oxy_hp || 0) + (invoice.nitrogen || 0) + 
                      (invoice.helium || 0) + (invoice.ca || 0) + (invoice.gas_mix || 0) + 
                      (invoice.gas_mix_2 || 0) + (invoice.acy || 0) + (invoice.oxy || 0) + 
                      (invoice.argon || 0) + (invoice.argon_2 || 0) + (invoice.acy_hp || 0) + 
                      (invoice.co2_46 || 0) + (invoice.hydrot || 0) + (invoice.majun || 0) +
                      (invoice.kuas || 0) + (invoice.sarung_tangan || 0) + (invoice.masker || 0) +
                      (invoice.kabel_ties || 0) + (invoice.isolasi || 0) + (invoice.baut || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Dibuat</span>
                  <span className="font-semibold text-gray-900 text-xs">
                    {formatDateTime(invoice.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi</h2>
              <div className="space-y-2">
                {invoice.status_pembayaran !== 'paid' && (
                  <button
                    onClick={() => {
                      if (confirm('Konfirmasi pembayaran invoice ini?')) {
                        alert('Pembayaran berhasil dikonfirmasi (dummy action)');
                        router.push('/reports/invoice-tabung');
                      }
                    }}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Konfirmasi Pembayaran
                  </button>
                )}
                <button
                  onClick={() => router.push(`/reports/invoice-tabung/${id}/edit`)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Edit Invoice
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cetak Invoice
                </button>
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin menghapus invoice ini?')) {
                      alert('Invoice berhasil dihapus (dummy action)');
                      router.push('/reports/invoice-tabung');
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Hapus Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
