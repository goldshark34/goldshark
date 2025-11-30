import { supabase } from '../lib/supabase'

// Mock kategoriler (test için)
const mockCategories = [
  { categoryID: 1, name: 'Rib Boat', slug: 'rib-boat', description: 'Rijit şişme tekneler' },
  { categoryID: 2, name: 'Malzeme ve Ekipmanlar', slug: 'equipment', description: 'Tekne malzemeleri ve ekipmanları' }
]

export const categoryService = {
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.warn('Supabase kategorileri yüklenemedi, mock data kullanılıyor:', error)
        return mockCategories
      }
      
      // Eğer Supabase'de kategori yoksa mock data kullan
      if (!data || data.length === 0) {
        console.log('⚠️ Kategori bulunamadı, mock data kullanılıyor')
        // Mock kategorileri Supabase'e ekle
        await this.seedCategories()
        return mockCategories
      }
      
      // Sadece izin verilen kategorileri filtrele
      const allowedCategories = ['Rib Boat', 'Malzeme ve Ekipmanlar']
      const filteredData = data.filter(cat => allowedCategories.includes(cat.name))
      
      // Eğer filtrelenmiş veri yoksa mock data kullan
      if (filteredData.length === 0) {
        console.log('⚠️ İzin verilen kategori bulunamadı, mock data kullanılıyor')
        return mockCategories
      }
      
      // Veriyi düzenle
      return filteredData.map(cat => ({
        categoryID: cat.categoryid,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentID: cat.parentid
      }))
    } catch (error) {
      console.warn('Kategori servisi hatası, mock data kullanılıyor:', error)
      return mockCategories
    }
  },

  async seedCategories() {
    try {
      console.log('📦 Mock kategoriler Supabase\'e ekleniyor...')
      for (const cat of mockCategories) {
        await supabase
          .from('categories')
          .insert([{
            name: cat.name,
            slug: cat.slug,
            description: cat.description
          }])
      }
      console.log('✅ Kategoriler başarıyla eklendi')
    } catch (error) {
      console.error('❌ Kategori ekleme hatası:', error)
    }
  },

  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        parentid: categoryData.parentID
      }])
      .select()
      .single()

    if (error) throw error
    
    return {
      categoryID: data.categoryid,
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentID: data.parentid
    }
  },

  async updateCategory(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        parentid: categoryData.parentID
      })
      .eq('categoryid', id)
      .select()
      .single()

    if (error) throw error
    
    return {
      categoryID: data.categoryid,
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentID: data.parentid
    }
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('categoryid', id)

    if (error) throw error
  }
}