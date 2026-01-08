-- ChicCart Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  category VARCHAR(255),
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_flash_deal BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255),
  subtitle VARCHAR(255),
  image TEXT NOT NULL,
  link TEXT,
  cta_text VARCHAR(100),
  position VARCHAR(50) DEFAULT 'hero',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  tracking_number VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10, 2) NOT NULL,
  min_order DECIMAL(10, 2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  name VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_flash_deal ON products(is_flash_deal);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Public Read Access
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view active banners" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view reviews" ON reviews FOR SELECT USING (true);

-- RLS Policies for Orders (Users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT 
  USING (auth.uid()::text = customer_email OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create orders" ON orders FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for Reviews (Anyone can create, users can update their own)
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE 
  USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for Admin Access (Full access for admin role)
CREATE POLICY "Admins have full access to categories" ON categories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to products" ON products 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to banners" ON banners 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to orders" ON orders 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to coupons" ON coupons 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Helper function to check admin role (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fix infinite recursion: Use function to check admin status
CREATE POLICY "Admins have full access to user_profiles" ON user_profiles 
  FOR ALL USING (
    is_admin(auth.uid())
    OR
    id = auth.uid()
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ADMIN PANEL TABLES
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

-- Add foreign key for blog_posts category_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_category_id_fkey'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_category_id_fkey 
      FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for admin tables
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

-- Enable RLS on admin tables
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for published content
CREATE POLICY "Public can view published blog posts" ON blog_posts 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view blog categories" ON blog_categories 
  FOR SELECT USING (true);

CREATE POLICY "Public can view published pages" ON pages 
  FOR SELECT USING (is_published = true);

-- RLS Policies: Admin full access to all admin tables
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

-- Triggers for updated_at on admin tables
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_providers_updated_at
  BEFORE UPDATE ON payment_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_zones_updated_at
  BEFORE UPDATE ON shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_rates_updated_at
  BEFORE UPDATE ON shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_rules_updated_at
  BEFORE UPDATE ON tax_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

