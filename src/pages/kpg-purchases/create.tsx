import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

interface KPGFormData {
  periode_awal: string;
  periode_akhir: string;
  tahun: string;
  nama_tabung: string;
  stock_code: string;
  vendor: string;
  qty_po: number;
  harga_jual: number;
  harga_beli_lama: number;
  harga_beli_baru: number;
  qty: number;
  harga_beli: number;
  status: string;
  // Counting untuk setiap jenis gas
  argon_p10: number;
  oxy_hp: number;
  nitrogen: number;
  helium: number;
  ca: number;
  gas_mix: number;
  gas_mix_2: number;
  acy: number;
  oxy: number;
  argon: number;
  argon_2: number;
  acy_hp: number;
  co2_46: number;
  hydrot: number;
}

export default function CreateKPGPurchase() {
  const router = useRouter();
  const [formData, setFormData] = useState<KPGFormData>({
    periode_awal: '',
    periode_akhir: '',
    tahun: new Date().getFullYear().toString(),
    nama_tabung: '',
    stock_code: '',
    vendor: '',
    qty_po: 0,
    harga_jual: 0,
    harga_beli_lama: 0,
    harga_beli_baru: 0,
    qty: 0,
    harga_beli: 0,
    status: 'pending',
    // Counting gas
    argon_p10: 0,
    oxy_hp: 0,
    nitrogen: 0,
    helium: 0,
    ca: 0,
    gas_mix: 0,
    gas_mix_2: 0,
    acy: 0,
    oxy: 0,
    argon: 0,
    argon_2: 0,
    acy_hp: 0,
    co2_46: 0,
    hydrot: 0,
  });

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const gasTypes = [
    { nama: 'O2', code: 'O2-001' },
    { nama: 'N2', code: 'N2-001' },
    { nama: 'CO2', code: 'CO2-001' },
    { nama: 'Argon', code: 'AR-001' },
    { nama: 'Acetylene', code: 'ACE-001' },
  ];

  const vendors = [
    'PT. Gas Alam Indonesia',
    'CV. Supplier Gas Mandiri',
    'PT. Indo Gas Nusantara',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['qty_po', 'harga_jual', 'harga_beli_lama', 'harga_beli_baru', 'qty', 'harga_beli',
      'argon_p10', 'oxy_hp', 'nitrogen', 'helium', 'ca', 'gas_mix', 'gas_mix_2', 'acy', 'oxy', 'argon', 'argon_2', 'acy_hp', 'co2_46', 'hydrot'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleGasTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGas = gasTypes.find(gas => gas.nama === e.target.value);
    if (selectedGas) {
      setFormData(prev => ({
        ...prev,
        nama_tabung: selectedGas.nama,
        stock_code: selectedGas.code,
      }));
    }
  };

  const totalHargaBeli = formData.qty * formData.harga_beli;
  const totalHargaJual = formData.qty * formData.harga_jual;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.periode_awal || !formData.periode_akhir) {
      alert('Mohon pilih periode awal dan akhir');
      return;
    }
    if (!formData.nama_tabung || !formData.vendor) {
      alert('Mohon lengkapi data tabung dan vendor');
      return;
    }
    
    // In real app, this would POST to API
    console.log('KPG Purchase Data:', {
      ...formData,
      total_harga_beli: totalHargaBeli,
      total_harga_jual: totalHargaJual,
      created_at: new Date().toISOString(),
    });

    alert('Data KPG berhasil disimpan!');
    router.push('/kpg-purchases');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Kembali
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Tambah Kontrak Payung Gas (KPG)</h1>
          <p className="text-gray-600 mt-1">Isi formulir data pembelian gas berdasarkan kontrak payung</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Periode Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Periode Kontrak</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Awal <span className="text-red-500">*</span>
                </label>
                <select
                  name="periode_awal"
                  value={formData.periode_awal}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Bulan</option>
                  {months.map(month => (
                    <option key={month.value} value={`${month.value}-${formData.tahun}`}>
                      {month.label} {formData.tahun}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Akhir <span className="text-red-500">*</span>
                </label>
                <select
                  name="periode_akhir"
                  value={formData.periode_akhir}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Bulan</option>
                  {months.map(month => (
                    <option key={month.value} value={`${month.value}-${formData.tahun}`}>
                      {month.label} {formData.tahun}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tahun"
                  value={formData.tahun}
                  onChange={handleChange}
                  required
                  min="2020"
                  max="2030"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Gas Details Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Detail Gas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Tabung <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.nama_tabung}
                  onChange={handleGasTypeChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Jenis Gas</option>
                  {gasTypes.map(gas => (
                    <option key={gas.code} value={gas.nama}>
                      {gas.nama} ({gas.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stock_code"
                  value={formData.stock_code}
                  onChange={handleChange}
                  required
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor <span className="text-red-500">*</span>
                </label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Gas Counting Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Counting Gas (Quantity per Type)</h3>
            <p className="text-sm text-gray-600 mb-4">Isikan jumlah tabung untuk setiap jenis gas yang dibeli</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ARGON P10</label>
                <input
                  type="number"
                  name="argon_p10"
                  value={formData.argon_p10 || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">OXY HP</label>
                <input
                  type="number"
                  name="oxy_hp"
                  value={formData.oxy_hp || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">NITROGEN</label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">HELIUM</label>
                <input
                  type="number"
                  name="helium"
                  value={formData.helium || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">CA</label>
                <input
                  type="number"
                  name="ca"
                  value={formData.ca || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">GAS MIX</label>
                <input
                  type="number"
                  name="gas_mix"
                  value={formData.gas_mix || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">GAS MIX 2</label>
                <input
                  type="number"
                  name="gas_mix_2"
                  value={formData.gas_mix_2 || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ACY</label>
                <input
                  type="number"
                  name="acy"
                  value={formData.acy || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">OXY</label>
                <input
                  type="number"
                  name="oxy"
                  value={formData.oxy || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ARGON</label>
                <input
                  type="number"
                  name="argon"
                  value={formData.argon || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ARGON 2</label>
                <input
                  type="number"
                  name="argon_2"
                  value={formData.argon_2 || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ACY HP</label>
                <input
                  type="number"
                  name="acy_hp"
                  value={formData.acy_hp || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">CO2 46</label>
                <input
                  type="number"
                  name="co2_46"
                  value={formData.co2_46 || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">HYDROT</label>
                <input
                  type="number"
                  name="hydrot"
                  value={formData.hydrot || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total Counting:</strong> {formData.argon_p10 + formData.oxy_hp + formData.nitrogen + formData.helium + formData.ca + formData.gas_mix + formData.gas_mix_2 + formData.acy + formData.oxy + formData.argon + formData.argon_2 + formData.acy_hp + formData.co2_46 + formData.hydrot} tabung
              </p>
            </div>
          </div>

          {/* Quantity & Pricing Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Kuantitas & Harga</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qty PO <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="qty_po"
                  value={formData.qty_po || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qty Terealisasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Beli Lama <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga_beli_lama"
                  value={formData.harga_beli_lama || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Beli Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga_beli_baru"
                  value={formData.harga_beli_baru || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Beli (Aktual) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga_beli"
                  value={formData.harga_beli || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga Jual <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga_jual"
                  value={formData.harga_jual || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Total</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Harga Beli</p>
                <p className="text-xl font-bold text-orange-600">{formatCurrency(totalHargaBeli)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Harga Jual</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(totalHargaJual)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Profit</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalHargaJual - totalHargaBeli)}</p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Status</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Kontrak <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Simpan Data KPG
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
