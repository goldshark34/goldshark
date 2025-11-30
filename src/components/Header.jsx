import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Container, Button, Badge, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      sticky="top" 
      className={`py-3 transition-all ${scrolled ? 'shadow-lg' : ''}`}
      style={{ 
        transition: 'all 0.3s ease',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        backgroundColor: scrolled ? 'rgba(10, 31, 58, 0.95) !important' : undefined
      }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="d-flex align-items-center"
          style={{ transition: 'transform 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img 
            src="https://img.sanishtech.com/u/08b7b90d54b686b1efdb75a49ab7a9e8.png" 
            alt="Gold Shark Yatçılık Logo" 
            style={{ 
              width: '70px', 
              height: '70px',
              objectFit: 'contain',
              marginRight: '12px'
            }}
          />
          <div>
            <div className="fw-bold fs-5 text-white" style={{ letterSpacing: '1px' }}>
              GOLD SHARK YATÇILIK
            </div>
            <small className="text-light opacity-75">
              {language === 'tr' ? 'Tekne Üretim ve Satış' : 'Boat Manufacturing & Sales'}
            </small>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`fw-semibold px-3 position-relative ${isActive('/') ? 'text-white' : ''}`}
              style={{ transition: 'color 0.3s' }}
            >
              🏠 {t('nav.home')}
              {isActive('/') && (
                <div 
                  className="position-absolute bottom-0 start-50 translate-middle-x bg-white"
                  style={{ width: '30px', height: '3px', borderRadius: '3px' }}
                />
              )}
            </Nav.Link>
            
            <NavDropdown 
              title={<span>🛥️ {t('nav.products')}</span>}
              id="products-dropdown"
              className="fw-semibold"
            >
              <NavDropdown.Item as={Link} to="/rib-boat">
                <span style={{ marginRight: '8px' }}>🚤</span> {t('nav.ribBoat')}
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/equipment">
                <span style={{ marginRight: '8px' }}>⚙️</span> {t('nav.equipment')}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/products">
                <span style={{ marginRight: '8px' }}>📋</span> {t('nav.allProducts')}
              </NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link 
              as={Link} 
              to="/services" 
              className={`fw-semibold px-3 ${isActive('/services') ? 'text-white' : ''}`}
            >
              ⚙️ {t('nav.services')}
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/maintenance" 
              className={`fw-semibold px-3 ${isActive('/maintenance') ? 'text-white' : ''}`}
            >
              🔧 {t('nav.maintenance')}
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/dealers" 
              className={`fw-semibold px-3 ${isActive('/dealers') ? 'text-white' : ''}`}
            >
              🤝 {t('nav.dealers')}
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={`fw-semibold px-3 ${isActive('/contact') ? 'text-white' : ''}`}
            >
              📞 {t('nav.contact')}
            </Nav.Link>

            <div className="d-flex gap-2 ms-lg-3 mt-3 mt-lg-0">
              <Button 
                variant="outline-light" 
                size="sm"
                className="fw-bold"
                onClick={toggleLanguage}
              >
                🌐 {language === 'tr' ? 'TR' : 'EN'}
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style>{`
        #products-dropdown {
          color: rgba(255, 255, 255, 0.75) !important;
        }
        #products-dropdown:hover {
          color: rgba(255, 255, 255, 1) !important;
        }
        .dropdown-menu {
          background-color: #0A1F3A !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .dropdown-item {
          color: rgba(255, 255, 255, 0.75) !important;
          transition: all 0.3s ease;
        }
        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: #FFFFFF !important;
        }
        .dropdown-divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </Navbar>
  )
}

export default Header