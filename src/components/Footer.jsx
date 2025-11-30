import React from 'react'
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light mt-5">
      {/* Newsletter Section */}
      <div className="py-5" style={{ background: 'linear-gradient(135deg, #1A3B5D 0%, #0A1F3A 100%)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h3 className="fw-bold text-white mb-2">📧 Bültenimize Abone Olun</h3>
              <p className="text-light opacity-75 mb-0">
                Yeni ürünler ve özel fırsatlardan haberdar olun
              </p>
            </Col>
            <Col lg={6}>
              <InputGroup size="lg">
                <Form.Control
                  placeholder="E-posta adresiniz"
                  className="border-0"
                  style={{ borderRadius: '10px 0 0 10px' }}
                />
                <Button 
                  variant="light" 
                  className="fw-bold px-4"
                  style={{ borderRadius: '0 10px 10px 0' }}
                >
                  Abone Ol →
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Footer */}
      <div className="py-5">
        <Container>
          <Row className="g-4">
            {/* Company Info */}
            <Col lg={4} md={6}>
              <div className="d-flex align-items-center mb-3">
                <img 
                  src="https://img.sanishtech.com/u/08b7b90d54b686b1efdb75a49ab7a9e8.png" 
                  alt="Gold Shark Yatçılık Logo" 
                  style={{ 
                    width: '50px', 
                    height: '50px',
                    objectFit: 'contain',
                    marginRight: '12px'
                  }}
                />
                <div>
                  <h5 className="text-white fw-bold mb-0">GOLD SHARK YATÇILIK</h5>
                  <small className="text-light opacity-75">Tekne Üretim ve Satış</small>
                </div>
              </div>
              <p className="text-light opacity-75 mb-4">
                Tekne üretim ve satış konusunda Türkiye'nin önde gelen firması. 
                25 yıllık deneyimimizle hizmetinizdeyiz.
              </p>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                >
                  📘
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                >
                  📷
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                >
                  🐦
                </Button>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                >
                  💼
                </Button>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6}>
              <h6 className="text-white fw-bold mb-3">Hızlı Bağlantılar</h6>
              <div className="d-flex flex-column gap-2">
                <Link to="/" className="text-light opacity-75 text-decoration-none hover-link">
                  → Ana Sayfa
                </Link>
                <Link to="/products" className="text-light opacity-75 text-decoration-none hover-link">
                  → Ürünler
                </Link>
                <a href="#services" className="text-light opacity-75 text-decoration-none hover-link">
                  → Hizmetler
                </a>
                <a href="#maintenance" className="text-light opacity-75 text-decoration-none hover-link">
                  → Bakım ve Onarım
                </a>
                <a href="#dealers" className="text-light opacity-75 text-decoration-none hover-link">
                  → Bayilerimiz
                </a>
              </div>
            </Col>

            {/* Services */}
            <Col lg={3} md={6}>
              <h6 className="text-white fw-bold mb-3">Hizmetlerimiz</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link">
                  🛥️ Tekne Üretimi
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link">
                  🌊 Tekne Satışı
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link">
                  🔧 Bakım & Onarım
                </a>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link">
                  📋 Danışmanlık
                </a>
              </div>
            </Col>

            {/* Contact */}
            <Col lg={3} md={6}>
              <h6 className="text-white fw-bold mb-3">İletişim</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-start">
                  <span className="me-2">📍</span>
                  <div className="text-light opacity-75 small">
                    Camikebir mah. 7. sokak<br />
                    No: 7/2 Seferihisar/İzmir
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">📞</span>
                  <a href="tel:+905533686635" className="text-light opacity-75 text-decoration-none hover-link">
                    0553 368 66 35
                  </a>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">✉️</span>
                  <a href="mailto:goldsharkyachting.34@gmail.com" className="text-light opacity-75 text-decoration-none hover-link">
                    goldsharkyachting.34@gmail.com
                  </a>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">🕐</span>
                  <div className="text-light opacity-75 small">
                    Haftanın 7 Günü: 09:00 - 22:00
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-top border-secondary py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-light opacity-75 small">
                © {currentYear} Gold Shark Yatçılık. Tüm hakları saklıdır.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-3">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link small">
                  Gizlilik Politikası
                </a>
                <span className="text-light opacity-50">|</span>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link small">
                  Kullanım Koşulları
                </a>
                <span className="text-light opacity-50">|</span>
                <a href="#" className="text-light opacity-75 text-decoration-none hover-link small">
                  Çerez Politikası
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <style>{`
        .hover-link {
          transition: all 0.3s ease;
        }
        .hover-link:hover {
          opacity: 1 !important;
          color: #FFFFFF !important;
          transform: translateX(5px);
        }
      `}</style>
    </footer>
  )
}

export default Footer