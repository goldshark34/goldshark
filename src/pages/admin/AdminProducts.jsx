import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import ProductForm from '../../components/Admin/ProductForm'
import ProductList from '../../components/Admin/ProductList'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await productService.deleteProduct(productId)
        setProducts(products.filter(p => p.ProductID !== productId))
        setSuccess('✅ Ürün başarıyla silindi!')
        setTimeout(() => setSuccess(null), 3000)
      } catch (error) {
        console.error('Ürün silinirken hata:', error)
        setError(`❌ Hata: ${error.message}`)
      }
    }
  }

  const handleFormSubmit = async (productData) => {
    try {
      setError(null)
      if (editingProduct) {
        await productService.updateProduct(editingProduct.ProductID, productData)
        setSuccess('✅ Ürün başarıyla güncellendi!')
      } else {
        const result = await productService.createProduct(productData)
        console.log('Oluşturulan ürün:', result)
        setSuccess('✅ Ürün başarıyla eklendi!')
      }
      setShowForm(false)
      setEditingProduct(null)
      await loadProducts()
      
      // Başarı mesajını 3 saniye sonra temizle
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Ürün kaydedilirken hata:', error)
      setError(`❌ Hata: ${error.message}`)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="text-muted">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-products bg-light min-vh-100 py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">🚤 Bot Yönetimi</h2>
            <p className="text-muted mb-0">
              Toplam {products.length} ürün • {categories.length} kategori
            </p>
          </div>
          <button 
            className="btn btn-success btn-lg fw-bold px-4" 
            onClick={handleCreate}
          >
            ➕ Yeni Ürün Ekle
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {showForm ? (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}

export default AdminProducts