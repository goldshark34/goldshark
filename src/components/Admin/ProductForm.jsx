import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card, Badge, Alert } from 'react-bootstrap'
import { productService } from '../../services/productService'

const ProductForm = ({ product, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryID: '',
    shortDescription: '',
    description: '',
    specifications: '',
    price: '',
    stock: 0,
    isActive: true
  })
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState([''])
  
  // Kategori bazlı özel alanlar - Rib Boat için yeni özellikler
  const [ribBoatSpecs, setRibBoatSpecs] = useState({
    width: '', // En
    length: '', // Boy
    weight: '', // Ağırlık
    passengerCapacity: '', // Yolcu Kapasitesi
    emptyWeight: '', // Boş Ağırlık
    fullWeight: '', // Dolu Ağırlık
    enginePower: '' // Motor Gücü
  })
  
  const [equipmentSpecs, setEquipmentSpecs] = useState({
    brand: '',
    model: '',
    condition: 'new',
    warranty: ''
  })

  useEffect(() => {
    if (product) {
      // Specifications'ı parse et
      let specs = {}
      if (product.Specifications) {
        specs = typeof product.Specifications === 'string' 
          ? JSON.parse(product.Specifications) 
          : product.Specifications
      } else if (product.specifications) {
        specs = typeof product.specifications === 'string' 
          ? JSON.parse(product.specifications) 
          : product.specifications
      }

      setFormData({
        name: product.ProductName || product.name || '',
        slug: product.Slug || product.slug || '',
        categoryID: product.CategoryID || product.categoryID || '',
        shortDescription: product.ShortDescription || product.shortDescription || '',
        description: product.Description || product.description || '',
        specifications: JSON.stringify(specs, null, 2),
        price: product.Price || product.price || '',
        stock: product.Stock || product.stock || 0,
        isActive: (product.IsActive !== false) && (product.isActive !== false)
      })
      
      // Kategori bazlı özellikleri ayarla
      if (specs.width || specs.length || specs.passengerCapacity) {
        setRibBoatSpecs({
          width: specs.width || '',
          length: specs.length || '',
          weight: specs.weight || '',
          passengerCapacity: specs.passengerCapacity || '',
          emptyWeight: specs.emptyWeight || '',
          fullWeight: specs.fullWeight || '',
          enginePower: specs.enginePower || ''
        })
      }
      
      if (specs.brand || specs.model) {
        setEquipmentSpecs({
          brand: specs.brand || '',
          model: specs.model || '',
          condition: specs.condition || 'new',
          warranty: specs.warranty || ''
        })
      }
      
      // Görselleri ayarla
      const productImages = product.ProductImages || product.images || []
      setImages(productImages)
      if (productImages.length > 0) {
        setImageUrls(productImages.map(img => img.imageurl || img.imageUrl || img.ImageURL))
      }
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUrlAdd = () => {
    setImageUrls(prev => [...prev, ''])
  }
  
  const handleImageUrlChange = (index, value) => {
    setImageUrls(prev => {
      const newUrls = [...prev]
      newUrls[index] = value
      return newUrls
    })
  }
  
  const handleImageUrlRemove = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    setUploading(true)

    try {
      const newUrls = []
      
      for (const file of files) {
        // Dosyayı base64'e çevir veya imgbb.com'a yükle
        // Şimdilik imgbb.com API kullanacağız (ücretsiz)
        const formData = new FormData()
        formData.append('image', file)
        
        try {
          // imgbb.com API key (ücretsiz, kayıt gerektirir)
          // Alternatif olarak dosyayı base64'e çevirebiliriz
          const reader = new FileReader()
          
          const base64Promise = new Promise((resolve) => {
            reader.onloadend = () => {
              resolve(reader.result)
            }
            reader.readAsDataURL(file)
          })
          
          const base64 = await base64Promise
          newUrls.push(base64)
        } catch (error) {
          console.error('Dosya okuma hatası:', error)
        }
      }
      
      // Mevcut URL'lere yeni URL'leri ekle
      setImageUrls(prev => {
        const filtered = prev.filter(url => url.trim() !== '')
        return [...filtered, ...newUrls]
      })
      
    } catch (error) {
      console.error('Resim yüklenirken hata:', error)
      alert('Görseller yüklenirken bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleSetMainImage = (index) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })))
  }

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Kategori bazlı specifications oluştur
    let specs = {}
    const selectedCategory = categories.find(c => c.categoryID == formData.categoryID)
    
    if (selectedCategory?.name === 'Rib Boat') {
      specs = {
        type: 'Sale',
        ...ribBoatSpecs
      }
    } else if (selectedCategory?.name === 'Malzeme ve Ekipmanlar') {
      specs = {
        type: 'Sale',
        ...equipmentSpecs
      }
    } else {
      // Genel specifications
      try {
        specs = formData.specifications ? JSON.parse(formData.specifications) : {}
      } catch (e) {
        specs = {}
      }
    }
    
    // URL'lerden görselleri oluştur
    const imageList = imageUrls
      .filter(url => url.trim() !== '')
      .map((url, index) => ({
        imageUrl: url,
        isMain: index === 0
      }))
    
    onSubmit({
      ...formData,
      specifications: specs,
      images: imageList
    })
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-dark text-white py-3">
        <h4 className="mb-0">
          {product ? '✏️ Ürünü Düzenle' : '➕ Yeni Ürün Ekle'}
        </h4>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Kategori Bilgisi */}
        {categories.length > 0 && (
          <Alert variant="success" className="mb-4">
            <strong>✅ {categories.length} kategori yüklendi</strong>
            <div className="mt-2">
              {categories.map(cat => (
                <Badge key={cat.categoryID} bg="secondary" className="me-2">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Ürün Adı *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e)
                    if (!product) {
                      setFormData(prev => ({
                        ...prev,
                        slug: generateSlug(e.target.value)
                      }))
                    }
                  }}
                  placeholder="Örn: Azimut Grande 35M"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Slug *</Form.Label>
                <Form.Control
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="azimut-grande-35m"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Kategori *</Form.Label>
                <Form.Select
                  name="categoryID"
                  value={formData.categoryID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map(category => (
                    <option key={category.categoryID} value={category.categoryID}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Seçili: {formData.categoryID ? categories.find(c => c.categoryID == formData.categoryID)?.name : 'Henüz seçilmedi'}
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Fiyat (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Stok</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Kısa Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Ürün hakkında kısa bir açıklama..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Detaylı Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Ürün hakkında detaylı açıklama..."
            />
          </Form.Group>

          {/* Kategori Bazlı Özel Alanlar */}
          {formData.categoryID && categories.find(c => c.categoryID == formData.categoryID)?.name === 'Rib Boat' && (
            <Card className="mb-3 border-primary">
              <Card.Header className="bg-primary text-white">
                <strong>🚤 Rib Boat Özellikleri</strong>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>En (Genişlik)</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.width}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, width: e.target.value})}
                        placeholder="Örn: 2.5m"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Boy (Uzunluk)</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.length}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, length: e.target.value})}
                        placeholder="Örn: 8.5m"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Ağırlık</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.weight}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, weight: e.target.value})}
                        placeholder="Örn: 1200kg"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Yolcu Kapasitesi</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.passengerCapacity}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, passengerCapacity: e.target.value})}
                        placeholder="Örn: 10 kişi"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Boş Ağırlık</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.emptyWeight}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, emptyWeight: e.target.value})}
                        placeholder="Örn: 800kg"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Dolu Ağırlık</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.fullWeight}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, fullWeight: e.target.value})}
                        placeholder="Örn: 1500kg"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Motor Gücü</Form.Label>
                      <Form.Control
                        type="text"
                        value={ribBoatSpecs.enginePower}
                        onChange={(e) => setRibBoatSpecs({...ribBoatSpecs, enginePower: e.target.value})}
                        placeholder="Örn: 2x 250HP veya 500HP"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {formData.categoryID && categories.find(c => c.categoryID == formData.categoryID)?.name === 'Malzeme ve Ekipmanlar' && (
            <Card className="mb-3 border-success">
              <Card.Header className="bg-success text-white">
                <strong>⚙️ Ekipman Özellikleri</strong>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Marka</Form.Label>
                      <Form.Control
                        type="text"
                        value={equipmentSpecs.brand}
                        onChange={(e) => setEquipmentSpecs({...equipmentSpecs, brand: e.target.value})}
                        placeholder="Örn: Garmin"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        value={equipmentSpecs.model}
                        onChange={(e) => setEquipmentSpecs({...equipmentSpecs, model: e.target.value})}
                        placeholder="Örn: GPSMAP 8612"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Durum</Form.Label>
                      <Form.Select
                        value={equipmentSpecs.condition}
                        onChange={(e) => setEquipmentSpecs({...equipmentSpecs, condition: e.target.value})}
                      >
                        <option value="new">Yeni</option>
                        <option value="used">İkinci El</option>
                        <option value="refurbished">Yenilenmiş</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Garanti</Form.Label>
                      <Form.Control
                        type="text"
                        value={equipmentSpecs.warranty}
                        onChange={(e) => setEquipmentSpecs({...equipmentSpecs, warranty: e.target.value})}
                        placeholder="Örn: 2 yıl"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Ürün Görselleri</Form.Label>
            <Form.Text className="d-block mb-2 text-muted">
              Görsel dosyalarını seçin. İlk görsel ana görsel olarak kullanılacaktır.
            </Form.Text>
            
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="mb-3"
            />
            
            {uploading && (
              <Alert variant="info" className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                  📤 Görseller yükleniyor...
                </div>
              </Alert>
            )}
            
            {/* Manuel URL Ekleme (Opsiyonel) */}
            <div className="mb-3">
              <Form.Text className="d-block mb-2">
                <strong>Veya</strong> görsel URL'i manuel olarak ekleyin:
              </Form.Text>
              {imageUrls.map((url, index) => (
                <div key={index} className="mb-2">
                  <Row className="align-items-center">
                    <Col md={1}>
                      <Badge bg={index === 0 ? 'success' : 'secondary'}>
                        {index === 0 ? '⭐' : `#${index + 1}`}
                      </Badge>
                    </Col>
                    <Col md={9}>
                      <Form.Control
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        size="sm"
                      />
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleImageUrlRemove(index)}
                        disabled={imageUrls.length === 1}
                      >
                        🗑️
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleImageUrlAdd}
                className="mt-2"
              >
                ➕ URL Ekle
              </Button>
            </div>
            
            {/* Görsel Önizleme */}
            {imageUrls.some(url => url.trim() !== '') && (
              <Row className="mt-3 g-3">
                {imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                  <Col key={index} md={3}>
                    <Card className="border">
                      <div className="position-relative">
                        <Card.Img 
                          variant="top" 
                          src={url} 
                          style={{ height: '150px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Görsel+Yüklenemedi'
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-2"
                          onClick={() => handleImageUrlRemove(index)}
                          style={{ opacity: 0.9 }}
                        >
                          ✕
                        </Button>
                      </div>
                      <Card.Body className="p-2 text-center">
                        <Badge bg={index === 0 ? 'success' : 'secondary'}>
                          {index === 0 ? '⭐ Ana Görsel' : `Görsel ${index + 1}`}
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              label="Ürünü aktif olarak yayınla"
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="success" size="lg" className="px-5">
              {product ? '💾 Güncelle' : '➕ Oluştur'}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
              ❌ İptal
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ProductForm