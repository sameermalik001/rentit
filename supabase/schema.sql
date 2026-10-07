-- ====================================================================
-- RENTIT DATABASE SCHEMA
-- Hyperlocal Peer-to-Peer Rental Marketplace
-- Fully Compatible with Supabase PostgreSQL & Row Level Security (RLS)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. ENUMS & DOMAINS
-- ====================================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM ('active', 'unavailable', 'pending', 'rented');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE item_condition AS ENUM ('New', 'Like New', 'Good', 'Fair');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE rental_status AS ENUM ('active', 'completed', 'disputed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE review_type AS ENUM ('product', 'owner', 'renter');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 3. TABLES DEFINITIONS
-- ====================================================================

-- PROFILES (Linked to Supabase Auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  city TEXT DEFAULT 'Sonipat',
  locality TEXT DEFAULT 'Sector 14',
  bio TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  rating NUMERIC(3, 2) DEFAULT 5.00,
  total_ratings INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  item_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LISTINGS
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day > 0),
  security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (security_deposit >= 0),
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  condition item_condition NOT NULL DEFAULT 'Good',
  rental_rules TEXT,
  status listing_status NOT NULL DEFAULT 'active',
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LISTING IMAGES
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RENTAL REQUESTS
CREATE TABLE IF NOT EXISTS public.rental_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date >= start_date),
  total_days INT NOT NULL CHECK (total_days > 0),
  daily_price NUMERIC(10, 2) NOT NULL,
  rental_amount NUMERIC(10, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) NOT NULL,
  security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  message TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT no_self_rental CHECK (renter_id <> owner_id)
);

-- RENTALS (Created when request is accepted and activated)
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE REFERENCES public.rental_requests(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status rental_status NOT NULL DEFAULT 'active',
  handover_notes TEXT,
  return_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID REFERENCES public.rentals(id) ON DELETE SET NULL,
  request_id UUID REFERENCES public.rental_requests(id) ON DELETE SET NULL,
  payer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  payee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  platform_fee NUMERIC(10, 2) NOT NULL CHECK (platform_fee >= 0),
  owner_amount NUMERIC(10, 2) NOT NULL CHECK (owner_amount >= 0),
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'Development Gateway',
  transaction_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  review_type review_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_rental_reviewer_type UNIQUE (rental_id, reviewer_id, review_type)
);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  participant1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_participants UNIQUE (listing_id, participant1_id, participant2_id)
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ADMIN SETTINGS
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- 4. INDEXES FOR PERFORMANCE & FAST SEARCH
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_listing ON public.rental_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_renter ON public.rental_requests(renter_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_owner ON public.rental_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_dates ON public.rental_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- Full text search index on title & description
CREATE INDEX IF NOT EXISTS idx_listings_fts ON public.listings USING gin(to_tsvector('english', title || ' ' || description || ' ' || city || ' ' || locality));

-- ====================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Anyone can view profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories: Publicly viewable, admins can insert/update
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Listings: Anyone can view active listings, owners manage their own
CREATE POLICY "Active listings are viewable by everyone" ON public.listings
  FOR SELECT USING (status = 'active' OR auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Users can insert their own listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Users can delete their own listings" ON public.listings
  FOR DELETE USING (auth.uid() = owner_id OR public.is_admin());

-- Listing Images: Publicly viewable
CREATE POLICY "Listing images are viewable by everyone" ON public.listing_images
  FOR SELECT USING (true);
CREATE POLICY "Owners can manage images" ON public.listing_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE id = listing_images.listing_id AND (owner_id = auth.uid() OR public.is_admin())
    )
  );

-- Rental Requests: Viewable by renter, owner, or admin
CREATE POLICY "Rental requests viewable by participants" ON public.rental_requests
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Renters can create requests" ON public.rental_requests
  FOR INSERT WITH CHECK (auth.uid() = renter_id AND renter_id <> owner_id);
CREATE POLICY "Participants can update requests" ON public.rental_requests
  FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = owner_id OR public.is_admin());

-- Rentals: Viewable by renter, owner, or admin
CREATE POLICY "Rentals viewable by participants" ON public.rentals
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id OR public.is_admin());
CREATE POLICY "Owners/Admins can manage rentals" ON public.rentals
  FOR ALL USING (auth.uid() = owner_id OR public.is_admin());

-- Reviews: Viewable by everyone, created by rental participants
CREATE POLICY "Reviews viewable by everyone" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for completed rentals" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Conversations & Messages
CREATE POLICY "Conversations viewable by participants" ON public.conversations
  FOR SELECT USING (auth.uid() = participant1_id OR auth.uid() = participant2_id OR public.is_admin());
CREATE POLICY "Participants can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Messages viewable by conversation participants" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id AND (c.participant1_id = auth.uid() OR c.participant2_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Messages can be sent by conversation participants" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications
CREATE POLICY "Notifications viewable only by user" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications can be updated by user" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Notifications can be inserted by authenticated users" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reports
CREATE POLICY "Admins can view reports" ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id OR public.is_admin());
CREATE POLICY "Users can submit reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can update reports" ON public.reports
  FOR UPDATE USING (public.is_admin());

-- Admin Settings
CREATE POLICY "Settings viewable by authenticated users" ON public.admin_settings
  FOR SELECT USING (true);
CREATE POLICY "Only admins can update settings" ON public.admin_settings
  FOR ALL USING (public.is_admin());

-- ====================================================================
-- 6. DOUBLE BOOKING PREVENTION FUNCTION
-- ====================================================================
CREATE OR REPLACE FUNCTION public.check_booking_conflict(
  p_listing_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_exclude_request_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.rental_requests
    WHERE listing_id = p_listing_id
      AND status IN ('accepted', 'completed')
      AND (id <> p_exclude_request_id OR p_exclude_request_id IS NULL)
      AND (
        (start_date <= p_end_date AND end_date >= p_start_date)
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, city, locality, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'RentIt User'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'city', 'Sonipat'),
    COALESCE(new.raw_user_meta_data->>'locality', 'Sector 14'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
