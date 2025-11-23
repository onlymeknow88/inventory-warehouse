import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { kpcPurchases, getKPCPurchasesByStatus, getKPCPurchasesByKategori } from '@/services/dummy';

export default function KPCPurchasesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kategoriFilter, setKategoriFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on status, kategori, and search
  const filteredData = getKPCPurchasesByStatus(statusFilter)
    .filter(kpc => kategoriFilter === 'all' || kpc.kategori === kategoriFilter)
    .filter(kpc => 
      kpc.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpc.stock_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpc.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpc.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Group by period
  const groupedByPeriod = filteredData.reduce((acc, kpc) => {
    const periodKey = `${kpc.periode_awal} - ${kpc.periode_akhir}`;
    if (!acc[periodKey]) {
      acc[periodKey] = [];
    }
    acc[periodKey].push(kpc);
    return acc;
  }, {} as Record<string, typeof kpcPurchases>);

  // Calculate statistics
  const totalQtyPO = filteredData.reduce((sum, kpc) => sum + kpc.qty_po, 0);
  const totalQtyActual = filteredData.reduce((sum, kpc) => sum + kpc.qty, 0);
  const totalBeli = filteredData.reduce((sum, kpc) => sum + kpc.total_harga_beli, 0);
  const totalJual = filteredData.reduce((sum, kpc) => sum + kpc.total_harga_jual, 0);
  const totalProfit = totalJual - totalBeli;

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(kpcPurchases.map(kpc => kpc.kategori)))];

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

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Kontrak Payung Consumable (KPC)</h1>
            <p className="text-gray-600 mt-1">Kelola data pembelian consumable berdasarkan kontrak payung</p>
          </div>
          <button
            onClick={() => router.push('/kpc-purchases/create')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Tambah KPC Baru
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Qty PO</p>
            <p className="text-2xl font-bold text-blue-600">{totalQtyPO.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Qty Terealisasi</p>
            <p className="text-2xl font-bold text-green-600">{totalQtyActual.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Beli</p>
            <p className="text-xl font-bold text-orange-600">{formatCurrency(totalBeli)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Jual</p>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(totalJual)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Profit</p>
            <p className="text-xl font-bold text-green-700">{formatCurrency(totalProfit)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Cari barang, stock code, vendor, atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="min-w-[150px]">
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table - Grouped by Period */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {Object.keys(groupedByPeriod).length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Tidak ada data KPC yang ditemukan
            </div>
          ) : (
            Object.keys(groupedByPeriod).map((periodKey) => {
              const items = groupedByPeriod[periodKey];
              const firstItem = items[0];
              
              return (
                <div key={periodKey} className="mb-6 last:mb-0">
                  {/* Period Header */}
                  <div className="bg-green-50 px-6 py-3 border-b border-green-200">
                    <h3 className="font-bold text-green-900">
                      {formatPeriod(firstItem.periode_awal, firstItem.periode_akhir)}
                    </h3>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama Barang</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock Code</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vendor</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Satuan</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Qty PO</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Qty</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Harga Beli</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Total Beli</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Harga Jual</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Total Jual</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.map((kpc, idx) => (
                          <tr key={kpc.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{kpc.nama_barang}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{kpc.stock_code}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {kpc.kategori}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{kpc.vendor}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-600">{kpc.satuan}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{kpc.qty_po.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-center font-medium text-green-600">{kpc.qty.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(kpc.harga_beli)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-orange-600">
                              {formatCurrency(kpc.total_harga_beli)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(kpc.harga_jual_item)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-purple-600">
                              {formatCurrency(kpc.total_harga_jual)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                kpc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                kpc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {kpc.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => router.push(`/kpc-purchases/${kpc.id}`)}
                                className="text-green-600 hover:text-green-800 font-medium text-sm"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Period Totals */}
                      <tfoot className="bg-gray-100 font-semibold">
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-sm text-gray-900">Subtotal Periode</td>
                          <td className="px-4 py-3 text-sm text-center text-blue-600">
                            {items.reduce((sum, kpc) => sum + kpc.qty_po, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-green-600">
                            {items.reduce((sum, kpc) => sum + kpc.qty, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">-</td>
                          <td className="px-4 py-3 text-sm text-right text-orange-600">
                            {formatCurrency(items.reduce((sum, kpc) => sum + kpc.total_harga_beli, 0))}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">-</td>
                          <td className="px-4 py-3 text-sm text-right text-purple-600">
                            {formatCurrency(items.reduce((sum, kpc) => sum + kpc.total_harga_jual, 0))}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
