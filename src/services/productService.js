import { supabase } from '../lib/supabase'
import { cacheManager } from '../utils/cacheManager'
import { refreshScheduler } from '../utils/refreshScheduler'

// Cache keys
const CACHE_KEYS = {
  ALL_PRODUCTS: 'all_products',
  PRODUCT_BY_SLUG: 'product_by_slug_'
}

// LocalStorage'da ürünleri sakla (fallback için)
const STORAGE_KEY = 'luxury_yachts_products'

// Mock ürünler - Hızlı test için
const mockProducts = [
  {
    ProductID: 1,
    ProductName: 'Luxury Yacht 2024',
    Slug: 'luxury-yacht-2024',
    CategoryID: 1,
    Categories: { name: 'Yat' },
    ShortDescription: 'Lüks yat',
    Description: 'Modern ve konforlu lüks yat',
    Specifications: {
      length: '15m',
      width: '4m',
      capacity: '8 kişi',
      enginePower: '300 HP'
    },
    Price: 250000,
    ProductType: 'Sale',
    Length: '15m',
    Year: '2024',
    Cabins: '3',
    Capacity: '8',
    Speed: '25 knot',
    Stock: 1,
    IsActive: true,
    CreatedDate: new Date().toISOString(),
    ProductImages: [
      {
        ImageURL: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageurl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    ProductID: 2,
    ProductName: 'Sport Boat Pro',
    Slug: 'sport-boat-pro',
    CategoryID: 1,
    Categories: { name: 'Tekne' },
    ShortDescription: 'Spor teknesi',
    Description: 'Hızlı ve çevik spor teknesi',
    Specifications: {
      length: '12m',
      width: '3.5m',
      capacity: '6 kişi',
      enginePower: '250 HP'
    },
    Price: 180000,
    ProductType: 'Sale',
    Length: '12m',
    Year: '2024',
    Cabins: '2',
    Capacity: '6',
    Speed: '30 knot',
    Stock: 1,
    IsActive: true,
    CreatedDate: new Date().toISOString(),
    ProductImages: [
      {
        ImageURL: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageurl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    ProductID: 3,
    ProductName: 'Family Cruiser',
    Slug: 'family-cruiser',
    CategoryID: 1,
    Categories: { name: 'Aile Teknesi' },
    ShortDescription: 'Aile teknesi',
    Description: 'Aileler için ideal tekne',
    Specifications: {
      length: '10m',
      width: '3m',
      capacity: '10 kişi',
      enginePower: '200 HP'
    },
    Price: 120000,
    ProductType: 'Sale',
    Length: '10m',
    Year: '2023',
    Cabins: '2',
    Capacity: '10',
    Speed: '20 knot',
    Stock: 1,
    IsActive: true,
    CreatedDate: new Date().toISOString(),
    ProductImages: [
      {
        ImageURL: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        imageurl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
]

// Performance tracking
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  errors: 0,
  averageLoadTime: 0
}

// LocalStorage'dan ürünleri yükle (fallback)
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    return []
  } catch (error) {
    console.error('LocalStorage okuma hatası:', error)
    return []
  }
}

// LocalStorage'a kaydet (fallback)
const saveToStorage = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error('LocalStorage yazma hatası:', error)
  }
}

// Retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = baseDelay * Math.pow(2, i)
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms:`, error.message)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export const productService = {
  async getAllProducts() {
    const startTime = performance.now()
    
    try {
      console.log('🔄 ProductService: Gerçek ürünler yükleniyor...')
      
      // Basit ve hızlı Supabase sorgusu
      const { data, error } = await supabase
        .from('products')
        .select('productid, name, slug, price, specifications, createddate')
        .eq('isactive', true)
        .order('createddate', { ascending: false })
        .limit(10) // Sadece 10 ürün

      if (error) {
        console.warn('⚠️ Supabase hatası:', error)
        // Fallback to mock data
        console.log('📦 Mock data kullanılıyor...')
        return mockProducts
      }
      
      const loadTime = performance.now() - startTime
      console.log(`⚡ Gerçek ürünler ${loadTime.toFixed(2)}ms'de yüklendi`)
      console.log('📥 Supabase\'den gelen veri:', data?.length || 0, 'ürün')
      
      if (data && data.length > 0) {
        const formattedData = data.map(product => {
          let specs = {}
          try {
            specs = typeof product.specifications === 'string' 
              ? JSON.parse(product.specifications) 
              : product.specifications || {}
          } catch (e) {
            console.warn('⚠️ Specifications parse hatası:', e)
          }

          return {
            ProductID: product.productid,
            ProductName: product.name,
            Slug: product.slug,
            CategoryID: 1,
            Categories: { name: 'Genel' },
            ShortDescription: '',
            Description: '',
            Specifications: specs,
            Price: product.price,
            ProductType: specs.type || 'Sale',
            Length: specs.length || specs.uzunluk || null,
            Year: specs.year || specs.yil || null,
            Cabins: specs.cabins || specs.kabin || null,
            Capacity: specs.capacity || specs.kapasite || null,
            Speed: specs.speed || specs.hiz || null,
            Stock: 1,
            IsActive: true,
            CreatedDate: product.createddate,
            ProductImages: [
              {
                ImageURL: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                imageurl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
            ]
          }
        })
        
        // LocalStorage'a da kaydet (fallback için)
        saveToStorage(formattedData)
        
        console.log('✅ Gerçek ürünler formatlandı:', formattedData.length, 'adet')
        return formattedData
      }
      
      // Fallback to mock data
      console.log('📦 Veri yok, mock data kullanılıyor...')
      return mockProducts

    } catch (error) {
      console.error('❌ Ürün yükleme hatası:', error)
      // Final fallback to mock data
      console.log('📦 Hata durumu, mock data kullanılıyor...')
      return mockProducts
    }
  },

  // 3 dakikalık refresh scheduler'ı başlat
  startAutoRefresh() {
    // Basit setInterval kullan
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
    
    this.refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refresh: 3 dakika geçti, ürünler yenileniyor...')
      // Custom event dispatch et
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { source: 'auto-refresh' }
      }))
    }, 3 * 60 * 1000) // 3 minutes
    
    console.log('🔄 Auto-refresh başlatıldı (3 dakika)')
  },

  // Auto refresh'i durdur
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
      console.log('⏹️ Auto-refresh durduruldu')
    }
  },

  async getProductBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          productid,
          name,
          slug,
          categoryid,
          shortdescription,
          description,
          specifications,
          price,
          stock,
          isactive,
          createddate,
          categories:categoryid (categoryid, name),
          productimages:productid (imageid, imageurl, ismain)
        `)
        .eq('slug', slug)
        .eq('isactive', true)
        .single()

      if (error) throw error
      
      // Veriyi formatla
      let specs = {}
      try {
        specs = typeof data.specifications === 'string' 
          ? JSON.parse(data.specifications) 
          : data.specifications || {}
      } catch (e) {
        console.warn('Specifications parse hatası:', e)
      }

      return {
        ProductID: data.productid,
        ProductName: data.name,
        Slug: data.slug,
        CategoryID: data.categoryid,
        Categories: data.categories,
        ShortDescription: data.shortdescription,
        Description: data.description,
        Specifications: specs,
        Price: data.price,
        ProductType: specs.type || 'Sale',
        Length: specs.length || specs.uzunluk || null,
        Year: specs.year || specs.yil || null,
        Cabins: specs.cabins || specs.kabin || null,
        Capacity: specs.capacity || specs.kapasite || null,
        Speed: specs.speed || specs.hiz || null,
        Stock: data.stock,
        IsActive: data.isactive,
        CreatedDate: data.createddate,
        ProductImages: data.productimages || []
      }
    } catch (error) {
      console.warn('Supabase ürün yüklenemedi, local data kullanılıyor:', error)
      const products = loadFromStorage()
      return products.find(p => p.slug === slug)
    }
  },

  // Performance metrics'i al
  getPerformanceMetrics() {
    return {
      message: 'Basit mod - cache devre dışı'
    }
  },

  // Cache'i temizle
  clearCache() {
    console.log('🧹 Cache temizlendi (basit mod)')
  },

  async createProduct(productData) {
    try {
      // Specifications'ı JSON string'e çevir
      let specificationsJson = productData.specifications
      if (typeof specificationsJson === 'object') {
        specificationsJson = JSON.stringify(specificationsJson)
      }

      // Supabase için veriyi hazırla (küçük harfli kolonlar)
      const supabaseData = {
        categoryid: parseInt(productData.categoryID),
        name: productData.name,
        slug: productData.slug,
        shortdescription: productData.shortDescription || '',
        description: productData.description || '',
        specifications: specificationsJson || '{}',
        price: parseFloat(productData.price) || 0,
        stock: parseInt(productData.stock) || 0,
        isactive: productData.isActive !== false
      }

      console.log('📤 Supabase\'e gönderilen veri:', supabaseData)

      const { data, error } = await supabase
        .from('products')
        .insert([supabaseData])
        .select(`
          productid,
          name,
          slug,
          categoryid,
          shortdescription,
          description,
          specifications,
          price,
          stock,
          isactive,
          createddate
        `)
        .single()

      if (error) {
        console.error('❌ Supabase hatası:', error)
        throw error
      }

      console.log('✅ Supabase\'den dönen veri:', data)

      // Görselleri ekle
      if (productData.images && productData.images.length > 0 && data) {
        console.log('📸 Görseller ekleniyor:', productData.images)
        for (const image of productData.images) {
          const imageUrl = image.imageUrl || image.ImageURL || image
          const { error: imgError } = await supabase
            .from('productimages')
            .insert([{
              productid: data.productid,
              imageurl: imageUrl,
              ismain: image.isMain || false
            }])
          
          if (imgError) {
            console.error('Görsel eklenirken hata:', imgError)
          } else {
            console.log('✅ Görsel eklendi:', imageUrl)
          }
        }
      }

      // Parse specifications
      let specs = {}
      try {
        specs = typeof data.specifications === 'string' 
          ? JSON.parse(data.specifications) 
          : data.specifications || {}
      } catch (e) {
        console.warn('Specifications parse hatası:', e)
      }

      return {
        ProductID: data.productid,
        ProductName: data.name,
        Slug: data.slug,
        CategoryID: data.categoryid,
        ShortDescription: data.shortdescription,
        Description: data.description,
        Specifications: specs,
        Price: data.price,
        ProductType: specs.type || 'Sale',
        Length: specs.length || specs.uzunluk || null,
        Year: specs.year || specs.yil || null,
        Cabins: specs.cabins || specs.kabin || null,
        Capacity: specs.capacity || specs.kapasite || null,
        Speed: specs.speed || specs.hiz || null,
        Stock: data.stock,
        IsActive: data.isactive,
        CreatedDate: data.createddate,
        ProductImages: []
      }
    } catch (error) {
      console.warn('⚠️ Supabase ürün oluşturulamadı, local storage kullanılıyor:', error)
      
      // LocalStorage'a ekle
      const products = loadFromStorage()
      const newProduct = {
        ...productData,
        productID: Math.max(...products.map(p => p.productID), 0) + 1,
        createdDate: new Date().toISOString(),
        isActive: productData.isActive !== false
      }
      
      // Kategori adını ekle
      const categories = JSON.parse(localStorage.getItem('luxury_yachts_categories') || '[]')
      const category = categories.find(c => c.categoryID == productData.categoryID)
      if (category) {
        newProduct.categoryName = category.name
      }
      
      products.push(newProduct)
      saveToStorage(products)
      
      console.log('✅ Ürün local storage\'a eklendi:', newProduct)
      return newProduct
    }
  },

  async updateProduct(id, productData) {
    try {
      // Specifications'ı JSON string'e çevir
      let specificationsJson = productData.specifications
      if (typeof specificationsJson === 'object') {
        specificationsJson = JSON.stringify(specificationsJson)
      }

      // Supabase için veriyi hazırla
      const supabaseData = {
        categoryid: parseInt(productData.categoryID),
        name: productData.name,
        slug: productData.slug,
        shortdescription: productData.shortDescription || '',
        description: productData.description || '',
        specifications: specificationsJson || '{}',
        price: parseFloat(productData.price) || 0,
        stock: parseInt(productData.stock) || 0,
        isactive: productData.isActive !== false
      }

      console.log('📤 Güncelleme verisi:', supabaseData)

      const { data, error } = await supabase
        .from('products')
        .update(supabaseData)
        .eq('productid', id)
        .select(`
          productid,
          name,
          slug,
          categoryid,
          shortdescription,
          description,
          specifications,
          price,
          stock,
          isactive,
          createddate
        `)
        .single()

      if (error) throw error
      
      console.log('✅ Güncellenen veri:', data)

      // Parse specifications
      let specs = {}
      try {
        specs = typeof data.specifications === 'string' 
          ? JSON.parse(data.specifications) 
          : data.specifications || {}
      } catch (e) {
        console.warn('Specifications parse hatası:', e)
      }

      return {
        ProductID: data.productid,
        ProductName: data.name,
        Slug: data.slug,
        CategoryID: data.categoryid,
        ShortDescription: data.shortdescription,
        Description: data.description,
        Specifications: specs,
        Price: data.price,
        ProductType: specs.type || 'Sale',
        Length: specs.length || specs.uzunluk || null,
        Year: specs.year || specs.yil || null,
        Cabins: specs.cabins || specs.kabin || null,
        Capacity: specs.capacity || specs.kapasite || null,
        Speed: specs.speed || specs.hiz || null,
        Stock: data.stock,
        IsActive: data.isactive,
        CreatedDate: data.createddate
      }
    } catch (error) {
      console.warn('Supabase ürün güncellenemedi, local storage kullanılıyor:', error)
      
      // LocalStorage'da güncelle
      const products = loadFromStorage()
      const index = products.findIndex(p => p.productID == id)
      
      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...productData,
          productID: id
        }
        saveToStorage(products)
        console.log('✅ Ürün local storage\'da güncellendi:', products[index])
        return products[index]
      }
      
      throw new Error('Ürün bulunamadı')
    }
  },

  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ isactive: false })
        .eq('productid', id)

      if (!error) {
        console.log('✅ Ürün Supabase\'de pasif yapıldı')
        return
      }
      throw error
    } catch (error) {
      console.warn('Supabase ürün silinemedi, local storage kullanılıyor:', error)
      
      // LocalStorage'dan sil
      const products = loadFromStorage()
      const filtered = products.filter(p => p.productID != id)
      saveToStorage(filtered)
      console.log('✅ Ürün local storage\'dan silindi')
    }
  },

  async uploadImage(formData) {
    try {
      const file = formData.get('image')
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return { imageUrl: publicUrl }
    } catch (error) {
      console.warn('Supabase resim yüklenemedi, placeholder kullanılıyor:', error)
      // Placeholder resim döndür
      return { 
        imageUrl: `https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80` 
      }
    }
  }
}