-- Migration script to add admin panel tables and features
-- This script is safe to run multiple times
-- Run this AFTER your existing schema is set up

-- ============================================
-- STEP 1: Add missing column to user_profiles
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- ============================================
-- STEP 2: Create missing admin tables
-- ============================================

-- Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name VARCHAR(255) NOT NULL DEFAULT 'LUXE',
  store_email VARCHAR(255) NOT NULL DEFAULT 'support@luxe.com',
  store_phone VARCHAR(50),
  store_address TEXT,
  store_city VARCHAR(100),
  store_state VARCHAR(100),
  store_zip VARCHAR(20),
  store_country VARCHAR(100) DEFAULT 'United States',
  currency VARCHAR(10) DEFAULT 'USD',
  currency_symbol VARCHAR(10) DEFAULT '$',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  free_shipping_threshold DECIMAL(10, 2) DEFAULT 50,
  default_shipping_rate DECIMAL(10, 2) DEFAULT 9.99,
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  social_youtube TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Providers Table
CREATE TABLE IF NOT EXISTS payment_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('stripe', 'paypal', 'cash_on_delivery', 'bank_transfer', 'other')),
  is_enabled BOOLEAN DEFAULT FALSE,
  is_test_mode BOOLEAN DEFAULT TRUE,
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  public_key TEXT,
  merchant_id VARCHAR(255),
  additional_config JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name VARCHAR(255),
  category_id UUID,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages Table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  countries TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Rates Table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  carrier VARCHAR(100),
  method VARCHAR(50) NOT NULL CHECK (method IN ('flat', 'weight', 'price', 'free')),
  rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_order_value DECIMAL(10, 2) DEFAULT 0,
  max_order_value DECIMAL(10, 2) DEFAULT 0,
  min_weight DECIMAL(10, 2),
  max_weight DECIMAL(10, 2),
  estimated_days INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Rules Table
CREATE TABLE IF NOT EXISTS tax_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  applies_to VARCHAR(20) NOT NULL CHECK (applies_to IN ('all', 'products', 'shipping', 'both')),
  countries TEXT[] DEFAULT '{}',
  states TEXT[] DEFAULT '{}',
  product_categories UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for blog_posts category_id (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_category_id_fkey'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_category_id_fkey 
      FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- STEP 3: Create indexes (if not exist)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_store_settings_id ON store_settings(id);
CREATE INDEX IF NOT EXISTS idx_payment_providers_type ON payment_providers(type);
CREATE INDEX IF NOT EXISTS idx_payment_providers_is_enabled ON payment_providers(is_enabled);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_shipping_zones_is_active ON shipping_zones(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone_id ON shipping_rates(zone_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_is_active ON shipping_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_tax_rules_is_active ON tax_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_tax_rules_priority ON tax_rules(priority DESC);

-- ============================================
-- STEP 4: Enable RLS on new tables
-- ============================================
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rules ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Create or replace helper function
-- ============================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- STEP 6: Drop and recreate RLS policies for new tables
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Public can view published pages" ON pages;
DROP POLICY IF EXISTS "Admins have full access to store_settings" ON store_settings;
DROP POLICY IF EXISTS "Admins have full access to payment_providers" ON payment_providers;
DROP POLICY IF EXISTS "Admins have full access to blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins have full access to blog_categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins have full access to pages" ON pages;
DROP POLICY IF EXISTS "Admins have full access to shipping_zones" ON shipping_zones;
DROP POLICY IF EXISTS "Admins have full access to shipping_rates" ON shipping_rates;
DROP POLICY IF EXISTS "Admins have full access to tax_rules" ON tax_rules;

-- Create RLS Policies: Public read access for published content
CREATE POLICY "Public can view published blog posts" ON blog_posts 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view blog categories" ON blog_categories 
  FOR SELECT USING (true);

CREATE POLICY "Public can view published pages" ON pages 
  FOR SELECT USING (is_published = true);

-- Create RLS Policies: Admin full access to all admin tables
CREATE POLICY "Admins have full access to store_settings" ON store_settings 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to payment_providers" ON payment_providers 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to blog_posts" ON blog_posts 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to blog_categories" ON blog_categories 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to pages" ON pages 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to shipping_zones" ON shipping_zones 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to shipping_rates" ON shipping_rates 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to tax_rules" ON tax_rules 
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================
-- STEP 7: Create triggers for updated_at
-- ============================================

-- Create function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers (drop first if exists, then create)
DROP TRIGGER IF EXISTS update_store_settings_updated_at ON store_settings;
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_providers_updated_at ON payment_providers;
CREATE TRIGGER update_payment_providers_updated_at
  BEFORE UPDATE ON payment_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_zones_updated_at ON shipping_zones;
CREATE TRIGGER update_shipping_zones_updated_at
  BEFORE UPDATE ON shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_rates_updated_at ON shipping_rates;
CREATE TRIGGER update_shipping_rates_updated_at
  BEFORE UPDATE ON shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tax_rules_updated_at ON tax_rules;
CREATE TRIGGER update_tax_rules_updated_at
  BEFORE UPDATE ON tax_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Migration Complete!
-- ============================================
-- This script adds:
-- 1. avatar_url column to user_profiles
-- 2. 8 new admin tables (store_settings, payment_providers, blog_posts, blog_categories, pages, shipping_zones, shipping_rates, tax_rules)
-- 3. All necessary indexes, RLS policies, and triggers
-- 
-- Safe to run multiple times - uses IF NOT EXISTS and DROP IF EXISTS

