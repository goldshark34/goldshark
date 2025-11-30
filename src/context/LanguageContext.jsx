import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // LocalStorage'dan dil tercihini yükle
    return localStorage.getItem('language') || 'tr'
  })

  useEffect(() => {
    // Dil değiştiğinde localStorage'a kaydet
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr')
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Çeviriler
const translations = {
  tr: {
    // Header
    'nav.home': 'Ana Sayfa',
    'nav.products': 'Ürünler',
    'nav.ribBoat': 'Rib Boat',
    'nav.equipment': 'Ekipman ve Malzemeler',
    'nav.allProducts': 'Tüm Ürünler',
    'nav.services': 'Hizmetler',
    'nav.maintenance': 'Bakım ve Onarım',
    'nav.dealers': 'Bayilerimiz',
    'nav.contact': 'İletişim',
    
    // Home Page
    'home.hero.ribBoat': 'Rib Boat',
    'home.hero.equipment': 'Ekipman ve Malzemeler',
    'home.hero.allProducts': 'Tüm Ürünler',
    'home.features.premium': 'Boat Modelleri',
    'home.features.premiumDesc': 'En kaliteli boat modelleri',
    'home.features.experience': 'Deneyim',
    'home.features.experienceDesc': '25+ yıllık tecrübe',
    'home.features.secure': 'Güvenli Alışveriş',
    'home.features.secureDesc': 'Garantili işlemler',
    'home.features.global': 'Global Ağ',
    'home.features.globalDesc': 'Dünya çapında hizmet',
    'home.featured.title': 'Öne Çıkan Ürünler',
    'home.featured.subtitle': 'Seçkin koleksiyonumuzdan özel ürünler',
    'home.featured.noProducts': 'Henüz ürün eklenmemiş',
    'home.featured.comingSoon': 'Yakında yeni ürünler eklenecektir',
    'home.featured.viewAll': 'Tüm Ürünleri Görüntüle',
    'home.cta.title': 'Hayalinizdeki Tekneyi Bulun',
    'home.cta.description': 'Uzman ekibimiz size en uygun tekneyi bulmanızda yardımcı olmak için burada. Ücretsiz danışmanlık hizmeti için hemen iletişime geçin.',
    'home.cta.call': 'Bizi Arayın',
    'home.cta.message': 'Mesaj Gönderin',
    
    // Product Details
    'product.forSale': 'Satılık',
    'product.forRent': 'Kiralık',
    'product.details': 'Detaylar',
    'product.priceNotSpecified': 'Fiyat Belirtilmemiş',
    
    // Specifications
    'spec.width': 'En',
    'spec.length': 'Boy',
    'spec.weight': 'Ağırlık',
    'spec.capacity': 'Kapasite',
    'spec.emptyWeight': 'Boş Ağırlık',
    'spec.fullWeight': 'Dolu Ağırlık',
    'spec.enginePower': 'Motor Gücü',
    'spec.brand': 'Marka',
    'spec.model': 'Model',
    'spec.condition': 'Durum',
    'spec.warranty': 'Garanti',
    'spec.material': 'Malzeme',
    'spec.color': 'Renk',
    'spec.dimensions': 'Boyutlar',
    
    // Condition
    'condition.new': 'Yeni',
    'condition.used': 'İkinci El',
    'condition.refurbished': 'Yenilenmiş',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.notSpecified': 'Belirtilmemiş',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.ribBoat': 'Rib Boat',
    'nav.equipment': 'Equipment & Materials',
    'nav.allProducts': 'All Products',
    'nav.services': 'Services',
    'nav.maintenance': 'Maintenance & Repair',
    'nav.dealers': 'Our Dealers',
    'nav.contact': 'Contact',
    
    // Home Page
    'home.hero.ribBoat': 'Rib Boat',
    'home.hero.equipment': 'Equipment & Materials',
    'home.hero.allProducts': 'All Products',
    'home.features.premium': 'Boat Models',
    'home.features.premiumDesc': 'Highest quality boat models',
    'home.features.experience': 'Experience',
    'home.features.experienceDesc': '25+ years of expertise',
    'home.features.secure': 'Secure Shopping',
    'home.features.secureDesc': 'Guaranteed transactions',
    'home.features.global': 'Global Network',
    'home.features.globalDesc': 'Worldwide service',
    'home.featured.title': 'Featured Products',
    'home.featured.subtitle': 'Special products from our exclusive collection',
    'home.featured.noProducts': 'No products added yet',
    'home.featured.comingSoon': 'New products will be added soon',
    'home.featured.viewAll': 'View All Products',
    'home.cta.title': 'Find Your Dream Boat',
    'home.cta.description': 'Our expert team is here to help you find the perfect boat. Contact us now for free consultation.',
    'home.cta.call': 'Call Us',
    'home.cta.message': 'Send Message',
    
    // Product Details
    'product.forSale': 'For Sale',
    'product.forRent': 'For Rent',
    'product.details': 'Details',
    'product.priceNotSpecified': 'Price Not Specified',
    
    // Specifications
    'spec.width': 'Width',
    'spec.length': 'Length',
    'spec.weight': 'Weight',
    'spec.capacity': 'Capacity',
    'spec.emptyWeight': 'Empty Weight',
    'spec.fullWeight': 'Full Weight',
    'spec.enginePower': 'Engine Power',
    'spec.brand': 'Brand',
    'spec.model': 'Model',
    'spec.condition': 'Condition',
    'spec.warranty': 'Warranty',
    'spec.material': 'Material',
    'spec.color': 'Color',
    'spec.dimensions': 'Dimensions',
    
    // Condition
    'condition.new': 'New',
    'condition.used': 'Used',
    'condition.refurbished': 'Refurbished',
    
    // Common
    'common.loading': 'Loading...',
    'common.notSpecified': 'Not Specified',
  }
}
