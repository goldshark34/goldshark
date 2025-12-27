import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap'
import { productService } from '../services/productService'

const RibBoat = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRibBoats()
    
    // Her 5 saniyede bir ürünleri yenile
    const interval = setInterval(() => {
      loadRibBoats()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadRibBoats = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      console.log('📦 Tüm ürünler:', data)
      
      // Sadece Rib Boat kategorisindeki ürünleri filtrele
      const ribBoats = data.filter(product => {
        const categoryName = product.Categories?.name || product.categoryName
        console.log(`Ürün: ${product.ProductName}, Kategori: ${categoryName}`)
        return categoryName === 'Rib Boat'
      })
      
      console.log('🚤 Rib Boat ürünleri:', ribBoats)
      setProducts(ribBoats)
    } catch (error) {
      console.error('Rib Boat ürünleri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rib-boat-page bg-light min-vh-100">
      {/* Page Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">🚤 Rib Boat</h1>
          <p className="fs-5 opacity-75">Rijit şişme tekneler - Dayanıklı ve güvenli</p>
        </Container>
      </div>

      <Container className="py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Ürünler yükleniyor...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <div className="fs-1 mb-3">🚤</div>
            <h4 className="text-muted">Henüz Rib Boat ürünü bulunmamaktadır</h4>
            <p className="text-muted">Yakında yeni ürünler eklenecektir</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-muted">
                <strong>{products.length}</strong> Rib Boat ürünü bulundu
              </p>
            </div>

            <Row className="g-4">
              {products.map((product) => (
                <Col key={product.ProductID} lg={4} md={6}>
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
                      <Card.Img 
                        variant="top" 
                        src={product.ProductImages?.[0]?.ImageURL || product.ProductImages?.[0]?.imageurl || product.image || 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'}
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                      <Badge bg="primary" className="position-absolute top-0 start-0 m-3 px-3 py-2">
                        Rib Boat
                      </Badge>
                    </div>
                    
                    <Card.Body className="p-4">
                      <Card.Title className="fw-bold mb-3">{product.ProductName || product.name}</Card.Title>
                      
                      {product.ShortDescription && (
                        <p className="text-muted small mb-3">{product.ShortDescription}</p>
                      )}
                      
                      <div className="mb-3">
                        <Row className="g-2 text-muted small">
                          {product.Specifications?.width && (
                            <Col xs={12} className="mb-1">
                              <strong>En (Genişlik):</strong> {product.Specifications.width}
                            </Col>
                          )}
                          {product.Specifications?.length && (
                            <Col xs={12} className="mb-1">
                              <strong>Boy (Uzunluk):</strong> {product.Specifications.length}
                            </Col>
                          )}
                          {product.Specifications?.weight && (
                            <Col xs={12} className="mb-1">
                              <strong>Ağırlık:</strong> {product.Specifications.weight}
                            </Col>
                          )}
                          {product.Specifications?.passengerCapacity && (
                            <Col xs={12} className="mb-1">
                              <strong>Yolcu Kapasitesi:</strong> {product.Specifications.passengerCapacity}
                            </Col>
                          )}
                          {product.Specifications?.emptyWeight && (
                            <Col xs={12} className="mb-1">
                              <strong>Boş Ağırlık:</strong> {product.Specifications.emptyWeight}
                            </Col>
                          )}
                          {product.Specifications?.fullWeight && (
                            <Col xs={12} className="mb-1">
                              <strong>Dolu Ağırlık:</strong> {product.Specifications.fullWeight}
                            </Col>
                          )}
                          {product.Specifications?.enginePower && (
                            <Col xs={12} className="mb-1">
                              <strong>Motor Gücü:</strong> {product.Specifications.enginePower}
                            </Col>
                          )}
                        </Row>
                      </div>
                      
                      <hr className="my-3" />
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold fs-5 text-primary">
                            {product.Price ? `${product.Price.toLocaleString('tr-TR')} €` : 'Fiyat Belirtilmemiş'}
                          </div>
                        </div>
                        <Button variant="primary" className="fw-bold">
                          Detaylar →
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>

      <style>{`
        .hover-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(93, 211, 211, 0.2) !important;
        }
      `}</style>
    </div>
  )
}

export default RibBoat
