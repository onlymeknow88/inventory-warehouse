export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  bank_name: string;
  account_number: string;
  account_name: string;
  payment_term: string;
  created_at: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  unit: string;
  min_stock?: number;
  warranty: string;
  photo_url: string;
  created_at: string;
  vendor_item_name?: string;
  link_url?: string;
}

export interface Purchase {
  id: number;
  user_id: number;
  po_number: string;
  job_detail: string;
  qty: number;
  unit: string;
  price_unit: number;
  price_shipping: number;
  price_admin: number;
  price_fee: number;
  price_total: number;
  vendor_id: number;
  payment_term: string;
  delivery_deadline: string;
  expedition: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
}

export interface Inquiry {
  id: number;
  user_id: number;
  vendor_id: number;
  item_id: number;
  vendor_item_name: string;
  link_url?: string;
  subject: string;
  inquiry_date: string;
  message: string;
  qty: number;
  unit: string;
  price_unit: number;
  price_total: number;
  vendor_status: 'pending' | 'approved' | 'rejected';
  reply_message?: string;
  status: 'sent' | 'replied' | 'closed';
  created_at: string;
}

export interface Tender {
  id: number;
  user_id: number;
  tender_date: string;
  letter_number: string;
  job_title: string;
  company_name: string;
  status_po: string;
  nominal_modal: number;
  penawaran_exc: number;
  spare_nego: number;
  nominal_nego: number;
  status_tender: 'menang_tender' | 'kalah_tender' | 'pending';
  nominal_pemenang: number;
  notes: string;
  created_at: string;
}
