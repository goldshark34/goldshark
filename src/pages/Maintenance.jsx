import { Container, Row, Col, Card, Button } from 'react-bootstrap'

const Maintenance = () => {
  const maintenanceServices = [
    {
      title: 'Periyodik Bakım',
      description: 'Teknenizin uzun ömürlü olması için düzenli bakım hizmetleri',
      icon: '🔧',
      services: ['Motor Bakımı', 'Elektrik Kontrol', 'Gövde Temizliği', 'Sistem Kontrolü']
    },
    {
      title: 'Onarım Hizmetleri',
      description: 'Profesyonel ekibimizle her türlü onarım işlemi',
      icon: '🛠️',
      services: ['Motor Onarımı', 'Gövde Onarımı', 'Elektrik Onarımı', 'Acil Müdahale']
    },
    {
      title: 'Yedek Parça',
      description: 'Orijinal ve kaliteli yedek parça tedariki',
      icon: '⚙️',
      services: ['Motor Parçaları', 'Elektrik Malzemeleri', 'Gövde Parçaları', 'Hızlı Tedarik']
    },
    {
      title: 'Kış Bakımı',
      description: 'Teknenizi kış sezonuna hazırlama hizmetleri',
      icon: '❄️',
      services: ['Kaplama', 'Depolama', 'Koruma', 'Sezon Hazırlığı']
    }
  ]

  return (
    <div className="maintenance-page bg-light min-vh-100">
      {/* Page Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Bakım ve Onarım</h1>
          <p className="fs-5 opacity-75">Tekneniz için profesyonel bakım ve onarım hizmetleri</p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Info Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="fw-bold mb-4">Neden Bizi Seçmelisiniz?</h2>
            <p className="text-muted fs-5">
              25 yıllık deneyimimiz ve uzman ekibimizle teknenizin bakım ve onarım ihtiyaçlarını 
              en kaliteli şekilde karşılıyoruz. 7/24 destek hattımızla her zaman yanınızdayız.
            </p>
          </Col>
        </Row>

        {/* Services Grid */}
        <Row className="g-4 mb-5">
          {maintenanceServices.map((service, index) => (
            <Col key={index} lg={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="p-4">
                  <div className="fs-1 mb-3">{service.icon}</div>
                  <Card.Title className="fw-bold fs-4 mb-3">{service.title}</Card.Title>
                  <Card.Text className="text-muted mb-4">{service.description}</Card.Text>
                  <ul className="list-unstyled">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        <span className="text-primary me-2">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Features */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">⚡</div>
              <h5 className="fw-bold">Hızlı Servis</h5>
              <p className="text-muted mb-0">Acil durumlarda 24 saat içinde müdahale</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">🎯</div>
              <h5 className="fw-bold">Uzman Ekip</h5>
              <p className="text-muted mb-0">Sertifikalı ve deneyimli teknisyenler</p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div className="fs-1 mb-3">💯</div>
              <h5 className="fw-bold">Garanti</h5>
              <p className="text-muted mb-0">Tüm işlemlerimizde garanti</p>
            </Card>
          </Col>
        </Row>

        {/* CTA Section */}
        <Card className="border-0 shadow-sm bg-dark text-white">
          <Card.Body className="p-5 text-center">
            <h3 className="fw-bold mb-3">Tekneniz Bakıma mı İhtiyaç Duyuyor?</h3>
            <p className="mb-4 opacity-75">
              Hemen bizimle iletişime geçin, ücretsiz keşif ve fiyat teklifi alın
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="light" size="lg" className="fw-bold px-5">
                📞 Hemen Ara
              </Button>
              <Button variant="outline-light" size="lg" className="fw-bold px-5">
                📧 Randevu Al
              </Button>
            </div>
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

export default Maintenance
