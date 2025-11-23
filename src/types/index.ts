export interface User {
  id: number;
  name: string;
  email: string;
}

export type FormCode = 'U' | 'J' | 'P';

export const FORM_CODE_LABELS: Record<FormCode, string> = {
  U: 'Urgent',
  J: 'Jasa',
  P: 'PO'
};

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
  is_urgent: boolean;
  has_po: boolean;
  form_code?: FormCode;
  created_at: string;
  updated_at?: string;
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
  items?: InquiryItem[];
  deadline?: string;
  expedition?: string;
}

export interface InquiryItem {
  id: string;
  item_id: number;
  vendor_item_name: string;
  link_url?: string;
  qty: number;
  unit: string;
  price_unit: number;
  price_total: number;
  warranty?: string;
  documents?: string;
  photo_url?: string;
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
  is_urgent: boolean;
  has_form_items: boolean;
  has_offer_doc: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PurchaseRecap {
  id: number;
  purchase_id?: number;
  job_detail: string;
  qty: number;
  unit: string;
  price_total: number;
  is_urgent: boolean;
  has_po: boolean;
  form_code?: FormCode;
  vendor_id: number;
  created_at: string;
}

export interface AccountsReceivable {
  id: number;
  request_date: string;
  offer_letter_number: string;
  delivery_date: string;
  do_number: string;
  delivery_proof_url?: string;
  pending_days: number;
  user_name: string;
  po_number: string;
  item_name: string;
  qty: number;
  unit: string;
  price_unit: number;
  price_total: number;
  vendor_id: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}
