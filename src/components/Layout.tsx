import { ReactNode, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
  };

  const pembelianMenu = [
    { href: '/tenders', label: 'Info Tender', icon: '🏆' },
    { href: '/inquiries', label: 'Form Barang/Jasa', icon: '📋' },
    { href: '/purchases', label: 'Form Pembelian', icon: '🛒' },
    { href: '/kpg-purchases', label: 'KPG (Kontrak Payung Gas)', icon: '⛽' },
    { href: '/kpc-purchases', label: 'KPC (Kontrak Payung Consumable)', icon: '📦' },
    { href: '/vendors', label: 'Vendor', icon: '🏢' },
    { href: '/reports/invoice-tabung', label: 'Invoice Vendor Tabung', icon: '🧾' },
    { href: '/reports/purchase-recap', label: 'Rekap Purchasing', icon: '📄' },
    { href: '/reports/accounts-receivable', label: 'Rekap Piutang', icon: '💰' },
  ];

  const masterDataMenu = [
    { href: '/items', label: 'Barang', icon: '📦' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {sidebarOpen && <h2 className="text-xl font-bold">P-Warehouse</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Dashboard */}
          <Link
            href="/"
            className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
              isActivePath('/') && router.pathname === '/' ? 'bg-gray-700 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="text-2xl">📊</span>
            {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
          </Link>

          {/* Pembelian Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => toggleDropdown('pembelian')}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors ${
                pembelianMenu.some(item => isActivePath(item.href)) ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl">🛒</span>
                {sidebarOpen && <span className="ml-3 font-medium">Pembelian</span>}
              </div>
              {sidebarOpen && (
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'pembelian' ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {openDropdown === 'pembelian' && sidebarOpen && (
              <div className="bg-gray-900">
                {pembelianMenu.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleMenuClick(item.href)}
                    className={`w-full flex items-center px-4 py-2.5 pl-12 hover:bg-gray-700 transition-colors text-left ${
                      isActivePath(item.href) ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Master Data Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => toggleDropdown('masterdata')}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors ${
                masterDataMenu.some(item => isActivePath(item.href)) ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl">📚</span>
                {sidebarOpen && <span className="ml-3 font-medium">Master Data</span>}
              </div>
              {sidebarOpen && (
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === 'masterdata' ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            {openDropdown === 'masterdata' && sidebarOpen && (
              <div className="bg-gray-900">
                {masterDataMenu.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleMenuClick(item.href)}
                    className={`w-full flex items-center px-4 py-2.5 pl-12 hover:bg-gray-700 transition-colors text-left ${
                      isActivePath(item.href) ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reports */}
          <Link
            href="/reports/yearly-recap"
            className={`flex items-center px-4 py-3 mt-2 hover:bg-gray-700 transition-colors ${
              isActivePath('/reports/yearly-recap') ? 'bg-gray-700 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="text-2xl">📈</span>
            {sidebarOpen && <span className="ml-3 font-medium">Rekap Tahunan</span>}
          </Link>
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">© 2025 P-Warehouse</p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {router.pathname === '/' ? 'Dashboard' : 
             router.pathname.includes('/tenders') ? 'Info Tender' :
             router.pathname.includes('/inquiries') ? 'Form Barang/Jasa' :
             router.pathname.includes('/kpg-purchases') ? 'KPG (Kontrak Payung Gas)' :
             router.pathname.includes('/kpc-purchases') ? 'KPC (Kontrak Payung Consumable)' :
             router.pathname.includes('/purchases') ? 'Form Pembelian' :
             router.pathname.includes('/vendors') ? 'Vendor' :
             router.pathname.includes('/items') ? 'Barang' :
             router.pathname.includes('/reports/invoice-tabung') ? 'Invoice Vendor Tabung' :
             router.pathname.includes('/reports/purchase-recap') ? 'Rekap Purchasing' :
             router.pathname.includes('/reports/accounts-receivable') ? 'Rekap Piutang' :
             router.pathname.includes('/reports/yearly-recap') ? 'Rekap Tahunan' : 'P-Warehouse'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin User</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
