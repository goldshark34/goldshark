import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Spinner } from 'react-bootstrap'
import { productService } from '../services/productService'

const Products = () => {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [yachts, setYachts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      console.log('📦 Products sayfası - Gelen veri:', data)
      
      // Veritabanından gelen veriyi frontend formatına çevir
      const formattedYachts = data.map(product => {
        const specs = product.Specifications || {}
        return {
          id: product.ProductID,
          name: product.ProductName,
          price: product.Price || 0,
          priceText: product.Price ? `${product.Price.toLocaleString('tr-TR')} €` : 'Fiyat Belirtilmemiş',
          type: (specs.type || product.ProductType || 'Sale').toLowerCase(),
          typeText: (specs.type || product.ProductType) === 'Sale' ? 'Satılık' : 'Kiralık',
          // Yeni özellikler
          width: specs.width || '',
          length: specs.length || '',
          weight: specs.weight || '',
          capacity: specs.passengerCapacity || '',
          emptyWeight: specs.emptyWeight || '',
          fullWeight: specs.fullWeight || '',
          enginePower: specs.enginePower || '',
          // Eski özellikler (geriye dönük uyumluluk için)
          year: specs.year || product.Year || new Date().getFullYear().toString(),
          cabins: specs.cabins || product.Cabins || '',
          speed: specs.speed || product.Speed || '',
          image: product.ProductImages?.[0]?.ImageURL || product.ProductImages?.[0]?.imageurl || 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          category: product.Categories?.name || product.categoryName || 'Genel',
          shortDescription: product.ShortDescription || ''
        }
      })
      
      console.log('✅ Formatlanmış ürünler:', formattedYachts)
      setYachts(formattedYachts)
      setError(null)
    } catch (err) {
      console.error('❌ Ürünler yüklenirken hata:', err)
      setError('Ürünler yüklenirken bir hata oluştu')
      // Hata durumunda boş liste göster
      setYachts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredYachts = yachts
.filter(yacht => filter === 'all' || yacht.type === filter)
.filter(yacht => yacht.name?.toLowerCase().includes(searchTerm?.toLowerCase() || ''))
.sort((a, b) => {
if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
if (sortBy === 'year') return (b.year || '').toString().localeCompare((a.year || '').toString())
return 0
})

  return (
    <div className="products-page bg-light">
      {/* Page Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Ürün Koleksiyonumuz</h1>
          <p className="fs-5 opacity-75">Tekne ve ekipmanlar arasından size en uygun olanı seçin</p>
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Ürünler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-3">⚠️</div>
            <h4 className="text-danger mb-3">{error}</h4>
            <p className="text-muted mb-4">Örnek veriler gösteriliyor</p>
            <Button variant="warning" onClick={loadProducts}>
              Tekrar Dene
            </Button>
          </div>
        ) : null}

        {/* Filters & Search */}
        {!loading && <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <Row className="g-3 align-items-center">
              <Col lg={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
                  <Form.Control
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col lg={4}>
                <Form.Select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="fw-semibold"
                >
                  <option value="all">Tüm Ürünler</option>
                  <option value="sale">Satılık</option>
                </Form.Select>
              </Col>
              <Col lg={4}>
                <Form.Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="fw-semibold"
                >
                  <option value="name">İsme Göre</option>
                  <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
                  <option value="year">Yıla Göre</option>
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>}

        {/* Results Count */}
        {!loading && <div className="mb-4">
          <p className="text-muted">
            <strong>{filteredYachts.length}</strong> ürün bulundu
          </p>
        </div>}

        {/* Yacht Grid */}
        {!loading && <Row className="g-4">
          {filteredYachts.map((yacht, index) => (
            <Col key={yacht.id || index} lg={4} md={6}>
              <Card className="h-100 border-0 shadow-sm overflow-hidden yacht-card">
                <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
                  <Card.Img 
                    variant="top" 
                    src={yacht.image} 
                    style={{ height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    className="yacht-image"
                  />
                  <Badge 
                    bg="success"
                    className="position-absolute top-0 start-0 m-3 px-3 py-2"
                  >
                    Satılık
                  </Badge>
                  <Badge 
                    bg="dark" 
                    className="position-absolute top-0 end-0 m-3 px-3 py-2"
                  >
                    {yacht.year}
                  </Badge>
                </div>
                
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <Card.Title className="fw-bold mb-1">{yacht.name}</Card.Title>
                      <small className="text-muted">📅 {yacht.year}</small>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Row className="g-2 text-muted small">
                      {yacht.width && (
                        <Col xs={12} className="mb-1">
                          <strong>En:</strong> {yacht.width}
                        </Col>
                      )}
                      {yacht.length && (
                        <Col xs={12} className="mb-1">
                          <strong>Boy:</strong> {yacht.length}
                        </Col>
                      )}
                      {yacht.weight && (
                        <Col xs={12} className="mb-1">
                          <strong>Ağırlık:</strong> {yacht.weight}
                        </Col>
                      )}
                      {yacht.capacity && (
                        <Col xs={12} className="mb-1">
                          <strong>Kapasite:</strong> {yacht.capacity}
                        </Col>
                      )}
                      {yacht.enginePower && (
                        <Col xs={12} className="mb-1">
                          <strong>Motor Gücü:</strong> {yacht.enginePower}
                        </Col>
                      )}
                    </Row>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold fs-5 text-warning">{yacht.priceText}</div>
                    </div>
                    <Button variant="dark" className="fw-bold">
                      Detaylar →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>}

        {!loading && filteredYachts.length === 0 && (
          <div className="text-center py-5">
            <div className="fs-1 mb-3">🔍</div>
            <h4 className="text-muted">Aradığınız kriterlere uygun ürün bulunamadı</h4>
            <p className="text-muted">Lütfen farklı filtreler deneyin</p>
          </div>
        )}

        {/* CTA Section */}
        {!loading && <Card className="border-0 shadow-sm mt-5 bg-dark text-white">
          <Card.Body className="p-5 text-center">
            <h3 className="fw-bold mb-3">Aradığınız Ürünü Bulamadınız mı?</h3>
            <p className="mb-4 opacity-75">
              Uzman ekibimiz size özel ürün bulma konusunda yardımcı olabilir
            </p>
            <Button variant="light" size="lg" className="fw-bold px-5">
              Bizimle İletişime Geçin
            </Button>
          </Card.Body>
        </Card>}
      </Container>

      <style>{`
        .yacht-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .yacht-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
        }
        .yacht-card:hover .yacht-image {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

export default Products