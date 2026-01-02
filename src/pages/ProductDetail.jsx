import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Spinner, Carousel } from 'react-bootstrap'
import { productService } from '../services/productService'
import { useLanguage } from '../context/LanguageContext'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      setLoading(true)
      console.log('🔍 Ürün detayı yükleniyor, slug:', slug)
      
      const data = await productService.getProductBySlug(slug)
      console.log('📦 Ürün detayı:', data)
      
      if (!data) {
        setError('Ürün bulunamadı')
        return
      }
      
      setProduct(data)
      setError(null)
    } catch (err) {
      console.error('❌ Ürün detayı yüklenirken hata:', err)
      setError('Ürün yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Ürün detayları yükleniyor...</p>
        </div>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <div className="fs-1 mb-3">❌</div>
          <h4 className="text-danger mb-3">{error || 'Ürün bulunamadı'}</h4>
          <Button variant="primary" onClick={() => navigate('/products')}>
            ← Ürünlere Dön
          </Button>
        </div>
      </Container>
    )
  }

  const images = product.ProductImages || []
  const specs = product.Specifications || {}

  return (
    <div className="product-detail-page bg-light min-vh-100">
      {/* Breadcrumb */}
      <div className="bg-dark text-white py-3">
        <Container>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Button variant="link" className="text-white p-0" onClick={() => navigate('/')}>
                  Ana Sayfa
                </Button>
              </li>
              <li className="breadcrumb-item">
                <Button variant="link" className="text-white p-0" onClick={() => navigate('/products')}>
                  Ürünler
                </Button>
              </li>
              <li className="breadcrumb-item active text-warning" aria-current="page">
                {product.ProductName}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-5">
          {/* Ürün Görselleri */}
          <Col lg={6}>
            {images.length > 0 ? (
              <Carousel className="product-carousel">
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image.imageurl || image.ImageURL}
                      alt={`${product.ProductName} - Görsel ${index + 1}`}
                      style={{ height: '500px', objectFit: 'cover', borderRadius: '15px' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <Card className="border-0 shadow-sm">
                <Card.Img
                  variant="top"
                  src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  style={{ height: '500px', objectFit: 'cover' }}
                />
              </Card>
            )}
          </Col>

          {/* Ürün Bilgileri */}
          <Col lg={6}>
            <div className="product-info">
              <Badge bg="primary" className="mb-3 px-3 py-2">
                {product.Categories?.name || 'Genel'}
              </Badge>
              
              <h1 className="display-5 fw-bold mb-3">{product.ProductName}</h1>
              
              {product.ShortDescription && (
                <p className="fs-5 text-muted mb-4">{product.ShortDescription}</p>
              )}
              
              <div className="price-section mb-4">
                <div className="fs-2 fw-bold text-primary">
                  {product.Price ? `${product.Price.toLocaleString('tr-TR')} €` : 'Fiyat Belirtilmemiş'}
                </div>
                {product.Stock > 0 && (
                  <Badge bg="success" className="mt-2">
                    ✅ Stokta Var ({product.Stock} adet)
                  </Badge>
                )}
              </div>

              {/* Özellikler */}
              {Object.keys(specs).length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">📋 Teknik Özellikler</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row className="g-3">
                      {specs.width && (
                        <Col md={6}>
                          <strong>En (Genişlik):</strong> {specs.width}
                        </Col>
                      )}
                      {specs.length && (
                        <Col md={6}>
                          <strong>Boy (Uzunluk):</strong> {specs.length}
                        </Col>
                      )}
                      {specs.weight && (
                        <Col md={6}>
                          <strong>Ağırlık:</strong> {specs.weight}
                        </Col>
                      )}
                      {specs.passengerCapacity && (
                        <Col md={6}>
                          <strong>Yolcu Kapasitesi:</strong> {specs.passengerCapacity}
                        </Col>
                      )}
                      {specs.emptyWeight && (
                        <Col md={6}>
                          <strong>Boş Ağırlık:</strong> {specs.emptyWeight}
                        </Col>
                      )}
                      {specs.fullWeight && (
                        <Col md={6}>
                          <strong>Dolu Ağırlık:</strong> {specs.fullWeight}
                        </Col>
                      )}
                      {specs.enginePower && (
                        <Col md={6}>
                          <strong>Motor Gücü:</strong> {specs.enginePower}
                        </Col>
                      )}
                      {specs.brand && (
                        <Col md={6}>
                          <strong>Marka:</strong> {specs.brand}
                        </Col>
                      )}
                      {specs.model && (
                        <Col md={6}>
                          <strong>Model:</strong> {specs.model}
                        </Col>
                      )}
                      {specs.condition && (
                        <Col md={6}>
                          <strong>Durum:</strong> {
                            specs.condition === 'new' ? 'Yeni' :
                            specs.condition === 'used' ? 'İkinci El' : 'Yenilenmiş'
                          }
                        </Col>
                      )}
                      {specs.warranty && (
                        <Col md={6}>
                          <strong>Garanti:</strong> {specs.warranty}
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* İletişim Butonları */}
              <div className="contact-buttons d-flex gap-3 mb-4">
                <Button 
                  as="a" 
                  href="tel:+905533686635" 
                  variant="success" 
                  size="lg" 
                  className="flex-fill"
                >
                  📞 Hemen Ara
                </Button>
                <Button 
                  as="a" 
                  href={`https://wa.me/905533686635?text=${encodeURIComponent(`Merhaba, ${product.ProductName} hakkında bilgi almak istiyorum.`)}`}
                  target="_blank"
                  variant="success" 
                  size="lg" 
                  className="flex-fill"
                >
                  💬 WhatsApp
                </Button>
              </div>

              <Button 
                variant="outline-primary" 
                size="lg" 
                className="w-100"
                onClick={() => navigate('/contact')}
              >
                ✉️ Detaylı Bilgi Al
              </Button>
            </div>
          </Col>
        </Row>

        {/* Detaylı Açıklama */}
        {product.Description && (
          <Row className="mt-5">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-dark text-white">
                  <h4 className="mb-0">📝 Detaylı Açıklama</h4>
                </Card.Header>
                <Card.Body className="p-4">
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {product.Description}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <style>{`
        .product-carousel .carousel-control-prev,
        .product-carousel .carousel-control-next {
          background-color: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
        .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

export default ProductDetail