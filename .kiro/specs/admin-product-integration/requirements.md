# Requirements Document

## Introduction

Bu özellik, admin paneline yüklenen ürünlerin otomatik olarak web sitesinin ilgili sayfalarına (anasayfa, ürünler sayfası, kategori sayfaları) yüklenmesini sağlar. Sistem, admin panelde seçilen kategori bilgisine göre ürünleri doğru sayfalara yönlendirir ve tüm sayfalarda tutarlı bir şekilde gösterir.

## Glossary

- **Admin Panel**: Ürün yönetimi için kullanılan yönetici arayüzü
- **Product System**: Ürün verilerini yöneten sistem bileşeni
- **Category System**: Kategori verilerini yöneten sistem bileşeni
- **Home Page**: Web sitesinin ana sayfası
- **Products Page**: Tüm ürünleri gösteren sayfa
- **Category Pages**: Kategori bazlı ürün sayfaları (Rib Boat, Equipment)
- **Real-time Sync**: Ürün verilerinin anlık senkronizasyonu

## Requirements

### Requirement 1

**User Story:** Admin olarak, admin panele yüklediğim ürünlerin otomatik olarak web sitesinin ilgili sayfalarında görünmesini istiyorum, böylece manuel güncelleme yapmam gerekmez.

#### Acceptance Criteria

1. WHEN admin panelde yeni bir ürün oluşturulur THEN Product System SHALL ürünü veritabanına kaydetmek
2. WHEN ürün kaydedilir THEN Product System SHALL ürünü kategori bilgisine göre ilgili sayfalarda göstermek
3. WHEN ürün güncellenir THEN Product System SHALL değişiklikleri tüm sayfalarda yansıtmak
4. WHEN ürün silinir veya pasif yapılır THEN Product System SHALL ürünü tüm sayfalardan kaldırmak
5. WHEN ürün durumu değişir THEN Product System SHALL değişiklikleri 3 dakika içinde tüm sayfalarda göstermek

### Requirement 2

**User Story:** Kullanıcı olarak, anasayfada en son eklenen ürünleri görmek istiyorum, böylece yeni ürünlerden haberdar olabilirim.

#### Acceptance Criteria

1. WHEN anasayfa yüklendiğinde THEN Home Page SHALL en son eklenen 3 ürünü öne çıkan ürünler bölümünde göstermek
2. WHEN yeni ürün eklendiğinde THEN Home Page SHALL öne çıkan ürünler listesini güncellemek
3. WHEN öne çıkan ürün gösterildiğinde THEN Home Page SHALL ürün adı, fiyat, görsel ve temel özellikleri göstermek
4. WHEN kullanıcı öne çıkan ürüne tıkladığında THEN Home Page SHALL ürün detay sayfasına yönlendirmek

### Requirement 3

**User Story:** Kullanıcı olarak, ürünler sayfasında tüm aktif ürünleri görmek istiyorum, böylece mevcut tüm seçenekleri inceleyebilirim.

#### Acceptance Criteria

1. WHEN ürünler sayfası yüklendiğinde THEN Products Page SHALL tüm aktif ürünleri göstermek
2. WHEN admin panelde ürün durumu değiştirildiğinde THEN Products Page SHALL sadece aktif ürünleri göstermek
3. WHEN ürün listesi gösterildiğinde THEN Products Page SHALL ürün adı, fiyat, kategori, görsel ve temel özellikleri göstermek
4. WHEN kullanıcı ürün filtrelediğinde THEN Products Page SHALL filtreleme kriterlerine uygun ürünleri göstermek

### Requirement 4

**User Story:** Kullanıcı olarak, Rib Boat sayfasında sadece Rib Boat kategorisindeki ürünleri görmek istiyorum, böylece ilgilendiğim kategoriyi kolayca inceleyebilirim.

#### Acceptance Criteria

1. WHEN Rib Boat sayfası yüklendiğinde THEN Category System SHALL sadece Rib Boat kategorisindeki aktif ürünleri göstermek
2. WHEN admin panelde Rib Boat kategorisine ürün eklendiğinde THEN Category System SHALL ürünü Rib Boat sayfasında göstermek
3. WHEN Rib Boat ürünü gösterildiğinde THEN Category System SHALL ürün adı, fiyat, Rib Boat özelliklerini (en, boy, ağırlık, kapasite, motor gücü) göstermek
4. WHEN Rib Boat kategorisinden ürün kaldırıldığında THEN Category System SHALL ürünü Rib Boat sayfasından kaldırmak

### Requirement 5

**User Story:** Kullanıcı olarak, Ekipman sayfasında sadece Malzeme ve Ekipmanlar kategorisindeki ürünleri görmek istiyorum, böylece ihtiyacım olan ekipmanları kolayca bulabilirim.

#### Acceptance Criteria

1. WHEN Ekipman sayfası yüklendiğinde THEN Category System SHALL sadece Malzeme ve Ekipmanlar kategorisindeki aktif ürünleri göstermek
2. WHEN admin panelde Malzeme ve Ekipmanlar kategorisine ürün eklendiğinde THEN Category System SHALL ürünü Ekipman sayfasında göstermek
3. WHEN Ekipman ürünü gösterildiğinde THEN Category System SHALL ürün adı, fiyat, ekipman özelliklerini (marka, model, durum, garanti) göstermek
4. WHEN Malzeme ve Ekipmanlar kategorisinden ürün kaldırıldığında THEN Category System SHALL ürünü Ekipman sayfasından kaldırmak

### Requirement 6

**User Story:** Admin olarak, ürün kategorilerinin doğru şekilde eşleştirilmesini istiyorum, böylece ürünler doğru sayfalarda görünür.

#### Acceptance Criteria

1. WHEN admin panelde kategori seçildiğinde THEN Category System SHALL kategori ID ve adını doğru şekilde eşleştirmek
2. WHEN kategori bilgisi kaydedildiğinde THEN Category System SHALL ürünü doğru kategori sayfasına yönlendirmek
3. WHEN kategori eşleştirmesi yapılırken THEN Category System SHALL hem kategori ID hem de kategori adı ile kontrol yapmak
4. WHEN kategori bulunamazsa THEN Category System SHALL ürünü genel ürünler sayfasında göstermek

### Requirement 7

**User Story:** Sistem yöneticisi olarak, ürün verilerinin gerçek zamanlı senkronize olmasını istiyorum, böylece kullanıcılar her zaman güncel bilgileri görür.

#### Acceptance Criteria

1. WHEN ürün verisi değiştiğinde THEN Real-time Sync SHALL değişiklikleri 3 dakika içinde tüm sayfalara yansıtmak
2. WHEN senkronizasyon çalıştığında THEN Real-time Sync SHALL sadece değişen verileri güncellemek
3. WHEN senkronizasyon hatası oluştuğunda THEN Real-time Sync SHALL mevcut veriyi korumak ve hata durumunu loglamak
4. WHEN sayfa yüklendiğinde THEN Real-time Sync SHALL önce cache'den sonra veritabanından veri yüklemek