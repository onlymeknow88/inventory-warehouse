import Layout from '@/components/Layout';
import { purchases, vendors, getVendorById, getUserById } from '@/services/dummy';
import { useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PurchaseRecapPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const months = [
    { value: 'all', label: 'Semua Bulan' },
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];


  const filteredPurchases = purchases.filter(p => {
    const date = new Date(p.created_at);
    
    let matchDate = true;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      matchDate = date >= start && date <= end;
    }
    
    const matchVendor = selectedVendor === 'all' || p.vendor_id === Number(selectedVendor);
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchDate && matchVendor && matchStatus;
  });

  const totalQty = filteredPurchases.reduce((sum, p) => sum + p.qty, 0);
  const totalPriceUnit = filteredPurchases.reduce((sum, p) => sum + (p.qty * p.price_unit), 0);
  const totalShipping = filteredPurchases.reduce((sum, p) => sum + p.price_shipping, 0);
  const totalAdmin = filteredPurchases.reduce((sum, p) => sum + p.price_admin, 0);
  const totalFee = filteredPurchases.reduce((sum, p) => sum + p.price_fee, 0);
  const grandTotal = filteredPurchases.reduce((sum, p) => sum + p.price_total, 0);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedVendor('all');
    setSelectedStatus('all');
  };

  const handleExport = () => {
    alert('Export Excel (dalam pengembangan)');
  };

  // Prepare chart data
  const statusChartData = [
    { name: 'Pending', value: filteredPurchases.filter(p => p.status === 'pending').length, color: '#FCD34D' },
    { name: 'Approved', value: filteredPurchases.filter(p => p.status === 'approved').length, color: '#34D399' },
    { name: 'Rejected', value: filteredPurchases.filter(p => p.status === 'rejected').length, color: '#F87171' },
    { name: 'Completed', value: filteredPurchases.filter(p => p.status === 'completed').length, color: '#60A5FA' },
  ].filter(item => item.value > 0);

  // Vendor spending chart data
  const vendorSpendingData = vendors
    .map(vendor => {
      const vendorPurchases = filteredPurchases.filter(p => p.vendor_id === vendor.id);
      const total = vendorPurchases.reduce((sum, p) => sum + p.price_total, 0);
      return {
        name: vendor.name.length > 15 ? vendor.name.substring(0, 15) + '...' : vendor.name,
        total: total,
        count: vendorPurchases.length
      };
    })
    .filter(v => v.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Monthly trend data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthPurchases = filteredPurchases.filter(p => {
      const date = new Date(p.created_at);
      return date.getMonth() + 1 === month;
    });
    return {
      month: months[month].label.substring(0, 3),
      total: monthPurchases.reduce((sum, p) => sum + p.price_total, 0),
      count: monthPurchases.length
    };
  }).filter(m => m.total > 0);

  const COLORS = ['#FCD34D', '#34D399', '#F87171', '#60A5FA', '#A78BFA', '#F472B6'];

  // Format Y-axis helper
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}M`; // Miliar
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`; // Juta
    if (value >= 1000) return `${(value / 1000).toFixed(1)}rb`; // Ribu
    return value.toLocaleString('id-ID');
  };

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Rekap Pembelian</h1>
          <p className="text-gray-600 mt-1">Laporan detail rekapitulasi pembelian</p>
        </div>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          📥 Export Excel
        </button>
      </div>

      {/* Filter Form */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">Semua Vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            � Reset
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Menampilkan {filteredPurchases.length} dari {purchases.length} pembelian
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Pembelian</div>
          <div className="text-3xl font-bold mt-2">{filteredPurchases.length}</div>
          <div className="text-sm opacity-80 mt-1">Purchase Orders</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Quantity</div>
          <div className="text-3xl font-bold mt-2">{totalQty.toLocaleString('id-ID')}</div>
          <div className="text-sm opacity-80 mt-1">Items</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-90">Total Nilai</div>
          <div className="text-2xl font-bold mt-2">{formatRupiah(grandTotal)}</div>
          <div className="text-sm opacity-80 mt-1">Rupiah</div>
        </div>
      </div>


      {/* Charts Section */}
      {filteredPurchases.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Status Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Distribusi Status Pembelian</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {statusChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700">{item.name}: <span className="font-bold">{item.value}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Vendors by Spending */}
          {vendorSpendingData.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Top 5 Vendor (Total Pembelian)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendorSpendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip 
                    formatter={(value: number) => formatRupiah(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="total" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Monthly Trend Chart */}
      {monthlyData.length > 0 && filteredPurchases.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Trend Pembelian Bulanan</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" tickFormatter={formatYAxis} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'total') return [formatRupiah(value), 'Total Nilai'];
                  return [value, 'Jumlah PO'];
                }}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="total" fill="#3B82F6" name="Total Nilai" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="count" fill="#10B981" name="Jumlah PO" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}


      {/* Data Table */}
      {filteredPurchases.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase">No</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase whitespace-nowrap">Tanggal</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase whitespace-nowrap">No. PO</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase">Vendor</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase">Detail Pekerjaan</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase">Qty</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase">Satuan</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase whitespace-nowrap">Harga Satuan</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase whitespace-nowrap">Total Harga</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase whitespace-nowrap">Ongkir</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase whitespace-nowrap">Admin</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase whitespace-nowrap">Fee</th>
                  <th className="px-3 py-3 text-right text-xs font-bold uppercase whitespace-nowrap">Grand Total</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase whitespace-nowrap">Term Pembayaran</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase whitespace-nowrap">Deadline</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase">Ekspedisi</th>
                  <th className="px-3 py-3 text-center text-xs font-bold uppercase">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-bold uppercase">User</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredPurchases.map((purchase, index) => {
                  const vendor = getVendorById(purchase.vendor_id);
                  const user = getUserById(purchase.user_id);
                  const totalHarga = purchase.qty * purchase.price_unit;
                  
                  return (
                    <tr 
                      key={purchase.id} 
                      className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="px-3 py-3 text-center text-gray-900">{index + 1}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-900">{formatDate(purchase.created_at)}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <Link href={`/purchases/${purchase.id}`} className="text-blue-600 hover:underline font-semibold">
                          {purchase.po_number}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-gray-900">{vendor?.name}</td>
                      <td className="px-3 py-3 max-w-xs">
                        <div className="line-clamp-2 text-gray-900">{purchase.job_detail}</div>
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-gray-900">{purchase.qty}</td>
                      <td className="px-3 py-3 text-center text-gray-900">{purchase.unit}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap text-gray-900">{formatRupiah(purchase.price_unit)}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap font-semibold text-gray-900">{formatRupiah(totalHarga)}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap text-gray-900">{formatRupiah(purchase.price_shipping)}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap text-gray-900">{formatRupiah(purchase.price_admin)}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap text-gray-900">{formatRupiah(purchase.price_fee)}</td>
                      <td className="px-3 py-3 text-right whitespace-nowrap font-bold text-green-600">
                        {formatRupiah(purchase.price_total)}
                      </td>
                      <td className="px-3 py-3 text-gray-900">{purchase.payment_term}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-900">{formatDate(purchase.delivery_deadline)}</td>
                      <td className="px-3 py-3 text-gray-900">{purchase.expedition}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(purchase.status)}`}>
                          {purchase.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-900">{user?.name}</td>
                    </tr>
                  );
                })}

                {/* Total Row */}
                <tr className="bg-gray-800 text-white font-bold">
                  <td colSpan={5} className="px-4 py-4 text-right">TOTAL:</td>
                  <td className="px-4 py-4 text-center">{totalQty.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4"></td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">{formatRupiah(totalPriceUnit)}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">{formatRupiah(totalShipping)}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">{formatRupiah(totalAdmin)}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">{formatRupiah(totalFee)}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap text-lg">{formatRupiah(grandTotal)}</td>
                  <td colSpan={5} className="px-4 py-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl text-gray-600 mt-4">Tidak ada data pembelian</p>
          <p className="text-sm text-gray-500 mt-2">Silakan ubah filter atau tambahkan data pembelian baru</p>
        </div>
      )}
    </Layout>
  );
}
