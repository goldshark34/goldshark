# Yat Satış Sitesi - Kurulum ve Kullanım

## 🚀 Yapılan Güncellemeler

### ✅ Düzeltilen Hatalar
1. **Product.jsx → Products.jsx**: Dosya adı düzeltildi
2. **ProductList.jsx**: Eksik admin bileşeni oluşturuldu
3. **AuthProvider**: App.jsx'e eklendi

### 🎨 Modern Tasarım Güncellemeleri

#### Ana Sayfa (Home)
- Otomatik geçişli hero slider
- Özellik kartları
- Veritabanından öne çıkan yatlar
- Modern animasyonlar ve hover efektleri

#### Ürünler Sayfası (Products)
- Veritabanı entegrasyonu
- Gelişmiş filtreleme (satılık/kiralık)
- Arama fonksiyonu
- Sıralama seçenekleri
- Loading ve error state'leri

#### Admin Paneli
- Modern gradient tasarım
- Canlı saat göstergesi
- İstatistik kartları
- Son aktiviteler paneli

#### Admin Login
- Modern gradient arka plan
- Şifre göster/gizle özelliği
- Supabase authentication entegrasyonu

## 🔐 Admin Girişi

### Supabase ile Giriş
1. Supabase Dashboard'a gidin
2. Authentication > Users bölümünden yeni kullanıcı oluşturun
3. Email ve şifre ile giriş yapın

### Test Kullanıcısı Oluşturma
```sql
-- Supabase SQL Editor'de çalıştırın
-- Kullanıcı otomatik olarak auth.users tablosuna eklenecek
```

## 📦 Veritabanı Yapısı

### Products Tablosu
- ProductID (Primary Key)
- ProductName
- Price
- ProductType (Sale/Rent)
- Length
- Year
- Cabins
- Capacity
- Speed
- IsActive
- CreatedDate

### Categories Tablosu
- CategoryID (Primary Key)
- CategoryName

### ProductImages Tablosu
- ImageID (Primary Key)
- ProductID (Foreign Key)
- ImageURL
- IsMainImage

## 🎯 Özellikler

### Kullanıcı Tarafı
- ✅ Modern ve responsive tasarım
- ✅ Yat listeleme ve filtreleme
- ✅ Arama fonksiyonu
- ✅ Veritabanı entegrasyonu
- ✅ Loading ve error handling

### Admin Tarafı
- ✅ Güvenli giriş sistemi (Supabase Auth)
- ✅ Yat ekleme/düzenleme/silme
- ✅ Kategori yönetimi
- ✅ Resim yükleme
- ✅ Modern dashboard

## 🚀 Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Tarayıcıda aç
http://localhost:3000
```

## 📝 Notlar

- Admin girişi için Supabase'de kullanıcı oluşturmanız gerekiyor
- Ürünler veritabanından çekiliyor, eğer veritabanı boşsa örnek veriler gösteriliyor
- Tüm sayfalar modern ve responsive tasarıma sahip
