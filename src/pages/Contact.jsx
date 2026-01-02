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
                    className="rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '45px', height: '45px' }}
                    title="Instagram'da Takip Edin"
                  >
                    📷
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '45px', height: '45px', opacity: 0.5 }}
                    disabled
                    title="Yakında"
                  >
                    📘
                  </Button>
                  <Button 
                    variant="outline-info" 
                    className="rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '45px', height: '45px', opacity: 0.5 }}
                    disabled
                    title="Yakında"
                  >
                    🐦
                  </Button>
                  <Button 
                    variant="outline-dark" 
                    className="rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '45px', height: '45px', opacity: 0.5 }}
                    disabled
                    title="Yakında"
                  >
                    💼
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
          <Card.Body className="p-0">
            <div style={{ height: '400px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="text-center">
                <div className="fs-1 mb-3">🗺️</div>
                <p className="text-muted">Harita buraya eklenecek</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Contact
