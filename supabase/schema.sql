-- ==============================================================================
-- Zirium AI Customer Intelligence Service: Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Outlets Table
CREATE TABLE IF NOT EXISTS public.outlets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  time_zone TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Guests Table
CREATE TABLE IF NOT EXISTS public.guests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  primary_phone TEXT NOT NULL,
  email TEXT,
  preferred_outlet_id TEXT REFERENCES public.outlets(id) ON DELETE SET NULL,
  first_visit_date TIMESTAMPTZ NOT NULL,
  last_visit_date TIMESTAMPTZ NOT NULL,
  total_orders INTEGER DEFAULT 1 NOT NULL,
  total_spend NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  average_order_value NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  usual_gap_days INTEGER DEFAULT 14 NOT NULL,
  days_since_last_order INTEGER DEFAULT 0 NOT NULL,
  predicted_next_visit_date TIMESTAMPTZ,
  segment TEXT NOT NULL,
  discovered_type TEXT NOT NULL,
  favourite_dish TEXT NOT NULL,
  favourite_dishes_top5 JSONB DEFAULT '[]'::jsonb,
  consent JSONB DEFAULT '{"sms": "unspecified", "whatsapp": "unspecified", "email": "unspecified"}'::jsonb NOT NULL,
  merged_from JSONB DEFAULT '[]'::jsonb NOT NULL,
  flagged_reason TEXT,
  last_contacted_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  guest_id TEXT REFERENCES public.guests(id) ON DELETE SET NULL,
  outlet_id TEXT REFERENCES public.outlets(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL, -- 'counter' | 'online' | 'phone'
  order_type TEXT NOT NULL, -- 'dine-in' | 'pickup' | 'delivery'
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  day_of_week INTEGER,
  hour INTEGER
);

-- 5. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'sending' | 'sent' | 'rejected'
  goal TEXT,
  target_description TEXT,
  estimated_cost_per_message NUMERIC(10, 4) DEFAULT 0.0125,
  approved_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  held_back_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Row-Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and write for the client demo
CREATE POLICY "Allow public read outlets" ON public.outlets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update outlets" ON public.outlets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read menu_items" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update menu_items" ON public.menu_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read guests" ON public.guests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update guests" ON public.guests FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update orders" ON public.orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read campaigns" ON public.campaigns FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert/update campaigns" ON public.campaigns FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- Realtime Replication
-- Enable live change broadcasts for orders and guests
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'guests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;
  END IF;
END $$;
