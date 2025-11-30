# 🦈 Gold Shark Yachting

Premium yat satış ve kiralama web sitesi - Modern, responsive ve tam özellikli.

## 🚀 Özellikler

- ✅ Modern ve responsive tasarım
- ✅ Supabase backend entegrasyonu
- ✅ Admin paneli (ürün yönetimi)
- ✅ Ürün filtreleme ve arama
- ✅ Otomatik hero slider
- ✅ Veritabanı entegrasyonu
- ✅ Authentication sistemi

## 🛠️ Teknolojiler

- **Frontend:** React 19 + Vite
- **UI Framework:** React Bootstrap 5
- **Backend:** Supabase (PostgreSQL)
- **Routing:** React Router v7
- **Styling:** Bootstrap 5 + Custom CSS
- **Slogan:** Premium Tekne Üretim ve Satış

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build
```

## 🔐 Admin Girişi

**URL:** `/admin/login`

**Test Kullanıcısı:**
- E-posta: `admin@goldsharkyachting.com`
- Şifre: `admin123`

## 📁 Proje Yapısı

```
├── src/
│   ├── components/        # React bileşenleri
│   │   ├── Admin/        # Admin panel bileşenleri
│   │   ├── Header.jsx    # Site başlığı
│   │   └── Footer.jsx    # Site alt bilgisi
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── Home.jsx      # Ana sayfa
│   │   ├── Products.jsx  # Ürünler sayfası
│   │   └── admin/        # Admin sayfaları
│   ├── services/         # API servisleri
│   ├── context/          # React Context
│   └── lib/              # Yardımcı kütüphaneler
├── database-setup.sql    # Veritabanı yapısı
└── .env                  # Ortam değişkenleri
```

## 🗄️ Veritabanı

Supabase kullanılıyor. Kurulum için:

1. `database-setup.sql` dosyasını Supabase SQL Editor'de çalıştırın
2. `.env` dosyasında Supabase bilgilerinizi güncelleyin

## 📝 Önemli Dosyalar

- `VERITABANI-COZUM.md` - Veritabanı sorunları için rehber
- `DEGISIKLIKLER.md` - Yapılan değişikliklerin özeti
- `SETUP.md` - Detaylı kurulum rehberi

## 🎨 Marka Bilgileri

- **Firma Adı:** Gold Shark Yachting
- **Logo:** 🦈 (Köpekbalığı)
- **Renk Paleti:** 
  - Lacivert: #0A1F3A, #1A3B5D
  - Altın: #D4AF37
  - Beyaz: #FFFFFF

## 📞 İletişim

- **E-posta:** info@goldsharkyachting.com
- **Telefon:** +90 (212) 123 45 67
- **Adres:** Marina Cad. No:45, Ataköy Marina, İstanbul

## 📄 Lisans

© 2024 Gold Shark Yachting. Tüm hakları saklıdır.
