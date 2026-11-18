-- ==============================================================================
-- Zirium AI: Enforce 100% Completely Read-Only POS Database
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This permanently locks down the database so NO user or client can insert,
-- update, or delete any POS records, menu items, guests, or orders.
-- ==============================================================================

-- 1. REVOKE all write privileges from public API roles
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.outlets FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.menu_items FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.guests FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.orders FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.campaigns FROM anon, authenticated;

-- 2. GRANT SELECT (Read-Only) exclusively
GRANT SELECT ON public.outlets TO anon, authenticated;
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT SELECT ON public.guests TO anon, authenticated;
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.campaigns TO anon, authenticated;

-- 3. DROP all existing write & modification policies
DROP POLICY IF EXISTS "Allow public insert/update outlets" ON public.outlets;
DROP POLICY IF EXISTS "Allow public read outlets" ON public.outlets;
DROP POLICY IF EXISTS "Read-Only Outlets" ON public.outlets;

DROP POLICY IF EXISTS "Allow public insert/update menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Allow public read menu_items" ON public.menu_items;
DROP POLICY IF EXISTS "Read-Only Menu Items" ON public.menu_items;

DROP POLICY IF EXISTS "Allow public insert/update guests" ON public.guests;
DROP POLICY IF EXISTS "Allow public read guests" ON public.guests;
DROP POLICY IF EXISTS "Allow Guest Consent & Visit Update" ON public.guests;
DROP POLICY IF EXISTS "Read-Only Guests" ON public.guests;

DROP POLICY IF EXISTS "Allow public insert/update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read orders" ON public.orders;
DROP POLICY IF EXISTS "Append-Only Live Orders" ON public.orders;
DROP POLICY IF EXISTS "Read-Only Order History" ON public.orders;

DROP POLICY IF EXISTS "Allow public insert/update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Allow public read campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Owner Campaign Approvals" ON public.campaigns;
DROP POLICY IF EXISTS "Owner Campaign Create" ON public.campaigns;
DROP POLICY IF EXISTS "Read Campaigns" ON public.campaigns;

-- 4. ENSURE Row Level Security (RLS) is active on all tables
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- 5. CREATE 100% READ-ONLY (SELECT-ONLY) POLICIES
-- Zero INSERT, Zero UPDATE, Zero DELETE. Completely immutable read-only POS replica.
CREATE POLICY "Strict Read-Only Outlets" 
  ON public.outlets 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Strict Read-Only Menu Items" 
  ON public.menu_items 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Strict Read-Only Guests" 
  ON public.guests 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Strict Read-Only Orders" 
  ON public.orders 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Strict Read-Only Campaigns" 
  ON public.campaigns 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Verification comment: All tables are now strictly 100% read-only.
