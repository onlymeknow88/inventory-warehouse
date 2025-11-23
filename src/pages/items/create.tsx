import Layout from '@/components/Layout';
import { vendors } from '@/services/dummy';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function CreateItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Elektronik',
    unit: 'EA',
    min_stock: 0,
    warranty: '',
    photo_url: ''
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vendorSearch, setVendorSearch] = useState<string>('');
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState<boolean>(false);

  const categories = [
    'Elektronik',
    'Furniture',
    'Alat Tulis',
    'Komputer',
    'Perlengkapan Kantor',
    'Alat Kebersihan',
    'Konsumsi',
    'Lainnya'
  ];

  const units = ['EA', 'PCS', 'SET', 'UNIT', 'BOX', 'ROLL', 'METER', 'KG', 'LITER'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      alert('Nama dan Deskripsi wajib diisi!');
      return;
    }

    console.log('Data barang baru:', {
      ...formData,
      vendors: selectedVendors,
      photoFile: selectedFile
    });
    
    if (selectedFile) {
      console.log('File to upload:', selectedFile.name, selectedFile.size, 'bytes');
      // In production: upload file to server/cloud storage here
      // const uploadedUrl = await uploadFile(selectedFile);
      // formData.photo_url = uploadedUrl;
    }

    alert('Barang berhasil dibuat!');
    router.push('/items');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'min_stock' ? Number(value) || 0 : value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, photo_url: url }));
    setPhotoPreview(url);
    setSelectedFile(null); // Clear file if URL is entered
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview from file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear URL input
      setFormData(prev => ({ ...prev, photo_url: '' }));
    }
  };

  const handleVendorToggle = (vendorId: number) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    vendor.phone.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    vendor.email.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tambah Barang</h1>
        <p className="text-gray-600 mt-1">Buat barang baru di master data</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Barang */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: MAJUN MERAH - Lap Kain Premium"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Deskripsi lengkap barang..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                ></textarea>
              </div>

              {/* Kategori */}
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Satuan */}
              <div>
                <label htmlFor="unit" className="block text-sm font-bold text-gray-700 mb-2">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* Min Stock */}
              <div>
                <label htmlFor="min_stock" className="block text-sm font-bold text-gray-700 mb-2">
                  Minimal Stock
                </label>
                <input
                  type="number"
                  id="min_stock"
                  name="min_stock"
                  value={formData.min_stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>

              {/* Garansi */}
              <div>
                <label htmlFor="warranty" className="block text-sm font-bold text-gray-700 mb-2">
                  Garansi
                </label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="Contoh: 6 Bulan, 1 Tahun"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Foto Barang</h3>
            
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Upload Foto <span className="text-blue-600">(Rekomendasi)</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors bg-white">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-semibold text-blue-600">Klik untuk upload</span>
                          <p className="text-xs mt-1">PNG, JPG, GIF hingga 10MB</p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPhotoPreview('');
                      }}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ATAU</span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label htmlFor="photo_url" className="block text-sm font-bold text-gray-700 mb-2">
                  URL Foto Barang
                </label>
                <input
                  type="url"
                  id="photo_url"
                  name="photo_url"
                  value={formData.photo_url}
                  onChange={handlePhotoChange}
                  disabled={!!selectedFile}
                  placeholder="https://example.com/foto-barang.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Masukkan URL foto barang atau gunakan placeholder jika kosong
                </p>
              </div>

              {/* Photo Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Preview Foto
                </label>
                <div className="flex justify-center">
                  {(photoPreview || (formData.photo_url && formData.photo_url !== '#')) ? (
                    <Image 
                      src={photoPreview || formData.photo_url || 'https://via.placeholder.com/300x300?text=Belum+Ada+Foto'} 
                      alt="Preview"
                      width={256}
                      height={256}
                      className="w-64 h-64 object-cover rounded-lg border-2 border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
                      }}
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">📷</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Selection */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Vendor yang Menjual Barang Ini</h3>
            <p className="text-sm text-gray-600 mb-3">Pilih vendor yang menyediakan barang ini</p>
            
            <div className="relative">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  onFocus={() => setIsVendorDropdownOpen(true)}
                  placeholder="Cari vendor (nama, telepon, email)..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                {vendorSearch && (
                  <button
                    type="button"
                    onClick={() => setVendorSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Dropdown List */}
              {isVendorDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsVendorDropdownOpen(false)}
                  ></div>
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredVendors.length > 0 ? (
                      <div className="py-1">
                        {filteredVendors.map(vendor => (
                          <button
                            key={vendor.id}
                            type="button"
                            onClick={() => {
                              handleVendorToggle(vendor.id);
                              setVendorSearch('');
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedVendors.includes(vendor.id) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                              selectedVendors.includes(vendor.id)
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {selectedVendors.includes(vendor.id) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-900">{vendor.name}</div>
                              <div className="text-sm text-gray-600">{vendor.phone} • {vendor.email}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-sm">Vendor tidak ditemukan</p>
                        <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
              {/* Selected Vendors Preview */}
              {selectedVendors.length > 0 && (
                <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold text-blue-900">{selectedVendors.length} vendor dipilih</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedVendors([])}
                      className="text-xs text-red-600 hover:text-red-800 font-medium px-3 py-1 bg-white rounded hover:bg-red-50 transition-colors"
                    >
                      Hapus Semua
                    </button>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-12">No</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Vendor</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Telepon</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedVendors.map((vendorId, index) => {
                          const vendor = vendors.find(v => v.id === vendorId);
                          return vendor ? (
                            <tr key={vendorId} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">{index + 1}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-bold text-gray-900">{vendor.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{vendor.phone}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{vendor.email}</td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleVendorToggle(vendorId)}
                                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ) : null;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>          {/* Summary Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Ringkasan Barang</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nama:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formData.name || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Kategori:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formData.category}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Satuan:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formData.unit}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Min Stock:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formData.min_stock}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Garansi:</span>
                <span className="float-right font-semibold text-gray-900">
                  {formData.warranty || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total Vendor:</span>
                <span className="float-right font-semibold text-gray-900">
                  {selectedVendors.length}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
            >
              Simpan Barang
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
