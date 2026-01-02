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
      console.log('🔄 ProductService: Ürünler yükleniyor (Cache-First)...')
      
      // 1. Önce cache'den kontrol et
      const cachedProducts = cacheManager.get(CACHE_KEYS.ALL_PRODUCTS)
      if (cachedProducts) {
        performanceMetrics.cacheHits++
        const loadTime = performance.now() - startTime
        console.log(`⚡ Cache hit! Ürünler ${loadTime.toFixed(2)}ms'de yüklendi`)
        
        // Background'da fresh data çek (stale ise)
        if (cacheManager.isStale(CACHE_KEYS.ALL_PRODUCTS)) {
          console.log('🔄 Cache stale, background refresh başlatılıyor...')
          this.refreshProductsInBackground()
        }
        
        return cachedProducts
      }

      performanceMetrics.cacheMisses++
      console.log('💾 Cache miss, network'den yükleniyor...')

      // 2. Network'den yükle
      const networkData = await this.loadFromNetwork()
      
      if (networkData && networkData.length > 0) {
        // Cache'e kaydet
        cacheManager.set(CACHE_KEYS.ALL_PRODUCTS, networkData)
        
        const loadTime = performance.now() - startTime
        performanceMetrics.averageLoadTime = loadTime
        console.log(`✅ Network'den ${networkData.length} ürün yüklendi (${loadTime.toFixed(2)}ms)`)
        
        return networkData
      }

      // 3. Fallback to localStorage
      console.log('📭 Network'den veri gelmedi, localStorage kontrol ediliyor...')
      const localData = loadFromStorage()
      
      if (localData.length > 0) {
        // Cache'e de kaydet
        cacheManager.set(CACHE_KEYS.ALL_PRODUCTS, localData)
      }
      
      return localData

    } catch (error) {
      performanceMetrics.errors++
      console.error('❌ Ürün yükleme hatası:', error)
      
      // Fallback to cache even if expired
      const expiredCache = cacheManager.get(CACHE_KEYS.ALL_PRODUCTS)
      if (expiredCache) {
        console.log('🔄 Expired cache kullanılıyor...')
        return expiredCache
      }
      
      // Final fallback to localStorage
      return loadFromStorage()
    }
  },

  // Network'den ürünleri yükle
  async loadFromNetwork() {
    return await retryWithBackoff(async () => {
      performanceMetrics.networkRequests++
      
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
        .eq('isactive', true)
        .order('createddate', { ascending: false })

      if (error) throw error
      
      console.log('📥 Supabase\'den gelen ham veri:', data?.length || 0, 'ürün')
      
      if (data && data.length > 0) {
        const formattedData = data.map(product => {
          let specs = {}
          try {
            specs = typeof product.specifications === 'string' 
              ? JSON.parse(product.specifications) 
              : product.specifications || {}
          } catch (e) {
            console.warn('⚠️ Specifications parse hatası:', e, 'Ürün:', product.name)
          }

          return {
            ProductID: product.productid,
            ProductName: product.name,
            Slug: product.slug,
            CategoryID: product.categoryid,
            Categories: product.categories,
            ShortDescription: product.shortdescription,
            Description: product.description,
            Specifications: specs,
            Price: product.price,
            ProductType: specs.type || 'Sale',
            Length: specs.length || specs.uzunluk || null,
            Year: specs.year || specs.yil || null,
            Cabins: specs.cabins || specs.kabin || null,
            Capacity: specs.capacity || specs.kapasite || null,
            Speed: specs.speed || specs.hiz || null,
            Stock: product.stock,
            IsActive: product.isactive,
            CreatedDate: product.createddate,
            ProductImages: product.productimages || []
          }
        })
        
        // LocalStorage'a da kaydet (fallback için)
        saveToStorage(formattedData)
        
        return formattedData
      }
      
      return []
    }, 3, 1000) // 3 retry, 1 second base delay
  },

  // Background'da ürünleri yenile
  async refreshProductsInBackground() {
    try {
      console.log('🔄 Background refresh başlatılıyor...')
      const freshData = await this.loadFromNetwork()
      
      if (freshData && freshData.length > 0) {
        cacheManager.set(CACHE_KEYS.ALL_PRODUCTS, freshData)
        console.log('✅ Background refresh tamamlandı')
        
        // Custom event dispatch et (UI güncellemesi için)
        window.dispatchEvent(new CustomEvent('productsUpdated', { 
          detail: { products: freshData, source: 'background' }
        }))
      }
    } catch (error) {
      console.warn('⚠️ Background refresh hatası:', error)
    }
  },

  // 3 dakikalık refresh scheduler'ı başlat
  startAutoRefresh() {
    refreshScheduler.start('products', () => {
      this.refreshProductsInBackground()
    }, 3 * 60 * 1000) // 3 minutes
    
    console.log('🔄 Auto-refresh başlatıldı (3 dakika)')
  },

  // Auto refresh'i durdur
  stopAutoRefresh() {
    refreshScheduler.stop('products')
    console.log('⏹️ Auto-refresh durduruldu')
  },

  async getProductBySlug(slug) {
    const startTime = performance.now()
    const cacheKey = CACHE_KEYS.PRODUCT_BY_SLUG + slug
    
    try {
      // Cache'den kontrol et
      const cachedProduct = cacheManager.get(cacheKey)
      if (cachedProduct) {
        performanceMetrics.cacheHits++
        const loadTime = performance.now() - startTime
        console.log(`⚡ Product cache hit for ${slug} (${loadTime.toFixed(2)}ms)`)
        return cachedProduct
      }

      performanceMetrics.cacheMisses++
      
      // Network'den yükle
      const networkProduct = await retryWithBackoff(async () => {
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
        return data
      })

      if (networkProduct) {
        // Veriyi formatla
        let specs = {}
        try {
          specs = typeof networkProduct.specifications === 'string' 
            ? JSON.parse(networkProduct.specifications) 
            : networkProduct.specifications || {}
        } catch (e) {
          console.warn('Specifications parse hatası:', e)
        }

        const formattedProduct = {
          ProductID: networkProduct.productid,
          ProductName: networkProduct.name,
          Slug: networkProduct.slug,
          CategoryID: networkProduct.categoryid,
          Categories: networkProduct.categories,
          ShortDescription: networkProduct.shortdescription,
          Description: networkProduct.description,
          Specifications: specs,
          Price: networkProduct.price,
          ProductType: specs.type || 'Sale',
          Length: specs.length || specs.uzunluk || null,
          Year: specs.year || specs.yil || null,
          Cabins: specs.cabins || specs.kabin || null,
          Capacity: specs.capacity || specs.kapasite || null,
          Speed: specs.speed || specs.hiz || null,
          Stock: networkProduct.stock,
          IsActive: networkProduct.isactive,
          CreatedDate: networkProduct.createddate,
          ProductImages: networkProduct.productimages || []
        }

        // Cache'e kaydet
        cacheManager.set(cacheKey, formattedProduct)
        
        return formattedProduct
      }

    } catch (error) {
      console.warn('Supabase ürün yüklenemedi, local data kullanılıyor:', error)
      
      // Fallback: Tüm ürünlerden bul
      const products = loadFromStorage()
      const product = products.find(p => p.slug === slug)
      
      if (product) {
        cacheManager.set(cacheKey, product)
      }
      
      return product
    }
  },

  // Performance metrics'i al
  getPerformanceMetrics() {
    return {
      ...performanceMetrics,
      cacheStats: cacheManager.getStats(),
      schedulerStatus: refreshScheduler.getStatus()
    }
  },

  // Cache'i temizle
  clearCache() {
    cacheManager.clear()
    console.log('🧹 Product cache temizlendi')
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