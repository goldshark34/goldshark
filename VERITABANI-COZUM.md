# Veritabanı Sorunları ve Çözümler

## 🔴 Sorun: Eklenen Ürünler Websitede Görünmüyor

### Olası Nedenler:

1. **Supabase RLS (Row Level Security) Politikaları**
   - Supabase'de RLS aktifse ve doğru politikalar yoksa veriler görünmez

2. **Tablo/Kolon İsimleri Uyumsuzluğu**
   - PostgreSQL küçük harf kullanır
   - Kodda büyük/küçük harf karışıklığı olabilir

3. **Specifications Formatı**
   - JSON formatı hatalı olabilir
   - Gerekli alanlar eksik olabilir

## ✅ Çözüm Adımları

### 1. Supabase Dashboard'da Kontrol

1. **Supabase Dashboard** → **Table Editor** → **products** tablosuna gidin
2. Eklediğiniz ürünleri görebiliyor musunuz?
3. `isactive` kolonu `true` mu?

### 2. RLS Politikalarını Kontrol

1. **Supabase Dashboard** → **Authentication** → **Policies**
2. `products` tablosu için şu politikalar olmalı:
   ```sql
   -- Herkes aktif ürünleri görebilir
   CREATE POLICY "Public can view active products" ON products
       FOR SELECT USING (isactive = true);
   
   -- Authenticated kullanıcılar (admin) her şeyi yapabilir
   CREATE POLICY "Authenticated users can manage products" ON products
       FOR ALL USING (auth.role() = 'authenticated');
   ```

### 3. SQL Editor'de Test

Supabase SQL Editor'de şu sorguyu çalıştırın:

```sql
-- Tüm ürünleri göster
SELECT * FROM products WHERE isactive = true;

-- Ürün sayısını kontrol et
SELECT COUNT(*) FROM products;

-- Kategorilerle birlikte göster
SELECT 
    p.*,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.categoryid = c.categoryid
WHERE p.isactive = true;
```

### 4. Specifications Formatı

Ürün eklerken `specifications` alanına şu formatta JSON girin:

```json
{
  "type": "Sale",
  "length": "35m",
  "year": "2023",
  "cabins": "6",
  "capacity": "14",
  "speed": "28"
}
```

**Önemli:** 
- `type`: "Sale" veya "Rent" olmalı
- Diğer alanlar string olarak girilmeli

### 5. Browser Console'da Kontrol

1. Websitede **F12** tuşuna basın
2. **Console** sekmesine gidin
3. Şu mesajları arayın:
   - `📥 Supabase'den gelen veri:` - Veri geliyorsa burada görünür
   - `✅ Formatlanmış veri:` - Formatlanmış veri burada
   - `⚠️ Supabase hatası:` - Hata varsa burada görünür

### 6. Network Sekmesinde Kontrol

1. **F12** → **Network** sekmesi
2. Sayfayı yenileyin
3. `products` isteğini bulun
4. **Response** sekmesinde veri var mı kontrol edin

## 🔧 Manuel Düzeltme

Eğer sorun devam ediyorsa, Supabase SQL Editor'de şunu çalıştırın:

```sql
-- RLS'yi geçici olarak kapat (test için)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE productimages DISABLE ROW LEVEL SECURITY;

-- Veya doğru politikaları ekle
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (isactive = true);

DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
CREATE POLICY "Authenticated users can manage products" ON products
    FOR ALL USING (auth.role() = 'authenticated');
```

## 📝 Test Ürünü Ekleme

SQL Editor'de test ürünü ekleyin:

```sql
INSERT INTO products (
    categoryid, 
    name, 
    slug, 
    shortdescription, 
    description, 
    specifications, 
    price, 
    stock, 
    isactive
)
VALUES (
    1,
    'Test Yat',
    'test-yat',
    'Test için eklenen yat',
    'Bu bir test ürünüdür',
    '{"type": "Sale", "length": "25m", "year": "2024", "cabins": "4", "capacity": "10", "speed": "30"}',
    5000000,
    1,
    true
);

-- Görsel ekle
INSERT INTO productimages (productid, imageurl, ismain)
VALUES (
    (SELECT productid FROM products WHERE slug = 'test-yat'),
    'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800',
    true
);
```

## 🎯 Hızlı Kontrol Listesi

- [ ] Supabase'de ürün var mı?
- [ ] `isactive` = `true` mu?
- [ ] RLS politikaları doğru mu?
- [ ] Browser console'da hata var mı?
- [ ] Network sekmesinde veri geliyor mu?
- [ ] Specifications JSON formatı doğru mu?
- [ ] Kategori ID geçerli mi?

## 💡 İpuçları

1. **LocalStorage Temizle**: Browser'da `localStorage.clear()` çalıştırın
2. **Cache Temizle**: Ctrl+Shift+R ile hard refresh yapın
3. **Incognito Mode**: Gizli pencerede test edin
4. **Farklı Browser**: Chrome/Firefox/Edge'de deneyin

## 📞 Hala Çalışmıyor mu?

Console'daki hata mesajlarını ve Network sekmesindeki response'u paylaşın.
