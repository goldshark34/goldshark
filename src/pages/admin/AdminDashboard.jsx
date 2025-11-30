import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login')
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const stats = [
    { 
      title: 'Toplam Bot', 
      value: '0', 
      change: '0',
      changeType: 'neutral',
      icon: '🚤', 
      color: 'primary',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      title: 'Aktif İlanlar', 
      value: '0', 
      change: '0',
      changeType: 'neutral',
      icon: '📊', 
      color: 'success',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      title: 'Toplam Satış', 
      value: '0 €', 
      change: '0%',
      changeType: 'neutral',
      icon: '💰', 
      color: 'warning',
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      title: 'Yeni Mesajlar', 
      value: '0', 
      change: '0 okunmadı',
      changeType: 'neutral',
      icon: '✉️', 
      color: 'info',
      bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ]

  const recentActivities = [
    { action: 'Yeni bot eklendi', item: 'Rib Boat 8.5m', time: '5 dk önce', type: 'success' },
    { action: 'Bot güncellendi', item: 'Rib Boat 10m', time: '1 saat önce', type: 'info' },
    { action: 'Yeni mesaj', item: 'Müşteri talebi', time: '2 saat önce', type: 'warning' },
    { action: 'Satış tamamlandı', item: 'Ekipman Seti', time: '3 saat önce', type: 'success' }
  ]

  const quickActions = [
    { 
      title: 'Bot Yönetimi', 
      icon: '🚤', 
      desc: 'Bot ekle, düzenle veya sil', 
      link: '/admin/products',
      color: 'warning',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      title: 'Kategori Yönetimi', 
      icon: '📂', 
      desc: 'Kategorileri düzenle', 
      link: '/admin/categories',
      color: 'info',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      title: 'Mesajlar', 
      icon: '💬', 
      desc: 'Müşteri mesajlarını görüntüle', 
      link: '/admin/messages',
      color: 'success',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      title: 'Raporlar', 
      icon: '📈', 
      desc: 'Satış ve istatistikleri gör', 
      link: '/admin/reports',
      color: 'danger',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ]

  return (
    <div className="admin-dashboard bg-light min-vh-100">
      {/* Top Bar */}
      <div className="bg-dark text-white py-3 shadow-sm">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0 fw-bold">
                <img 
                  src="https://img.sanishtech.com/u/08b7b90d54b686b1efdb75a49ab7a9e8.png" 
                  alt="Logo" 
                  style={{ width: '30px', height: '30px', objectFit: 'contain', marginRight: '8px' }}
                />
                Admin Dashboard
              </h4>
            </Col>
            <Col className="text-end">
              <Badge bg="warning" text="dark" className="me-2 px-3 py-2">
                👤 {user?.email || 'Admin'}
              </Badge>
              <Badge bg="info" text="dark" className="me-3 px-3 py-2">
                🕐 {currentTime.toLocaleTimeString('tr-TR')}
              </Badge>
              <Button variant="outline-light" size="sm" className="me-2" onClick={() => navigate('/')}>
                Ana Sayfa →
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                🚪 Çıkış
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Welcome Section */}
        <Card className="border-0 shadow-sm mb-4" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h2 className="fw-bold mb-2">Hoş Geldiniz, Admin! 👋</h2>
                <p className="mb-0 opacity-90">
                  Bugün {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </Col>
              <Col md={4} className="text-end">
                <Button variant="light" size="lg" className="fw-bold">
                  📊 Detaylı Rapor
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Stats Cards */}
        <Row className="mb-4">
          {stats.map((stat, index) => (
            <Col key={index} lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100 hover-lift" style={{ 
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px',
                        background: stat.bgGradient
                      }}
                    >
                      <span className="fs-2">{stat.icon}</span>
                    </div>
                    <Badge 
                      bg={stat.changeType === 'increase' ? 'success' : 'secondary'} 
                      className="px-2 py-1"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="fw-bold mb-1">{stat.value}</h3>
                  <p className="text-muted mb-0 small">{stat.title}</p>
                  <ProgressBar 
                    now={75} 
                    className="mt-3" 
                    style={{ height: '4px' }}
                    variant={stat.color}
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {/* Quick Actions */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">⚡ Hızlı İşlemler</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  {quickActions.map((action, index) => (
                    <Col key={index} md={6}>
                      <Card 
                        className="border-0 h-100 hover-lift" 
                        style={{ 
                          background: action.gradient,
                          color: 'white',
                          transition: 'transform 0.3s',
                          cursor: 'pointer'
                        }}
                        onClick={() => navigate(action.link)}
                      >
                        <Card.Body className="p-4 text-center">
                          <div className="fs-1 mb-3">{action.icon}</div>
                          <Card.Title className="fw-bold mb-2">{action.title}</Card.Title>
                          <Card.Text className="small opacity-90 mb-3">
                            {action.desc}
                          </Card.Text>
                          <Button variant="light" size="sm" className="fw-bold">
                            Yönet →
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Recent Activities */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">📋 Son Aktiviteler</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="list-group-item border-0 py-3">
                      <div className="d-flex align-items-start">
                        <Badge 
                          bg={activity.type} 
                          className="me-3 mt-1"
                          style={{ width: '8px', height: '8px', padding: '0', borderRadius: '50%' }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-semibold small">{activity.action}</div>
                          <div className="text-muted small">{activity.item}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-top">
                  <Button variant="link" size="sm" className="text-decoration-none">
                    Tümünü Gör →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  )
}

export default AdminDashboard