-- Luxury Yachts Database Setup
-- Supabase PostgreSQL

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    categoryid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    productid SERIAL PRIMARY KEY,
    categoryid INTEGER REFERENCES categories(categoryid),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    shortdescription TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    price DECIMAL(12, 2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    isactive BOOLEAN DEFAULT true,
    createddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateddate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS productimages (
    imageid SERIAL PRIMARY KEY,
    productid INTEGER REFERENCES products(productid) ON DELETE CASCADE,
    imageurl TEXT NOT NULL,
    ismain BOOLEAN DEFAULT false,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_categoryid ON products(categoryid);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_isactive ON products(isactive);
CREATE INDEX IF NOT EXISTS idx_productimages_productid ON productimages(productid);

-- Önce eski kategorileri temizle
DELETE FROM categories WHERE name NOT IN ('Rib Boat', 'Malzeme ve Ekipmanlar');

-- Sadece doğru kategorileri ekle
INSERT INTO categories (name, description) VALUES
('Rib Boat', 'Rijit şişme tekneler - RIB (Rigid Inflatable Boat)'),
('Malzeme ve Ekipmanlar', 'Tekne malzemeleri, ekipmanları ve aksesuarları')
ON CONFLICT DO NOTHING;

-- Sample Product (Optional)
INSERT INTO products (categoryid, name, slug, shortdescription, description, specifications, price, stock, isactive)
VALUES (
    3,
    'Azimut Grande 35M',
    'azimut-grande-35m',
    'Lüks ve konforun zirvesi',
    'Azimut Grande 35M, modern tasarım ve üstün performansın mükemmel birleşimi. İtalyan ustalığı ile üretilmiş bu mega yat, denizlerde eşsiz bir deneyim sunar.',
    '{"type": "Sale", "length": "35m", "year": "2023", "cabins": "6", "capacity": "14", "speed": "28"}',
    12500000,
    1,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE productimages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (isactive = true);

CREATE POLICY "Public can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view product images" ON productimages
    FOR SELECT USING (true);

-- RLS Policies for authenticated users (admin)
CREATE POLICY "Authenticated users can manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage images" ON productimages
    FOR ALL USING (auth.role() = 'authenticated');
