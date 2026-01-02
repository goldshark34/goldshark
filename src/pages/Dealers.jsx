import { Container, Row, Col, Card } from 'react-bootstrap'

const Dealers = () => {
  const dealers = [
    {
      name: 'İzmir Bayi',
      address: 'Camikebir mah. 7. sokak, No: 7/2 Seferihisar/İzmir',
      phone: '0553 368 66 35',
      email: 'pinarmarin@gmail.com',
      region: 'Ege'
    },
    {
      name: 'Alaçatı Bayi',
      address: 'Alaçatı Port, Alaçatı/İzmir',
      phone: '0553 368 66 35',
      email: 'pinarmarin@gmail.com',
      region: 'Ege'
    },
    {
      name: 'Çeşme Bayi',
      address: 'Pınar Marina, 1034 Sok. No: 34 Çeşme/İzmir',
      phone: '0553 368 66 35',
      email: 'pinarmarin@gmail.com',
      region: 'Ege'
    }
  ]

  const regions = [...new Set(dealers.map(d => d.region))]

  return (
    <div className="dealers-page bg-light min-vh-100">
      {/* Page Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Bayilerimiz</h1>
          <p className="fs-5 opacity-75">Türkiye genelinde hizmet veren yetkili bayilerimiz</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Info Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="fw-bold mb-4">Türkiye Genelinde Hizmetinizdeyiz</h2>
            <p className="text-muted fs-5">
              Yetkili bayilerimiz aracılığıyla Türkiye'nin her yerinde kaliteli hizmet sunuyoruz. 
              Size en yakın bayimizi bulun ve ihtiyaçlarınız için bizimle iletişime geçin.
            </p>
          </Col>
        </Row>

        {/* All Dealers */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4 text-primary">Tüm Bayiler</h3>
          <Row className="g-4">
            {dealers.map((dealer, index) => (
              <Col key={index} lg={4} md={6}>
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <span className="text-white fs-4">🏢</span>
                      </div>
                      <div>
                        <Card.Title className="fw-bold mb-0">{dealer.name}</Card.Title>
                        <small className="text-muted">{dealer.region}</small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <span className="me-2">📍</span>
                        <small className="text-muted">{dealer.address}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2">📞</span>
                        <a href={`tel:${dealer.phone}`} className="text-decoration-none">
                          <small>{dealer.phone}</small>
                        </a>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2">✉️</span>
                        <a href={`mailto:${dealer.email}`} className="text-decoration-none">
                          <small>{dealer.email}</small>
                        </a>
                      </div>
                    </div>

                    <div className="d-grid">
                      <a href={`tel:${dealer.phone}`} className="btn btn-primary btn-sm">
                        İletişime Geç
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-sm mt-5 bg-dark text-white">
          <Card.Body className="p-5 text-center">
            <h3 className="fw-bold mb-3">Bayi Olmak İster misiniz?</h3>
            <p className="mb-4 opacity-75">
              Gold Shark Yatçılık bayilik ağına katılmak için bizimle iletişime geçin
            </p>
            <a href="mailto:pinarmarin@gmail.com" className="btn btn-light btn-lg fw-bold px-5">
              Bayilik Başvurusu
            </a>
          </Card.Body>
        </Card>
      </Container>

      <style>{`
        .hover-card {
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}

export default Dealers
