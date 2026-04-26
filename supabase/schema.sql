-- MiniBazaar Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('bank_transfer', 'cash_on_delivery')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(500) NOT NULL,
  product_image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to auto-generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'MB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and active products
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);

-- Anyone can insert orders (for checkout)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Allow reading own orders by email (for order confirmation page)
CREATE POLICY "Anyone can read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can read order items" ON order_items FOR SELECT USING (true);

-- Seed data: Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Chocolates', 'chocolates', 'Premium chocolates from around the world', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80'),
  ('Perfumes & Fragrances', 'perfumes', 'Luxury branded perfumes and colognes', 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80'),
  ('Snacks & Nuts', 'snacks', 'Premium snacks, nuts and dried fruits', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80'),
  ('Beauty & Personal Care', 'beauty', 'Skincare, haircare and personal care products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80'),
  ('Beverages', 'beverages', 'Imported juices, teas and specialty drinks', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80')
ON CONFLICT (slug) DO NOTHING;

-- Seed data: Products
INSERT INTO products (name, slug, description, price, compare_price, images, category_id, stock, is_featured, tags) VALUES
  (
    'Ferrero Rocher 24 Pieces Gift Box',
    'ferrero-rocher-24-gift-box',
    'Iconic hazelnut chocolate in golden wrap. A premium gift box of 24 pieces perfect for any occasion. Each Ferrero Rocher is made with a whole hazelnut surrounded by smooth chocolate cream, encased in a crispy shell covered with chocolate and finely chopped hazelnuts.',
    2850.00,
    3200.00,
    ARRAY['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80','https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'chocolates'),
    50, true,
    ARRAY['gift', 'premium', 'hazelnut']
  ),
  (
    'Cadbury Dairy Milk Chocolate Bar 200g',
    'cadbury-dairy-milk-200g',
    'The classic Cadbury Dairy Milk chocolate bar loved by generations. Made with fresh milk and the finest cocoa, this smooth, creamy milk chocolate is perfect for sharing or enjoying on your own.',
    650.00,
    750.00,
    ARRAY['https://images.unsplash.com/photo-1559181567-c3190b10a1d5?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'chocolates'),
    120, true,
    ARRAY['classic', 'milk-chocolate', 'cadbury']
  ),
  (
    'Lindt Excellence Dark 85% Cocoa',
    'lindt-excellence-dark-85',
    'Lindt''s signature intense dark chocolate with 85% fine cocoa. Experience the rich, complex flavor of this premium Swiss dark chocolate with subtle roasted notes and a silky smooth finish.',
    1100.00,
    1300.00,
    ARRAY['https://images.unsplash.com/photo-1611070022-87990e12c919?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'chocolates'),
    80, true,
    ARRAY['dark-chocolate', 'swiss', 'premium']
  ),
  (
    'Raffaello Coconut Almond Treats 230g',
    'raffaello-coconut-almond-230g',
    'Delicate white chocolate coconut balls with a whole almond inside. These elegant treats by Ferrero feature a crispy wafer shell, smooth cream filling, and a coating of fine coconut flakes.',
    1950.00,
    2200.00,
    ARRAY['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'chocolates'),
    60, false,
    ARRAY['coconut', 'white-chocolate', 'gift']
  ),
  (
    'Kinder Bueno White Chocolate',
    'kinder-bueno-white',
    'Kinder Bueno White with creamy hazelnut filling inside a crispy wafer, coated in smooth white chocolate. An irresistible combination of flavors and textures.',
    380.00,
    450.00,
    ARRAY['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'chocolates'),
    200, false,
    ARRAY['kinder', 'white-chocolate', 'wafer']
  ),
  (
    'Dior Sauvage Eau de Parfum 100ml',
    'dior-sauvage-edp-100ml',
    'Dior Sauvage EDP - A radically fresh composition, the EDP Sauvage boasts a fresh top note. The heart is composed of Sichuan pepper and lavender, the base of vetiver, patchouli, and cedarwood. A bold, noble fragrance for the modern man.',
    38500.00,
    42000.00,
    ARRAY['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4a4bed?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'perfumes'),
    20, true,
    ARRAY['dior', 'mens', 'luxury', 'fresh']
  ),
  (
    'Chanel No. 5 Eau de Parfum 50ml',
    'chanel-no5-edp-50ml',
    'The legendary Chanel No. 5 - the world''s most iconic fragrance. A timeless floral aldehyde with notes of ylang-ylang, rose, jasmine, sandalwood, and vanilla. A bottle of pure elegance.',
    52000.00,
    58000.00,
    ARRAY['https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'perfumes'),
    15, true,
    ARRAY['chanel', 'womens', 'luxury', 'classic', 'floral']
  ),
  (
    'Versace Eros Eau de Toilette 100ml',
    'versace-eros-edt-100ml',
    'Versace Eros - A powerful, seductive fragrance for men. Fresh and sensual, it opens with mint, green apple and lemon, with a heart of tonka bean and geranium, and a base of vanilla, vetiver, and oakmoss.',
    28500.00,
    32000.00,
    ARRAY['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'perfumes'),
    25, false,
    ARRAY['versace', 'mens', 'fresh', 'seductive']
  ),
  (
    'Viktor & Rolf Flowerbomb EDP 50ml',
    'viktor-rolf-flowerbomb-50ml',
    'An explosive floral fragrance that transforms everything around it into something beautiful. This feminine floral oriental opens with a jasmine and rose heart and settles into a warm, sweet base.',
    42000.00,
    47500.00,
    ARRAY['https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'perfumes'),
    18, true,
    ARRAY['womens', 'floral', 'luxury', 'romantic']
  ),
  (
    'Mixed Premium Nuts 500g',
    'mixed-premium-nuts-500g',
    'A premium selection of roasted and salted mixed nuts including cashews, almonds, pistachios, macadamia, and pecans. Sourced from the finest farms and lightly roasted for maximum flavor.',
    2200.00,
    2600.00,
    ARRAY['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'snacks'),
    75, true,
    ARRAY['nuts', 'healthy', 'protein', 'snack']
  ),
  (
    'Belgian Waffle Cookies Gift Box',
    'belgian-waffle-cookies-gift',
    'Authentic Belgian butter waffle cookies (Speculoos) in a beautiful gift box. These crispy, caramelized biscuits with warm spice flavors are perfect with coffee or tea.',
    1650.00,
    1950.00,
    ARRAY['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'snacks'),
    90, false,
    ARRAY['belgian', 'cookies', 'gift', 'biscuits']
  ),
  (
    'Pringles Original 165g',
    'pringles-original-165g',
    'The original Pringles - once you pop you can''t stop! Perfectly seasoned stackable potato crisps in the iconic cylinder can.',
    750.00,
    null,
    ARRAY['https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'snacks'),
    150, false,
    ARRAY['pringles', 'chips', 'crisps', 'snack']
  ),
  (
    'L''Oréal Paris Revitalift Moisturizer',
    'loreal-revitalift-moisturizer',
    'L''Oréal Paris Revitalift Anti-Wrinkle + Firming Day Moisturizer SPF 18. Clinically proven to reduce wrinkles, firm skin, and hydrate for 48 hours. With Pro-Retinol A and Fibrelastyl.',
    4200.00,
    5000.00,
    ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'beauty'),
    45, false,
    ARRAY['loreal', 'skincare', 'moisturizer', 'anti-aging']
  ),
  (
    'Godiva Gold Collection 16 pieces',
    'godiva-gold-collection-16',
    'GODIVA Gold Collection - an assortment of 16 premium Belgian chocolates in a luxurious gold gift box. Features dark, milk, and white chocolate ganaches, pralines, and caramels.',
    5800.00,
    6500.00,
    ARRAY['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'chocolates'),
    30, true,
    ARRAY['godiva', 'belgian', 'premium', 'gift', 'luxury']
  ),
  (
    'CRistiano Ronaldo CR7 EDT 100ml',
    'cr7-cristiano-ronaldo-edt-100ml',
    'CR7 by Cristiano Ronaldo - a fresh and vibrant fragrance for men. Opens with citrus bergamot and grapefruit, develops into an elegant heart of geranium and jasmine, and settles on warm amber and musk.',
    9800.00,
    12000.00,
    ARRAY['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&q=80'],
    (SELECT id FROM categories WHERE slug = 'perfumes'),
    35, true,
    ARRAY['cr7', 'mens', 'sport', 'fresh']
  )
ON CONFLICT (slug) DO NOTHING;
