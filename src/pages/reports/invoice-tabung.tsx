import { getInvoiceTabungByKategori, getInvoiceTabungByStatus, invoiceTabung } from '@/services/dummy';

import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function InvoiceTabungPage() {
  const router = useRouter();
  const [kategoriFilter, setKategoriFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Filter data
  const filteredData = getInvoiceTabungByKategori(kategoriFilter)
    .filter(inv => statusFilter === 'all' || inv.status_pembayaran === statusFilter)
    .filter(inv => 
      inv.nama_vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.no_inv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.no_do_vendor && inv.no_do_vendor.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(inv => {
      if (selectedMonth === 'all') return true;
      const invMonth = new Date(inv.tanggal).toLocaleString('id-ID', { year: 'numeric', month: '2-digit' });
      return invMonth === selectedMonth;
    });

  // Calculate total quantities for each gas type
  const getTotalQty = () => {
    let total = 0;
    filteredData.forEach(inv => {
      total += (inv.argon_p10 || 0) + (inv.oxy_hp || 0) + (inv.nitrogen || 0) + 
               (inv.helium || 0) + (inv.ca || 0) + (inv.gas_mix || 0) + 
               (inv.gas_mix_2 || 0) + (inv.acy || 0) + (inv.oxy || 0) + 
               (inv.argon || 0) + (inv.argon_2 || 0) + (inv.acy_hp || 0) + 
               (inv.co2_46 || 0) + (inv.hydrot || 0) + (inv.majun || 0) +
               (inv.kuas || 0) + (inv.sarung_tangan || 0) + (inv.masker || 0) +
               (inv.kabel_ties || 0) + (inv.isolasi || 0) + (inv.baut || 0);
    });
    return total;
  };

  const totalQty = getTotalQty();
  const totalNilai = filteredData.reduce((sum, inv) => sum + (inv.nominal || 0), 0);
  const totalPaid = filteredData.filter(inv => inv.status_pembayaran === 'paid').reduce((sum, inv) => sum + (inv.nominal || 0), 0);
  const totalPending = filteredData.filter(inv => inv.status_pembayaran === 'pending').reduce((sum, inv) => sum + (inv.nominal || 0), 0);

  // Get unique months
  const months = Array.from(new Set(invoiceTabung.map(inv => 
    new Date(inv.tanggal).toLocaleString('id-ID', { year: 'numeric', month: '2-digit' })
  ))).sort().reverse();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Invoice Vendor Tabung</h1>
            <p className="text-gray-600 mt-1">Data invoice dari KPG (Gas) dan KPC (Consumable)</p>
          </div>
          {/* <button
            onClick={() => router.push('/reports/invoice-tabung/create')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Tambah Invoice
          </button> */}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Invoice</p>
            <p className="text-2xl font-bold text-indigo-600">{filteredData.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Qty</p>
            <p className="text-2xl font-bold text-blue-600" suppressHydrationWarning>{totalQty.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Nilai</p>
            <p className="text-xl font-bold text-green-600" suppressHydrationWarning>{formatCurrency(totalNilai)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Belum Dibayar</p>
            <p className="text-xl font-bold text-orange-600" suppressHydrationWarning>{formatCurrency(totalPending)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Cari vendor, invoice, atau DO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="min-w-[150px]">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Semua Bulan</option>
                {months.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[130px]">
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Semua Kategori</option>
                <option value="KPG">KPG (Gas)</option>
                <option value="KPC">KPC (Consumable)</option>
              </select>
            </div>
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table - Excel Format */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada data invoice yang ditemukan
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold border-r border-teal-600 text-white">TGL</th>
                    <th className="px-3 py-2 text-left font-semibold border-r border-teal-600 text-white">NO INV</th>
                    <th className="px-3 py-2 text-left font-semibold border-r border-teal-600 text-white">NAMA VENDOR</th>
                    <th className="px-3 py-2 text-left font-semibold border-r border-teal-600 text-white">NO DO VENDOR</th>
                    <th className="px-3 py-2 text-left font-semibold border-r border-teal-600 text-white">NO PO KCK</th>
                    <th className="px-3 py-2 text-left font-semibold border-r border-teal-600 text-white">NO PO PLTU</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">ARGON P10</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">OXY HP</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">NITROGEN</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">HELIUM</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">CA</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">GAS MIX</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">GAS MIX</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">ACY</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">OXY</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">ARGON</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">ARGON</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">ACY HP</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">CO2 46</th>
                    <th className="px-3 py-2 text-center font-semibold border-r border-white bg-blue-600 text-white">HYDROT</th>
                    <th className="px-3 py-2 text-right font-semibold border-r border-teal-600 text-white">NOMINAL</th>
                    <th className="px-3 py-2 text-center font-semibold text-white">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((inv) => (
                    <tr 
                      key={`inv-${inv.id}-${inv.no_inv}`}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/reports/invoice-tabung/${inv.id}`)}
                    >
                      <td className="px-3 py-2 text-xs text-gray-600 border-r">{formatDate(inv.tanggal)}</td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-900 border-r">{inv.no_inv}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 border-r">{inv.nama_vendor}</td>
                      <td className="px-3 py-2 text-xs text-gray-600 border-r text-center">{inv.no_do_vendor || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-600 border-r text-center">{inv.no_po_kck || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-600 border-r text-center">{inv.no_po_pltu || '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r bg-blue-50 text-gray-900">{inv.argon_p10 !== undefined && inv.argon_p10 !== null ? inv.argon_p10 : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r bg-green-50 text-gray-900">{inv.oxy_hp !== undefined && inv.oxy_hp !== null ? inv.oxy_hp : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.nitrogen !== undefined && inv.nitrogen !== null ? inv.nitrogen : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.helium !== undefined && inv.helium !== null ? inv.helium : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.ca !== undefined && inv.ca !== null ? inv.ca : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.gas_mix !== undefined && inv.gas_mix !== null ? inv.gas_mix : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.gas_mix_2 !== undefined && inv.gas_mix_2 !== null ? inv.gas_mix_2 : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.acy !== undefined && inv.acy !== null ? inv.acy : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.oxy !== undefined && inv.oxy !== null ? inv.oxy : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.argon !== undefined && inv.argon !== null ? inv.argon : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r bg-blue-50 text-gray-900">{inv.argon_2 !== undefined && inv.argon_2 !== null ? inv.argon_2 : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.acy_hp !== undefined && inv.acy_hp !== null ? inv.acy_hp : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.co2_46 !== undefined && inv.co2_46 !== null ? inv.co2_46 : '-'}</td>
                      <td className="px-3 py-2 text-xs text-center border-r text-gray-900">{inv.hydrot !== undefined && inv.hydrot !== null ? inv.hydrot : '-'}</td>
                      <td className="px-3 py-2 text-xs text-right font-medium text-green-600 border-r" suppressHydrationWarning>
                        {inv.nominal ? formatCurrency(inv.nominal) : '-'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          inv.status_pembayaran === 'paid' ? 'bg-green-100 text-green-800' :
                          inv.status_pembayaran === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {inv.status_pembayaran.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {filteredData.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Ringkasan Total</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-indigo-100 text-sm">Total Invoice</p>
                <p className="text-2xl font-bold">{filteredData.length}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm">Total Qty</p>
                <p className="text-2xl font-bold" suppressHydrationWarning>{totalQty.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm">Total Dibayar</p>
                <p className="text-2xl font-bold" suppressHydrationWarning>{formatCurrency(totalPaid)}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm">Total Pending</p>
                <p className="text-2xl font-bold" suppressHydrationWarning>{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
