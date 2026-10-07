-- ====================================================================
-- RENTIT DATABASE SEED SCRIPT
-- Categories, Settings, Sample Listings, Reviews, and Demonstration Data
-- ====================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, icon, description, item_count)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Electronics', 'electronics', 'Tv', 'Audio equipment, smart gadgets, monitors and tech gear', 14),
  ('c1000000-0000-0000-0000-000000000002', 'Cameras', 'cameras', 'Camera', 'DSLRs, mirrorless cameras, lenses, tripods and lighting', 18),
  ('c1000000-0000-0000-0000-000000000003', 'Gaming', 'gaming', 'Gamepad2', 'PlayStation, Xbox, Nintendo, VR headsets and games', 12),
  ('c1000000-0000-0000-0000-000000000004', 'Furniture', 'furniture', 'Armchair', 'Study desks, ergonomic chairs, sofas and foldable tables', 9),
  ('c1000000-0000-0000-0000-000000000005', 'Sports', 'sports', 'Trophy', 'Bicycles, cricket kits, camping tents, trekking gear', 21),
  ('c1000000-0000-0000-0000-000000000006', 'Tools', 'tools', 'Wrench', 'Power drills, lawnmowers, pressure washers and toolsets', 15),
  ('c1000000-0000-0000-0000-000000000007', 'Vehicles', 'vehicles', 'Car', 'Scooters, electric cycles, cars, and utility carriers', 8),
  ('c1000000-0000-0000-0000-000000000008', 'Books', 'books', 'BookOpen', 'Academic textbooks, bestsellers, comics and exam guides', 25),
  ('c1000000-0000-0000-0000-000000000009', 'Events', 'events', 'PartyPopper', 'Stage lights, karaoke systems, gazebos and smoke machines', 11),
  ('c1000000-0000-0000-0000-000000000010', 'Other', 'other', 'Package', 'Miscellaneous unique items and utility rentals', 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description;

-- 2. Insert Default Admin Settings
INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('platform_commission_percent', '10', 'Platform fee percentage charged on every rental'),
  ('min_rental_days', '1', 'Minimum allowed rental booking duration in days'),
  ('max_rental_days', '30', 'Maximum allowed rental booking duration in days'),
  ('instant_booking_enabled', 'false', 'Require owner manual approval for rental requests'),
  ('platform_currency', 'INR', 'Currency code for display and transactions'),
  ('contact_support_email', 'support@rentit.marketplace', 'Platform support email')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;
