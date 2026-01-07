-- Sample Data for Testing
-- Run this after schema.sql to populate with test data

-- Insert Sample Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Clothing', 'clothing', 'Fashionable clothing for all occasions', 1),
('Accessories', 'accessories', 'Stylish accessories to complete your look', 2),
('Shoes', 'shoes', 'Comfortable and trendy footwear', 3),
('Bags', 'bags', 'Designer bags and handbags', 4),
('Jewelry', 'jewelry', 'Elegant jewelry pieces', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Products
INSERT INTO products (name, slug, description, price, sale_price, category, stock, images, sizes, colors, featured, is_new, is_flash_deal, rating, reviews_count) VALUES
('Classic White T-Shirt', 'classic-white-tshirt', 'Premium cotton t-shirt, perfect for everyday wear', 29.99, NULL, 'clothing', 50, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name": "White", "hex": "#FFFFFF"}]', true, true, false, 4.5, 12),
('Designer Leather Jacket', 'designer-leather-jacket', 'Genuine leather jacket with modern design', 299.99, 249.99, 'clothing', 15, ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'], ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Brown", "hex": "#8B4513"}]', true, false, true, 4.8, 25),
('Sneaker Pro Running Shoes', 'sneaker-pro-running', 'High-performance running shoes with cushioned sole', 129.99, NULL, 'shoes', 30, ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'], ARRAY['7', '8', '9', '10', '11'], '[{"name": "White", "hex": "#FFFFFF"}, {"name": "Black", "hex": "#000000"}]', false, true, false, 4.6, 18),
('Luxury Handbag', 'luxury-handbag', 'Premium designer handbag with gold hardware', 599.99, 499.99, 'bags', 8, ARRAY['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800'], ARRAY[]::TEXT[], '[{"name": "Black", "hex": "#000000"}, {"name": "Beige", "hex": "#F5F5DC"}]', true, false, false, 4.9, 32),
('Silver Necklace', 'silver-necklace', 'Elegant silver necklace with pendant', 89.99, NULL, 'jewelry', 25, ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'], ARRAY[]::TEXT[], '[{"name": "Silver", "hex": "#C0C0C0"}]', false, true, false, 4.7, 15),
('Sunglasses Classic', 'sunglasses-classic', 'Vintage-style sunglasses with UV protection', 79.99, 59.99, 'accessories', 40, ARRAY['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'], ARRAY[]::TEXT[], '[{"name": "Black", "hex": "#000000"}, {"name": "Brown", "hex": "#8B4513"}]', false, false, true, 4.4, 8),
('Denim Jeans', 'denim-jeans', 'Classic fit denim jeans, comfortable and durable', 89.99, NULL, 'clothing', 35, ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], ARRAY['28', '30', '32', '34', '36'], '[{"name": "Blue", "hex": "#0000FF"}, {"name": "Black", "hex": "#000000"}]', false, false, false, 4.3, 22),
('Leather Wallet', 'leather-wallet', 'Genuine leather wallet with card slots', 49.99, NULL, 'accessories', 60, ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800'], ARRAY[]::TEXT[], '[{"name": "Brown", "hex": "#8B4513"}, {"name": "Black", "hex": "#000000"}]', false, true, false, 4.5, 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Banners
INSERT INTO banners (title, subtitle, image, link, cta_text, position, is_active, display_order) VALUES
('Summer Sale', 'Up to 50% Off', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200', '/shop?filter=sale', 'Shop Now', 'hero', true, 1),
('New Collection', 'Discover Latest Trends', 'https://images.unsplash.com/photo-1445205170230-053b73816037?w=1200', '/shop?filter=new', 'Explore', 'hero', true, 2),
('Free Shipping', 'On Orders Over $50', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200', '/shop', 'Learn More', 'promo', true, 1)
ON CONFLICT DO NOTHING;

-- Insert Sample Coupons
INSERT INTO coupons (code, type, value, min_order, max_uses, expires_at, is_active) VALUES
('WELCOME10', 'percentage', 10, NULL, 100, NULL, true),
('SAVE20', 'percentage', 20, 100, 50, (NOW() + INTERVAL '30 days'), true),
('FREESHIP', 'fixed', 9.99, 50, NULL, NULL, true),
('FLASH50', 'percentage', 50, 200, 10, (NOW() + INTERVAL '7 days'), true)
ON CONFLICT (code) DO NOTHING;

-- Insert Sample Reviews
INSERT INTO reviews (product_id, user_name, user_email, rating, comment) 
SELECT 
  p.id,
  'John Doe',
  'john@example.com',
  5,
  'Excellent quality! Highly recommend.'
FROM products p 
WHERE p.slug = 'classic-white-tshirt'
LIMIT 1;

INSERT INTO reviews (product_id, user_name, user_email, rating, comment) 
SELECT 
  p.id,
  'Jane Smith',
  'jane@example.com',
  4,
  'Great product, fast shipping!'
FROM products p 
WHERE p.slug = 'designer-leather-jacket'
LIMIT 1;

