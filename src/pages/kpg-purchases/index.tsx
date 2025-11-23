import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { kpgPurchases, getKPGPurchasesByStatus } from '@/services/dummy';

export default function KPGPurchasesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on status and search
  const filteredData = getKPGPurchasesByStatus(statusFilter).filter(kpg => 
    kpg.nama_tabung.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpg.stock_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kpg.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by period
  const groupedByPeriod = filteredData.reduce((acc, kpg) => {
    const periodKey = `${kpg.periode_awal} - ${kpg.periode_akhir}`;
    if (!acc[periodKey]) {
      acc[periodKey] = [];
    }
    acc[periodKey].push(kpg);
    return acc;
  }, {} as Record<string, typeof kpgPurchases>);

  // Calculate statistics
  const totalQtyPO = filteredData.reduce((sum, kpg) => sum + kpg.qty_po, 0);
  const totalQtyActual = filteredData.reduce((sum, kpg) => sum + kpg.qty, 0);
  const totalBeli = filteredData.reduce((sum, kpg) => sum + kpg.total_harga_beli, 0);
  const totalJual = filteredData.reduce((sum, kpg) => sum + kpg.total_harga_jual, 0);
  const totalProfit = totalJual - totalBeli;

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
            <h1 className="text-3xl font-bold text-gray-800">Kontrak Payung Gas (KPG)</h1>
            <p className="text-gray-600 mt-1">Kelola data pembelian gas berdasarkan kontrak payung</p>
          </div>
          <button
            onClick={() => router.push('/kpg-purchases/create')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Tambah KPG Baru
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Qty PO</p>
            <p className="text-2xl font-bold text-blue-600">{totalQtyPO}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Qty Terealisasi</p>
            <p className="text-2xl font-bold text-green-600">{totalQtyActual}</p>
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
                placeholder="Cari tabung, stock code, atau vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              Tidak ada data KPG yang ditemukan
            </div>
          ) : (
            Object.keys(groupedByPeriod).map((periodKey) => {
              const items = groupedByPeriod[periodKey];
              const firstItem = items[0];
              
              return (
                <div key={periodKey} className="mb-6 last:mb-0">
                  {/* Period Header */}
                  <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                    <h3 className="font-bold text-blue-900">
                      {formatPeriod(firstItem.periode_awal, firstItem.periode_akhir)}
                    </h3>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">No</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama Tabung</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock Code</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vendor</th>
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
                        {items.map((kpg, idx) => (
                          <tr key={kpg.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{kpg.nama_tabung}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{kpg.stock_code}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{kpg.vendor}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">{kpg.qty_po}</td>
                            <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">{kpg.qty}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(kpg.harga_beli)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-orange-600">
                              {formatCurrency(kpg.total_harga_beli)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(kpg.harga_jual_item)}</td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-purple-600">
                              {formatCurrency(kpg.total_harga_jual)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                kpg.status === 'approved' ? 'bg-green-100 text-green-800' :
                                kpg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {kpg.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => router.push(`/kpg-purchases/${kpg.id}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
                          <td colSpan={4} className="px-4 py-3 text-sm text-gray-900">Subtotal Periode</td>
                          <td className="px-4 py-3 text-sm text-center text-blue-600">
                            {items.reduce((sum, kpg) => sum + kpg.qty_po, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-blue-600">
                            {items.reduce((sum, kpg) => sum + kpg.qty, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">-</td>
                          <td className="px-4 py-3 text-sm text-right text-orange-600">
                            {formatCurrency(items.reduce((sum, kpg) => sum + kpg.total_harga_beli, 0))}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">-</td>
                          <td className="px-4 py-3 text-sm text-right text-purple-600">
                            {formatCurrency(items.reduce((sum, kpg) => sum + kpg.total_harga_jual, 0))}
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
