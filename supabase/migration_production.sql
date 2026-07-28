-- MiniBazaar Production Migration
-- Run this in Supabase SQL Editor AFTER schema.sql
-- Safe to run multiple times (idempotent where possible).

-- 1. Add 'refunded' to payment_status ("payment return")
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- 1b. Hot Deals flag (shown in the homepage Flash Deals area)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_hot_deal BOOLEAN DEFAULT false;

-- 1c. Site settings (e.g. Hot Deals section on/off). Public read, server-only write.
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
INSERT INTO site_settings (key, value) VALUES ('hot_deals_enabled', 'true')
  ON CONFLICT (key) DO NOTHING;

-- 2. Lock down writes: the public (anon key) must NOT be able to write products
--    or update orders. All admin writes go through the server using the
--    service_role key, which bypasses RLS entirely.

-- Drop any permissive write policies if they exist
DROP POLICY IF EXISTS "Public can write products" ON products;
DROP POLICY IF EXISTS "Public can update products" ON products;
DROP POLICY IF EXISTS "Public can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;

-- Tighten order read: anon should only read via server too, but the
-- order-confirmation page currently reads with the anon key by id, so we keep
-- a SELECT policy. (Consider moving this server-side later.)
-- Categories & products keep their existing public SELECT policies from schema.sql.

-- 3. Storage bucket for product images (public read, server-only write).
--    Bucket creation via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read images
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- No public INSERT/UPDATE/DELETE policy => only service_role (server) can write.
