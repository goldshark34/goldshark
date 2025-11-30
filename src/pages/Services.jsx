import { Container, Row, Col, Card } from 'react-bootstrap'

const Services = () => {
  const services = [
    {
      icon: '🛥️',
      title: 'Tekne Üretimi',
      description: 'Özel tasarım ve üretim hizmetleri ile hayalinizdeki tekneyi gerçeğe dönüştürüyoruz.',
      features: ['Özel Tasarım', 'Kaliteli Malzeme', 'Uzman Ekip', 'Garanti']
    },
    {
      icon: '🌊',
      title: 'Tekne Satışı',
      description: 'Geniş ürün yelpazemiz ile ihtiyacınıza uygun tekneyi bulmanıza yardımcı oluyoruz.',
      features: ['Rib Boat', 'Malzeme ve Ekipman', 'Uygun Fiyat', 'Hızlı Teslimat']
    },
    {
      icon: '🔧',
      title: 'Bakım & Onarım',
      description: 'Teknenizin bakım ve onarım ihtiyaçları için profesyonel hizmet sunuyoruz.',
      features: ['Periyodik Bakım', 'Onarım', 'Yedek Parça', '7/24 Destek']
    },
    {
      icon: '📋',
      title: 'Danışmanlık',
      description: 'Tekne alımı ve kullanımı konusunda uzman danışmanlık hizmeti veriyoruz.',
      features: ['Ürün Seçimi', 'Teknik Destek', 'Eğitim', 'Dokümantasyon']
    }
  ]

  return (
    <div className="services-page bg-light min-vh-100">
      {/* Page Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Hizmetlerimiz</h1>
          <p className="fs-5 opacity-75">Tekne üretiminden satışa, bakımdan danışmanlığa kadar tüm hizmetler</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          {services.map((service, index) => (
            <Col key={index} lg={6}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <Card.Body className="p-4">
                  <div className="fs-1 mb-3">{service.icon}</div>
                  <Card.Title className="fw-bold fs-3 mb-3">{service.title}</Card.Title>
                  <Card.Text className="text-muted mb-4">{service.description}</Card.Text>
                  <ul className="list-unstyled">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="mb-2">
                        <span className="text-primary me-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* CTA Section */}
        <Card className="border-0 shadow-sm mt-5 bg-dark text-white">
          <Card.Body className="p-5 text-center">
            <h3 className="fw-bold mb-3">Hizmetlerimiz Hakkında Detaylı Bilgi</h3>
            <p className="mb-4 opacity-75">
              Size en uygun hizmeti bulmak için bizimle iletişime geçin
            </p>
            <a href="#contact" className="btn btn-light btn-lg fw-bold px-5">
              Bizimle İletişime Geçin
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

export default Services
