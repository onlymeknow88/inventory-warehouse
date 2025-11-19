# P-Warehouse Frontend Next.js

Frontend application untuk sistem manajemen pembelian warehouse menggunakan Next.js 14, TypeScript, dan Tailwind CSS.

## 🚀 Features Completed

### ✅ Dashboard (`/`)
- 4 Gradient statistics cards (Pembelian, Tender, Vendor, Barang)
- Donut chart - Status Pembelian  
- Line chart - Tren Pembelian 6 bulan
- Bar charts - Status Tender & Top 5 Vendor
- Tabel Pembelian & Tender terbaru

### ✅ Purchases Module (`/purchases`)
- **List Page**: Table dengan search & filter status, summary statistics
- **Create Page**: Form lengkap dengan validasi dan auto-calculate total
- **Edit Page**: Pre-populated form dengan update functionality
- **Detail Page**: Comprehensive view dengan vendor info, price breakdown, action buttons

### ✅ Vendors Module (`/vendors`)
- **List Page**: Card grid layout dengan status badges
- **Detail Page**: Complete vendor info, banking details, items list, quick actions

### ✅ Items Module (`/items`)
- **List Page**: Grid layout dengan search, category filter, vendor count
- **Detail Page**: Item info, vendors list dengan marketplace links, statistics

### ✅ Inquiry Module (`/inquiries`)
- **List Page**: Table dengan search, filter status (sent/replied/closed)
- Subject-based inquiry dengan reply messages
- Link ke vendor & item

### ✅ Tenders Module (`/tenders`)
- **List Page**: Statistics cards, comprehensive table dengan status
- Total nilai pemenang highlight
- 8 columns data (tanggal, no surat, judul, perusahaan, dll)

### ✅ Reports Module
- **Purchase Recap** (`/reports/purchase-recap`): Filter by year/month/status, export & print
- **Yearly Recap** (`/reports/yearly-recap`): Monthly trend chart, status breakdown, top vendors
- **Tender Recap** (`/reports/tender-recap`): Win rate metrics, performance analysis, status PO

### ✅ Complete Dummy Data
- 3 users, 4 vendors (with bank details), 6 items (with category, unit, min_stock)
- 9 purchases, 6 inquiries (with subject & reply), 8 tenders
- 9 item-vendor relationships dengan marketplace links
- Helper functions: getById, getVendorsByItem, getItemsByVendor, getDashboardStats

## 📦 Tech Stack

- **Next.js 14** (Pages Router) + TypeScript
- **Tailwind CSS** untuk styling
- **Chart.js 4.5.1 + react-chartjs-2 5.3.1** untuk visualisasi data
- **@headlessui/react 2.2.9** untuk UI components
- **@heroicons/react 2.2.0** untuk icons
- **axios 1.13.2** (ready for API integration)
- **swr 2.3.6** (ready for data fetching)
- **react-hook-form 7.66.1** (ready for advanced forms)

## 🎨 Design Features

- Professional table styling dengan hover effects
- Gradient cards untuk statistics
- Status badges dengan color coding
- Responsive grid layouts (mobile-friendly)
- Search & filter functionality
- Empty states dengan icons
- Format Rupiah & tanggal Indonesia
- Print & export buttons (UI ready)

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.tsx          # Main layout dengan navbar
├── pages/
│   ├── index.tsx           # Dashboard
│   ├── purchases/
│   │   ├── index.tsx       # List + search/filter
│   │   ├── create.tsx      # Create form
│   │   ├── [id].tsx        # Detail page
│   │   └── [id]/edit.tsx   # Edit form
│   ├── vendors/
│   │   ├── index.tsx       # List (dari sebelumnya)
│   │   └── [id].tsx        # Detail page
│   ├── items/
│   │   ├── index.tsx       # List + search/filter
│   │   └── [id].tsx        # Detail page
│   ├── inquiries/
│   │   └── index.tsx       # List + search/filter
│   ├── tenders/
│   │   └── index.tsx       # List (dari sebelumnya)
│   └── reports/
│       ├── purchase-recap.tsx  # Rekap pembelian
│       ├── yearly-recap.tsx    # Rekap tahunan
│       └── tender-recap.tsx    # Rekap tender
├── services/
│   └── dummy.ts            # All dummy data & helpers
└── types/
    └── index.ts            # TypeScript interfaces
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📊 Pages Overview

| Page | Path | Features |
|------|------|----------|
| Dashboard | `/` | 4 charts, statistics, recent data |
| Purchases List | `/purchases` | Search, filter, CRUD links |
| Purchase Create | `/purchases/create` | Validation, auto-calculate |
| Purchase Detail | `/purchases/:id` | Full info, actions |
| Purchase Edit | `/purchases/:id/edit` | Pre-filled form |
| Vendors List | `/vendors` | Card grid, items preview |
| Vendor Detail | `/vendors/:id` | Banking, items, statistics |
| Items List | `/items` | Grid, search, category filter |
| Item Detail | `/items/:id` | Vendors list, marketplace |
| Inquiries | `/inquiries` | Table, status filter |
| Tenders | `/tenders` | Statistics, comprehensive |
| Purchase Recap | `/reports/purchase-recap` | Filters, breakdown |
| Yearly Recap | `/reports/yearly-recap` | Charts, monthly data |
| Tender Recap | `/reports/tender-recap` | Win rate, metrics |

## 🔄 Next Steps (Future Enhancements)

- [ ] API integration (replace dummy data)
- [ ] Authentication & authorization
- [ ] Real-time notifications
- [ ] File upload functionality
- [ ] Advanced search & filtering
- [ ] Export to Excel/PDF implementation
- [ ] Print functionality implementation
- [ ] Loading states & error handling
- [ ] Toast notifications
- [ ] Form validation improvements
- [ ] Pagination for large datasets
- [ ] Dark mode support

## 📝 Notes

- Semua data saat ini menggunakan dummy data dari `src/services/dummy.ts`
- Form submissions akan show alert (belum persist ke backend)
- Export & print buttons sudah ada UI, implementasi pending
- Siap untuk integrasi dengan Laravel backend API

## 🤝 Contributing

Untuk menambahkan fitur baru atau memperbaiki bug, silakan buat branch baru dan submit pull request.

## 📄 License

This project is for internal use.
