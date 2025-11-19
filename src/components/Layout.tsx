import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(path + '/');
  };

  const navItems = [
    { href: '/', label: '📊 Dashboard', match: '/' },
    { href: '/purchases', label: 'Pembelian', match: '/purchases' },
    { href: '/inquiries', label: 'Inquiry', match: '/inquiries' },
    { href: '/vendors', label: 'Vendor', match: '/vendors' },
    { href: '/items', label: 'Barang', match: '/items' },
    { href: '/tenders', label: '🏆 Tender', match: '/tenders' },
    { href: '/reports/purchase-recap', label: '📄 Rekap', match: '/reports/purchase-recap' },
    { href: '/reports/yearly-recap', label: '📈 Rekap Tahunan', match: '/reports/yearly-recap' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h2 className="text-xl font-bold mr-8">P-Warehouse</h2>
              <div className="flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded transition-colors ${
                      (item.match === '/' ? router.pathname === '/' : router.pathname.startsWith(item.match))
                        ? 'bg-gray-700 bg-opacity-70'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
