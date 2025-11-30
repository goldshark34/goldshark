import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.message || 'Giriş başarısız')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="admin-login-page min-vh-100 d-flex align-items-center" 
         style={{ 
           background: 'linear-gradient(135deg, #0A1F3A 0%, #1A3B5D 100%)',
           position: 'relative',
           overflow: 'hidden'
         }}>
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" style={{ 
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)',
        opacity: 0.3
      }} />
      
      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              {/* Header */}
              <div className="bg-dark text-white text-center py-5">
                <img 
                  src="https://img.sanishtech.com/u/08b7b90d54b686b1efdb75a49ab7a9e8.png" 
                  alt="Logo" 
                  style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem' }}
                />
                <h2 className="fw-bold mb-2">Admin Panel</h2>
                <p className="text-white mb-0">Gold Shark Yatçılık Yönetim Sistemi</p>
              </div>

              <Card.Body className="p-5">
                {/* Test Credentials Info */}
                <Alert variant="info" className="mb-4">
                  <div className="fw-bold mb-2">🧪 Test Giriş Bilgileri:</div>
                  <small>
                    <strong>E-posta:</strong> admin@goldshark.com<br />
                    <strong>Şifre:</strong> admin123
                  </small>
                </Alert>

                {error && (
                  <Alert variant="danger" className="d-flex align-items-center" dismissible onClose={() => setError('')}>
                    <span className="me-2">⚠️</span>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      <span className="me-2">📧</span>E-posta Adresi
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@goldshark.com"
                      required
                      size="lg"
                      className="border-2"
                      style={{ borderRadius: '10px' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      <span className="me-2">🔒</span>Şifre
                    </Form.Label>
                    <InputGroup size="lg">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="border-2"
                        style={{ borderRadius: '10px 0 0 10px' }}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderRadius: '0 10px 10px 0' }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="checkbox"
                      label="Beni hatırla"
                      className="text-muted"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="warning"
                    size="lg"
                    className="w-100 fw-bold py-3"
                    disabled={loading}
                    style={{ borderRadius: '10px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Giriş Yapılıyor...
                      </>
                    ) : (
                      <>
                        <span className="me-2">🚀</span>
                        Giriş Yap
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Şifrenizi mi unuttunuz? 
                    <a href="#" className="text-warning text-decoration-none ms-1 fw-semibold">
                      Sıfırla
                    </a>
                  </small>
                </div>
              </Card.Body>

              {/* Footer */}
              <div className="bg-light text-center py-3 border-top">
                <small className="text-muted">
                  🔒 Güvenli bağlantı ile korunmaktadır
                </small>
              </div>
            </Card>

            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-white text-decoration-none"
                onClick={() => navigate('/')}
              >
                ← Ana Sayfaya Dön
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminLogin