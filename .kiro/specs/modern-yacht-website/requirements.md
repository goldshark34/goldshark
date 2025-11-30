# Requirements Document

## Introduction

Bu doküman, mevcut yat satış sitesinin modern, göz alıcı ve tamamen işlevsel bir web uygulamasına dönüştürülmesi için gereksinimleri tanımlar. Site, kullanıcı deneyimini ön planda tutarak, tüm butonların çalışır olması, modern animasyonlar, responsive tasarım ve Supabase backend entegrasyonu ile geliştirilecektir.

## Glossary

- **System**: Luxury Yachts web uygulaması
- **User**: Siteyi ziyaret eden potansiyel müşteri
- **Admin**: Ürün ve içerik yönetimi yapan yönetici
- **Product**: Satılık veya kiralık yat ürünü
- **Hero Section**: Ana sayfa üst bölümü
- **CTA**: Call-to-Action (Harekete geçirici buton)
- **Supabase**: Backend veritabanı ve authentication servisi
- **Responsive**: Tüm cihazlarda uyumlu tasarım

## Requirements

### Requirement 1

**User Story:** Bir kullanıcı olarak, siteye girdiğimde modern ve etkileyici bir ana sayfa görmek istiyorum, böylece markanın lüks imajını hissedebilirim.

#### Acceptance Criteria

1. WHEN User loads the homepage, THE System SHALL display a full-width hero section with high-quality yacht imagery
2. WHEN User views the hero section, THE System SHALL display animated text elements with smooth fade-in transitions
3. THE System SHALL display a gradient background overlay on hero images with opacity between 0.3 and 0.5
4. WHEN User scrolls down, THE System SHALL trigger parallax scrolling effects on background images
5. THE System SHALL display call-to-action buttons with hover animations that scale to 1.05 times original size within 0.3 seconds

### Requirement 2

**User Story:** Bir kullanıcı olarak, tüm butonların çalışmasını istiyorum, böylece sitede sorunsuz gezinebilirim.

#### Acceptance Criteria

1. WHEN User clicks on "Yatları Keşfet" button, THE System SHALL navigate to the products page within 0.5 seconds
2. WHEN User clicks on navigation menu items, THE System SHALL scroll to the corresponding section with smooth animation
3. WHEN User clicks on "İletişim" button, THE System SHALL display a contact form modal or navigate to contact section
4. WHEN User clicks on product card, THE System SHALL navigate to product detail page with product ID
5. WHEN User clicks on "Admin Girişi" button, THE System SHALL navigate to admin login page

### Requirement 3

**User Story:** Bir kullanıcı olarak, ürünleri filtreleyip arayabilmek istiyorum, böylece ihtiyacıma uygun yatı kolayca bulabilirim.

#### Acceptance Criteria

1. THE System SHALL display a search input field on the products page
2. WHEN User types in search field, THE System SHALL filter products by name with maximum 0.5 seconds delay
3. THE System SHALL display category filter buttons for "Satılık", "Kiralık", and "Tümü"
4. WHEN User clicks on category filter, THE System SHALL display only products matching selected category within 0.3 seconds
5. THE System SHALL display price range slider with minimum 0 and maximum 10000000 Euro values

### Requirement 4

**User Story:** Bir kullanıcı olarak, ürün detaylarını görmek istiyorum, böylece yat hakkında kapsamlı bilgi edinebilirim.

#### Acceptance Criteria

1. WHEN User clicks on a product, THE System SHALL navigate to product detail page with product slug
2. THE System SHALL display product image gallery with thumbnail navigation
3. WHEN User clicks on thumbnail, THE System SHALL display corresponding full-size image within 0.2 seconds
4. THE System SHALL display product specifications in a structured table format
5. THE System SHALL display a contact form for inquiry with fields for name, email, phone, and message

### Requirement 5

**User Story:** Bir kullanıcı olarak, mobil cihazımdan siteyi rahatça kullanabilmek istiyorum, böylece her yerden yat arayabileyim.

#### Acceptance Criteria

1. WHEN viewport width is less than 768 pixels, THE System SHALL display mobile-optimized navigation menu
2. THE System SHALL display hamburger menu icon on mobile devices
3. WHEN User clicks hamburger menu, THE System SHALL display slide-in navigation menu with 0.3 seconds animation
4. THE System SHALL stack product cards vertically on screens smaller than 768 pixels
5. THE System SHALL adjust font sizes to be at least 14 pixels on mobile devices

### Requirement 6

**User Story:** Bir kullanıcı olarak, iletişim formunu doldurup gönderebilmek istiyorum, böylece yat hakkında bilgi alabilirim.

#### Acceptance Criteria

1. THE System SHALL display contact form with fields for name, email, phone, and message
2. WHEN User submits form with empty required fields, THE System SHALL display validation error messages
3. WHEN User enters invalid email format, THE System SHALL display email format error message
4. WHEN User submits valid form, THE System SHALL send form data to Supabase database within 2 seconds
5. WHEN form submission succeeds, THE System SHALL display success message and clear form fields

### Requirement 7

**User Story:** Bir admin olarak, Supabase ile güvenli giriş yapabilmek istiyorum, böylece ürünleri yönetebilirim.

#### Acceptance Criteria

1. THE System SHALL display admin login form with email and password fields
2. WHEN Admin submits login form, THE System SHALL authenticate with Supabase Auth within 3 seconds
3. WHEN authentication succeeds, THE System SHALL store session token in localStorage
4. WHEN authentication fails, THE System SHALL display error message "Geçersiz email veya şifre"
5. WHEN Admin is authenticated, THE System SHALL redirect to admin dashboard

### Requirement 8

**User Story:** Bir admin olarak, ürünleri ekleyip düzenleyebilmek istiyorum, böylece site içeriğini güncel tutabilirim.

#### Acceptance Criteria

1. WHEN Admin clicks "Yeni Ürün Ekle" button, THE System SHALL display product creation form
2. THE System SHALL allow Admin to upload multiple images with maximum 5MB file size per image
3. WHEN Admin uploads image, THE System SHALL upload to Supabase Storage and return URL within 5 seconds
4. WHEN Admin submits product form, THE System SHALL save product data to Supabase database
5. WHEN Admin clicks edit button on product, THE System SHALL populate form with existing product data

### Requirement 9

**User Story:** Bir kullanıcı olarak, sitede animasyonlar ve geçişler görmek istiyorum, böylece modern bir deneyim yaşayabilirim.

#### Acceptance Criteria

1. WHEN User hovers over buttons, THE System SHALL apply scale transform to 1.05 with 0.3 seconds transition
2. WHEN User scrolls to new section, THE System SHALL fade-in section content with 0.6 seconds duration
3. THE System SHALL apply smooth scroll behavior to all anchor link navigations
4. WHEN User hovers over product cards, THE System SHALL elevate card with box-shadow transition
5. THE System SHALL display loading spinner with rotation animation when fetching data

### Requirement 10

**User Story:** Bir kullanıcı olarak, site performansının hızlı olmasını istiyorum, böylece beklemeden içeriği görebilirim.

#### Acceptance Criteria

1. THE System SHALL load initial page content within 2 seconds on 3G connection
2. THE System SHALL lazy-load images that are not in viewport
3. WHEN User navigates between pages, THE System SHALL complete navigation within 0.5 seconds
4. THE System SHALL cache static assets with maximum 7 days expiration
5. THE System SHALL optimize images to WebP format with maximum 200KB file size
