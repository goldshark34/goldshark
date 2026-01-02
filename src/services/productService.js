import { supabase } from '../lib/supabase'

// LocalStorage'da ürünleri sakla (test için)
const STORAGE_KEY = 'luxury_yachts_products'

// Mock ürünler - Başlangıçta boş
const mockProducts = []

// LocalStorage'dan ürünleri yükle
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // İlk yükleme için boş array kaydet
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
    return []
  } catch (error) {
    console.error('LocalStorage okuma hatası:', error)
    return []
  }
}

// LocalStorage'a kaydet
const saveToStorage = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  } catch (error) {
    console.error('LocalStorage yazma hatası:', error)
  }
}

export const productService = {
  async getAllProducts() {
    try {
      console.log('🔄 ProductService: Ürünler yükleniyor...')
      
      // Önce Supabase'i dene
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

      if (error) {
        console.warn('⚠️ Supabase hatası:', error)
        throw error
      }
      
      console.log('📥 Supabase\'den gelen ham veri:', data)
      console.log('📊 Toplam ürün sayısı:', data?.length || 0)
      
      if (data && data.length > 0) {
        // Veriyi düzenle
        const formattedData = data.map(product => {
          // Specifications JSON parse et
          let specs = {}
          try {
            specs = typeof product.specifications === 'string' 
              ? JSON.parse(product.specifications) 
              : product.specifications || {}
          } catch (e) {
            console.warn('⚠️ Specifications parse hatası:', e, 'Ürün:', product.name)
          }

          const formatted = {
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
          
          console.log(`📦 Formatlanmış ürün: ${formatted.ProductName}`, {
            ProductID: formatted.ProductID,
            CategoryID: formatted.CategoryID,
            Categories: formatted.Categories,
            kategoriAdi: formatted.Categories?.name,
            specifications: formatted.Specifications,
            images: formatted.ProductImages?.length || 0
          })
          
          return formatted
        })
        
        console.log('✅ Tüm formatlanmış ürünler:', formattedData.length, 'adet')
        return formattedData
      } else {
        console.log('📭 Supabase\'den veri gelmedi, LocalStorage kontrol ediliyor...')
      }
    } catch (error) {
      console.warn('⚠️ Supabase ürünleri yüklenemedi, local data kullanılıyor:', error)
    }
    
    // LocalStorage'dan yükle
    console.log('💾 LocalStorage\'dan ürünler yükleniyor...')
    const localData = loadFromStorage()
    console.log('📦 LocalStorage\'dan gelen ürün sayısı:', localData.length)
    return localData
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