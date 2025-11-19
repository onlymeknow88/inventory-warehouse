import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getDashboardStats, getMonthlyPurchaseTrend, getTopVendors, getVendorById, purchases, tenders } from '@/services/dummy';
import Link from 'next/link';

import Layout from '@/components/Layout';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function Home() {
  const stats = getDashboardStats();
  const monthlyTrend = getMonthlyPurchaseTrend();
  const topVendors = getTopVendors();
  const recentPurchases = purchases.slice(-5).reverse();
  const recentTenders = tenders.slice(-5).reverse();

  // Donut Chart Data - Purchase by Status
  const purchaseStatusData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
    datasets: [
      {
        data: [
          stats.purchaseByStatus.pending,
          stats.purchaseByStatus.approved,
          stats.purchaseByStatus.rejected,
          stats.purchaseByStatus.completed,
        ],
        backgroundColor: ['#ffc107', '#28a745', '#dc3545', '#007bff'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Line Chart Data - Monthly Purchase Trend
  const monthlyPurchaseData = {
    labels: monthlyTrend.labels,
    datasets: [
      {
        label: 'Total Pembelian',
        data: monthlyTrend.data,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Bar Chart Data - Tender Status
  const tenderStatusData = {
    labels: ['Menang', 'Kalah', 'Pending'],
    datasets: [
      {
        label: 'Jumlah Tender',
        data: [stats.tenderByStatus.menang_tender, stats.tenderByStatus.kalah_tender, stats.tenderByStatus.pending],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  // Bar Chart Data - Top Vendors
  const topVendorsData = {
    labels: topVendors.map(v => v.name.length > 20 ? v.name.substring(0, 20) + '...' : v.name),
    datasets: [
      {
        label: 'Total Pembelian',
        data: topVendors.map(v => v.total),
        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

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

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-black">📊 Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{stats.totalPurchases}</div>
          <div className="text-lg opacity-90">Total Pembelian</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{stats.totalTenders}</div>
          <div className="text-lg opacity-90">Total Tender</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{stats.totalVendors}</div>
          <div className="text-lg opacity-90">Total Vendor</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-teal-400 text-white p-6 rounded-xl shadow-lg">
          <div className="text-4xl font-bold mb-2">{stats.totalItems}</div>
          <div className="text-lg opacity-90">Total Barang</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Status Pembelian</h3>
          <Doughnut
            data={purchaseStatusData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: { position: 'bottom' },
              },
            }}
          />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Tren Pembelian (6 Bulan Terakhir)</h3>
          <Line
            data={monthlyPurchaseData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => {
                      const num = Number(value);
                      if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)}jt`;
                      if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}rb`;
                      return `Rp ${num}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribusi Status Tender</h3>
          <Bar
            data={tenderStatusData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } },
              },
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Top 5 Vendor (Total Pembelian)</h3>
          <Bar
            data={topVendorsData}
            options={{
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: true,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => {
                      const num = Number(value);
                      if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)}jt`;
                      if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}rb`;
                      return `Rp ${num}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Pembelian Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">PO Number</th>
                  <th className="px-4 py-2 text-left">Vendor</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{formatDate(purchase.created_at)}</td>
                    <td className="px-4 py-2 text-gray-900">{purchase.po_number}</td>
                    <td className="px-4 py-2 text-gray-900">{getVendorById(purchase.vendor_id)?.name}</td>
                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">{formatRupiah(purchase.price_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/purchases" className="inline-block mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Lihat Semua
          </Link>
        </div>

        {/* Recent Tenders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Tender Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Judul</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {recentTenders.map((tender) => {
                  const statusColors: Record<string, string> = {
                    menang_tender: 'bg-green-100 text-green-800 border border-green-300',
                    kalah_tender: 'bg-red-100 text-red-800 border border-red-300',
                    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
                  };
                  const statusText: Record<string, string> = {
                    menang_tender: 'MENANG',
                    kalah_tender: 'KALAH',
                    pending: 'PENDING',
                  };
                  return (
                    <tr key={tender.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{formatDate(tender.tender_date)}</td>
                      <td className="px-4 py-2 text-gray-900">{tender.job_title.substring(0, 30)}...</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[tender.status_tender]}`}>
                          {statusText[tender.status_tender]}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right text-gray-900 font-semibold">{formatRupiah(tender.nominal_modal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Link href="/tenders" className="inline-block mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Lihat Semua
          </Link>
        </div>
      </div>
    </Layout>
  );
}
