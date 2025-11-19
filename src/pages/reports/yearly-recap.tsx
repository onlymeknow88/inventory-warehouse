import Layout from '@/components/Layout';
import { purchases, getUserById, getVendorById } from '@/services/dummy';
import { useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function YearlyRecapPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const years = Array.from(new Set(purchases.map(p => new Date(p.created_at).getFullYear())));

  const yearlyPurchases = purchases.filter(p => {
    const year = new Date(p.created_at).getFullYear().toString();
    return year === selectedYear;
  });

  // Group by month
  const monthNames = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
  ];

  interface MonthlyData {
    month_name: string;
    purchases: any[];
    total_pembelian: number;
    total_ppn: number;
    total_nilai_po: number;
    total_fee: number;
    total_profit: number;
  }

  const monthlyData: Record<number, MonthlyData> = {};

  yearlyPurchases.forEach(purchase => {
    const month = new Date(purchase.created_at).getMonth() + 1;
    
    if (!monthlyData[month]) {
      monthlyData[month] = {
        month_name: monthNames[month - 1],
        purchases: [],
        total_pembelian: 0,
        total_ppn: 0,
        total_nilai_po: 0,
        total_fee: 0,
        total_profit: 0,
      };
    }

    const ppn = purchase.price_total * 0.11;
    const nilai_po = purchase.price_total * 1.11;
    const profit = nilai_po - purchase.price_total - purchase.price_fee;

    monthlyData[month].purchases.push(purchase);
    monthlyData[month].total_pembelian += purchase.price_total;
    monthlyData[month].total_ppn += ppn;
    monthlyData[month].total_nilai_po += nilai_po;
    monthlyData[month].total_fee += purchase.price_fee;
    monthlyData[month].total_profit += profit;
  });

  // Calculate grand totals
  const grandTotal = {
    pembelian: Object.values(monthlyData).reduce((sum, m) => sum + m.total_pembelian, 0),
    ppn: Object.values(monthlyData).reduce((sum, m) => sum + m.total_ppn, 0),
    nilai_po: Object.values(monthlyData).reduce((sum, m) => sum + m.total_nilai_po, 0),
    fee: Object.values(monthlyData).reduce((sum, m) => sum + m.total_fee, 0),
    profit: Object.values(monthlyData).reduce((sum, m) => sum + m.total_profit, 0),
  };

  const formatRupiah = (value: number) => {
    return `Rp${value.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthShort = date.toLocaleDateString('id-ID', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${monthShort}-${year}`;
  };

  const handlePrint = () => {
    window.print();
  };

  // Format Y-axis helper
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`; // Miliar
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`; // Juta
    if (value >= 1000) return `${(value / 1000).toFixed(1)}rb`; // Ribu
    return value.toLocaleString('id-ID');
  };

  // Prepare chart data
  const chartData = Object.entries(monthlyData).map(([monthNum, data]) => ({
    month: monthNames[parseInt(monthNum) - 1].substring(0, 3),
    pembelian: data.total_pembelian,
    profit: data.total_profit,
    ppn: data.total_ppn,
    fee: data.total_fee,
    profit_pct: data.total_pembelian > 0 ? (data.total_profit / data.total_pembelian * 100) : 0
  }));


  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">REKAP PEKERJAAN {selectedYear}</h1>
        <div className="flex gap-2 items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            {years.map(year => (
              <option key={year} value={year}>Tahun {year}</option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Charts Section */}
      {Object.entries(monthlyData).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          {/* Monthly Profit Trend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Trend Profit Bulanan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line type="monotone" dataKey="pembelian" stroke="#3B82F6" name="Total Pembelian" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" name="Total Profit" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Comparison Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Perbandingan Pembelian vs Profit</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="pembelian" fill="#3B82F6" name="Total Pembelian" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" fill="#10B981" name="Total Profit" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Percentage Trend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Persentase Profit Bulanan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line type="monotone" dataKey="profit_pct" stroke="#A78BFA" name="% Profit" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Breakdown Biaya Bulanan</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatYAxis} />
                <Tooltip 
                  formatter={(value: number) => formatRupiah(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Bar dataKey="ppn" fill="#FCD34D" name="PPN 11%" radius={[8, 8, 0, 0]} />
                <Bar dataKey="fee" fill="#F472B6" name="Fee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-3 py-3 border border-gray-400 text-center" rowSpan={2}>NO</th>
                <th className="px-3 py-3 border border-gray-400" rowSpan={2}>BULAN PEMBELIAN</th>
                <th className="px-3 py-3 border border-gray-400" rowSpan={2}>NO. PENAWARAN</th>
                <th className="px-3 py-3 border border-gray-400 text-center" rowSpan={2}>TANGGAL</th>
                <th className="px-3 py-3 border border-gray-400 text-center" rowSpan={2}>TANGGAL</th>
                <th className="px-3 py-3 border border-gray-400 text-center" rowSpan={2}>TANGGAL PO</th>
                <th className="px-3 py-3 border border-gray-400 text-center" rowSpan={2}>NO PO</th>
                <th className="px-3 py-3 border border-gray-400" rowSpan={2}>JUDUL PEKERJAAN</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>TOTAL PEMBELIAN</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>PPN 11%</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>TOTAL NILAI PO</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>FEE</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>DENDA</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>PROFIT</th>
                <th className="px-3 py-3 border border-gray-400 text-center" colSpan={3}>HASIL/ITAGE PROFIT (JUMLAH MODAL)</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>JUMLAH</th>
                <th className="px-3 py-3 border border-gray-400 text-right" rowSpan={2}>JUMLAH PROFIT</th>
                <th className="px-3 py-3 border border-gray-400 text-center" rowSpan={2}>PERSENTASE</th>
              </tr>
              <tr className="bg-gray-700 text-white">
                <th className="px-2 py-2 border border-gray-400 text-right">JUMLAH</th>
                <th className="px-2 py-2 border border-gray-400 text-right">JUMLAH PROFIT</th>
                <th className="px-2 py-2 border border-gray-400 text-center">PERSENTASE</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(monthlyData).length > 0 ? (
                Object.entries(monthlyData).map(([monthNum, data], monthIndex) => {
                  let rowNumber = 1;
                  if (monthIndex > 0) {
                    const prevMonths = Object.entries(monthlyData).slice(0, monthIndex);
                    rowNumber = prevMonths.reduce((sum, [, m]) => sum + m.purchases.length, 0) + 1;
                  }

                  return data.purchases.map((purchase, purchaseIndex) => {
                    const isFirstInMonth = purchaseIndex === 0;
                    const ppn = purchase.price_total * 0.11;
                    const nilai_po = purchase.price_total * 1.11;
                    const profit = nilai_po - purchase.price_total - purchase.price_fee;
                    const profit_percentage = purchase.price_total > 0 ? (profit / purchase.price_total) * 100 : 0;
                    const currentRowNum = rowNumber + purchaseIndex;

                    return (
                      <tr key={`${monthNum}-${purchase.id}`} className="border-b border-gray-200">
                        <td className="px-3 py-2 border border-gray-300 text-center text-gray-900">{currentRowNum}</td>
                        
                        {isFirstInMonth && (
                          <td 
                            className="px-3 py-2 border border-gray-300 font-bold bg-blue-50 text-gray-900" 
                            rowSpan={data.purchases.length}
                          >
                            {data.month_name}
                          </td>
                        )}
                        
                        <td className="px-3 py-2 border border-gray-300 text-gray-900">-</td>
                        <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap text-gray-900">
                          {formatDate(purchase.created_at)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap text-gray-900">
                          {formatDate(purchase.created_at)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-center whitespace-nowrap text-gray-900">
                          {formatDate(purchase.created_at)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300">
                          <Link href={`/purchases/${purchase.id}`} className="text-blue-600 hover:underline">
                            {purchase.po_number}
                          </Link>
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-gray-900">{purchase.job_detail}</td>
                        <td className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap text-gray-900">
                          {formatRupiah(purchase.price_total)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap text-gray-900">
                          {formatRupiah(ppn)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap font-bold text-gray-900">
                          {formatRupiah(nilai_po)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap text-gray-900">
                          {formatRupiah(purchase.price_fee)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-right text-gray-900">-</td>
                        <td className={`px-3 py-2 border border-gray-300 text-right whitespace-nowrap font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatRupiah(profit)}
                        </td>

                        {isFirstInMonth && (
                          <>
                            <td 
                              className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap bg-yellow-50 text-gray-900" 
                              rowSpan={data.purchases.length}
                            >
                              {formatRupiah(data.total_pembelian)}
                            </td>
                            <td 
                              className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap bg-green-50 font-bold text-green-700" 
                              rowSpan={data.purchases.length}
                            >
                              {formatRupiah(data.total_profit)}
                            </td>
                            <td 
                              className="px-3 py-2 border border-gray-300 text-center bg-blue-50 font-bold text-blue-700" 
                              rowSpan={data.purchases.length}
                            >
                              {data.total_pembelian > 0 ? ((data.total_profit / data.total_pembelian) * 100).toFixed(2) : '0.00'}%
                            </td>
                          </>
                        )}

                        <td className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap text-gray-900">
                          {formatRupiah(purchase.price_total)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-right whitespace-nowrap font-bold text-green-600">
                          {formatRupiah(profit)}
                        </td>
                        <td className="px-3 py-2 border border-gray-300 text-center font-bold text-blue-700">
                          {profit_percentage.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  });
                })
              ) : (
                <tr>
                  <td colSpan={20} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data pembelian untuk tahun {selectedYear}
                  </td>
                </tr>
              )}

              {/* Grand Total Row */}
              {Object.entries(monthlyData).length > 0 && (
                <tr className="bg-gray-800 text-white font-bold text-sm">
                  <td colSpan={8} className="px-4 py-4 border border-gray-400 text-right">GRAND TOTAL:</td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap">
                    {formatRupiah(grandTotal.pembelian)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap">
                    {formatRupiah(grandTotal.ppn)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap">
                    {formatRupiah(grandTotal.nilai_po)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap">
                    {formatRupiah(grandTotal.fee)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-right">-</td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap text-base">
                    {formatRupiah(grandTotal.profit)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap">
                    {formatRupiah(grandTotal.pembelian)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-right whitespace-nowrap text-base">
                    {formatRupiah(grandTotal.profit)}
                  </td>
                  <td className="px-4 py-4 border border-gray-400 text-center text-base">
                    {grandTotal.pembelian > 0 ? ((grandTotal.profit / grandTotal.pembelian) * 100).toFixed(2) : '0.00'}%
                  </td>
                  <td colSpan={3} className="px-4 py-4 border border-gray-400"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @media print {
          table {
            font-size: 9px !important;
          }
          th, td {
            padding: 0.25rem !important;
          }
        }
      `}</style>
    </Layout>
  );
}
