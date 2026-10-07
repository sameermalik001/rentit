export type UserRole = 'user' | 'admin';
export type ListingStatus = 'active' | 'unavailable' | 'pending' | 'rented';
export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
export type RentalStatus = 'active' | 'completed' | 'disputed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ReviewType = 'product' | 'owner' | 'renter';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  city: string;
  locality: string;
  bio?: string;
  avatar_url?: string;
  role: UserRole;
  rating: number;
  total_ratings: number;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  item_count?: number;
}

export interface Listing {
  id: string;
  owner_id: string;
  category_id: string;
  title: string;
  description: string;
  price_per_day: number;
  security_deposit: number;
  city: string;
  locality: string;
  condition: ItemCondition;
  rental_rules?: string;
  status: ListingStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
  images: string[];
  category?: Category;
  owner?: Profile;
}

export interface RentalRequest {
  id: string;
  listing_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_price: number;
  rental_amount: number;
  platform_fee: number;
  security_deposit: number;
  total_amount: number;
  status: RequestStatus;
  message?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
  listing?: Listing;
  renter?: Profile;
  owner?: Profile;
}

export interface Rental {
  id: string;
  request_id: string;
  listing_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: RentalStatus;
  handover_notes?: string;
  return_notes?: string;
  created_at: string;
  updated_at?: string;
  listing?: Listing;
  renter?: Profile;
  owner?: Profile;
}

export interface Payment {
  id: string;
  rental_id?: string;
  request_id?: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  platform_fee: number;
  owner_amount: number;
  status: PaymentStatus;
  payment_method: string;
  transaction_reference?: string;
  notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  rental_id: string;
  reviewer_id: string;
  reviewee_id: string;
  listing_id?: string;
  rating: number;
  comment: string;
  review_type: ReviewType;
  created_at: string;
  reviewer?: Profile;
}

export interface Conversation {
  id: string;
  listing_id?: string;
  participant1_id: string;
  participant2_id: string;
  last_message_text?: string;
  last_message_at: string;
  created_at: string;
  listing?: Listing;
  other_user?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'rental_request' | 'request_accepted' | 'request_rejected' | 'rental_active' | 'rental_completed' | 'new_message' | 'new_review' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_listing_id?: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  admin_notes?: string;
  created_at: string;
  reporter?: Profile;
  reported_listing?: Listing;
  reported_user?: Profile;
}

export interface AdminSettings {
  platform_commission_percent: number;
  min_rental_days: number;
  max_rental_days: number;
  instant_booking_enabled: boolean;
  platform_currency: string;
  contact_support_email: string;
}
