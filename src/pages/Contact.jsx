import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form gönderme işlemi burada yapılacak
    alert('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page bg-light min-vh-100">
      {/* Page Header */}
      <div className="bg-dark text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">İletişim</h1>
          <p className="fs-5 opacity-75">Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          {/* Contact Form */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4">Bize Mesaj Gönderin</h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Adınız Soyadınız *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Adınız Soyadınız"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>E-posta *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ornek@email.com"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+90 (5xx) xxx xx xx"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Konu *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Konu Seçin</option>
                          <option value="urun">Ürün Bilgisi</option>
                          <option value="bakim">Bakım ve Onarım</option>
                          <option value="bayilik">Bayilik</option>
                          <option value="diger">Diğer</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Mesajınız *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Mesajınızı buraya yazın..."
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold">
                        Gönder
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Info */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">İletişim Bilgileri</h4>
                
                <div className="mb-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="fs-4 me-3">📍</div>
                    <div>
                      <h6 className="fw-bold mb-1">Adres</h6>
                      <p className="text-muted mb-0">
                        Camikebir mah. 7. sokak<br />
                        No: 7/2 Seferihisar/İzmir
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div className="fs-4 me-3">📞</div>
                    <div>
                      <h6 className="fw-bold mb-1">Telefon</h6>
                      <a href="tel:+905533686635" className="text-decoration-none">
                        0553 368 66 35
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-3">
                    <div className="fs-4 me-3">✉️</div>
                    <div>
                      <h6 className="fw-bold mb-1">E-posta</h6>
                      <a href="mailto:pinarmarin@gmail.com" className="text-decoration-none">
                        pinarmarin@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="fs-4 me-3">🕐</div>
                    <div>
                      <h6 className="fw-bold mb-1">Çalışma Saatleri</h6>
                      <p className="text-muted mb-0">
                        Haftanın 7 Günü<br />
                        09:00 - 22:00
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">📱 Sosyal Medya</h5>
                <p className="text-muted mb-3">Bizi sosyal medyada takip edin!</p>
                <div className="d-flex gap-2">
                  <Button 
                    as="a"
                    href="https://www.instagram.com/goldsharkyachting/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-danger" 
                    className="rounded-circle d-flex align-items-center justify-content-center p-0" 
                    style={{ width: '45px', height: '45px', border: 'none' }}
                    title="Instagram'da Takip Edin"
                  >
                    <img 
                      src="https://img.freepik.com/premium-vector/instagram-icon_768467-672.jpg?semt=ais_hybrid&w=740&q=80"
                      alt="Instagram"
                      style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                    />
                  </Button>
                  <Button 
                    as="a"
                    href="https://www.facebook.com/share/14XoFoTZdxG/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-primary" 
                    className="rounded-circle d-flex align-items-center justify-content-center p-0" 
                    style={{ width: '45px', height: '45px', border: 'none' }}
                    title="Facebook'ta Takip Edin"
                  >
                    <img 
                      src="https://img.freepik.com/premium-vector/blue-social-media-logo_197792-1759.jpg?semt=ais_hybrid&w=740&q=80"
                      alt="Facebook"
                      style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                    />
                  </Button>
                </div>
                <small className="text-muted mt-2 d-block">
                  @goldsharkyachting
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Map Section */}
        <Card className="border-0 shadow-sm mt-4">
          <Card.Header className="bg-primary text-white py-3">
            <h5 className="mb-0 fw-bold">📍 Konumumuz</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div style={{ height: '400px', position: 'relative' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d26.8397!3d38.1975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd862a1234567%3A0x1234567890abcdef!2sCamikebir%20Mah.%207.%20Sk.%20No%3A7%2F2%2C%2035460%20Seferihisar%2F%C4%B0zmir!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gold Shark Yatçılık Konum"
              ></iframe>
              
              {/* Harita Üzerinde Bilgi Kartı */}
              <div 
                className="position-absolute bg-white shadow-lg rounded p-3"
                style={{ 
                  top: '20px', 
                  left: '20px', 
                  maxWidth: '300px',
                  zIndex: 1000
                }}
              >
                <h6 className="fw-bold mb-2 text-primary">🏢 Gold Shark Yatçılık</h6>
                <p className="small mb-2 text-muted">
                  📍 Camikebir mah. 7. sokak, No: 7/2<br />
                  Seferihisar/İzmir
                </p>
                <div className="d-flex gap-2">
                  <a 
                    href="https://maps.app.goo.gl/a53K6kzDrk4zS6ts5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    🗺️ Yol Tarifi
                  </a>
                  <a 
                    href="tel:+905533686635" 
                    className="btn btn-success btn-sm"
                  >
                    📞 Ara
                  </a>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Contact
