import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { useLanguage } from '../context/LanguageContext'
import Logo from '../components/Logo'
import LazyImage from '../components/LazyImage'

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [featuredYachts, setFeaturedYachts] = useState([])
  const { t } = useLanguage()

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonTextKey: "home.hero.ribBoat",
      buttonLink: "/rib-boat",
      icon: "🚤"
    },
    {
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonTextKey: "home.hero.equipment",
      buttonLink: "/equipment",
      icon: "⚙️"
    },
    {
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      buttonTextKey: "home.hero.allProducts",
      buttonLink: "/products",
      icon: "🛥️"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3)
    }, 5000)
    
    // Ürünleri hemen yükle (cache-first)
    loadFeaturedYachts()
    
    // Auto-refresh'i başlat (3 dakika)
    productService.startAutoRefresh()
    
    // Background refresh'leri dinle
    const handleProductsUpdated = (event) => {
      console.log('🔄 Products updated event received:', event.detail.source)
      loadFeaturedYachts()
    }
    
    window.addEventListener('productsUpdated', handleProductsUpdated)
    
    return () => {
      clearInterval(timer)
      productService.stopAutoRefresh()
      window.removeEventListener('productsUpdated', handleProductsUpdated)
    }
  }, [])
  
  // Debug: featuredYachts değiştiğinde konsola yaz
  useEffect(() => {
    console.log('🎯 featuredYachts state güncellendi:', featuredYachts)
  }, [featuredYachts])

  const loadFeaturedYachts = async () => {
    const startTime = performance.now()
    
    try {
      console.log('� Anaasayfa: Ürünler yükleniyor (Cache-First)...')
      const data = await productService.getAllProducts()
      
      const loadTime = performance.now() - startTime
      console.log(`⚡ Anasayfa: Ürünler ${loadTime.toFixed(2)}ms'de yüklendi`)
      console.log('📦 Anasayfa: Gelen ürün sayısı:', data?.length || 0)
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Anasayfa: Hiç ürün bulunamadı')
        setFeaturedYachts([])
        return
      }
      
      // İlk 3 ürünü öne çıkan olarak göster
      const featured = []
      const productsToShow = data.slice(0, 3)
      
      for (let i = 0; i < productsToShow.length; i++) {
        const product = productsToShow[i]
        
        const imageUrl = product.ProductImages?.[0]?.ImageURL || 
                        product.ProductImages?.[0]?.imageurl || 
                        'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        
        featured.push({
          id: product.ProductID,
          slug: product.Slug || `product-${product.ProductID}`,
          name: product.ProductName,
          price: product.Price ? `${product.Price.toLocaleString('tr-TR')} €` : t('product.priceNotSpecified'),
          type: product.ProductType === 'Sale' ? t('product.forSale') : t('product.forRent'),
          year: product.Year || new Date().getFullYear().toString(),
          length: product.Length || t('common.notSpecified'),
          image: imageUrl,
          specifications: product.Specifications || {},
          featured: true
        })
      }
      
      console.log('✅ Anasayfa: Öne çıkan ürünler hazırlandı:', featured.length, 'adet')
      
      // Smooth update - sadece değişiklik varsa güncelle
      setFeaturedYachts(prevYachts => {
        const hasChanges = JSON.stringify(prevYachts) !== JSON.stringify(featured)
        if (hasChanges) {
          console.log('🔄 Anasayfa: Ürünler güncellendi')
          return [...featured]
        }
        console.log('✨ Anasayfa: Ürünler değişmedi, güncelleme atlandı')
        return prevYachts
      })
      
    } catch (error) {
      console.error('❌ Anasayfa: Öne çıkan ürünler yüklenirken hata:', error)
      // Hata durumunda mevcut state'i koru
      if (featuredYachts.length === 0) {
        setFeaturedYachts([])
      }
    }
  }

  const features = [
    { icon: "🚤",  titleKey: "home.features.premium", descKey: "home.features.premiumDesc" },
    { icon: "🌊", titleKey: "home.features.experience", descKey: "home.features.experienceDesc" },
    { icon: "🔒", titleKey: "home.features.secure", descKey: "home.features.secureDesc" },
    { icon: "🌍", titleKey: "home.features.global", descKey: "home.features.globalDesc" }
  ]

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <div className="hero-slider position-relative" style={{ height: '85vh', overflow: 'hidden' }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide position-absolute w-100 h-100 transition-opacity ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(10, 31, 58, 0.5), rgba(10, 31, 58, 0.7)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'opacity 1s ease-in-out'
            }}
          >
            <Container className="h-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <div className="mb-4">
                  <span className="fs-1" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {slide.icon}
                  </span>
                </div>
                <Button 
                  as={Link} 
                  to={slide.buttonLink} 
                  className="fw-bold px-5 py-3 fs-4 border-0"
                  style={{
                    backgroundColor: '#20c997',
                    color: '#0a1f3a',
                    boxShadow: '0 8px 24px rgba(32, 201, 151, 0.4)',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1ab386'
                    e.target.style.transform = 'translateY(-3px)'
                    e.target.style.boxShadow = '0 12px 32px rgba(32, 201, 151, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#20c997'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 8px 24px rgba(32, 201, 151, 0.4)'
                  }}
                >
                  {t(slide.buttonTextKey)} →
                </Button>
              </div>
            </Container>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="d-flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className="border-0 rounded-pill"
                style={{ 
                  width: '50px', 
                  height: '5px', 
                  cursor: 'pointer',
                  backgroundColor: index === activeSlide ? '#20c997' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease',
                  boxShadow: index === activeSlide ? '0 0 10px rgba(32, 201, 151, 0.8)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <Container className="py-5 my-5">
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} lg={3} md={6}>
              <Card className="border-0 shadow-sm h-100 text-center p-4 hover-lift" style={{ transition: 'transform 0.3s' }}>
                <div className="fs-1 mb-3">{feature.icon}</div>
                <Card.Title className="fw-bold">{t(feature.titleKey)}</Card.Title>
                <Card.Text className="text-muted">{t(feature.descKey)}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Products */}
      <div className="bg-light py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">{t('home.featured.title')}</h2>
            <p className="text-muted fs-5">{t('home.featured.subtitle')}</p>
          </div>
          
          {featuredYachts.length === 0 ? (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">🚤</div>
              <h4 className="text-muted">{t('home.featured.noProducts')}</h4>
              <p className="text-muted">{t('home.featured.comingSoon')}</p>
            </div>
          ) : (
            <Row className="g-4">
              {featuredYachts.map((yacht) => (
                <Col key={yacht.id} lg={4} md={6}>
                  <Card className="border-0 shadow h-100 overflow-hidden" style={{ transition: 'transform 0.3s' }}>
                    <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
                      <LazyImage
                        src={yacht.image}
                        alt={yacht.name}
                        style={{ height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        className="hover-zoom"
                      />
                      <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-3 px-3 py-2">
                        {yacht.type}
                      </Badge>
                    </div>
                    <Card.Body className="p-4">
                      <Card.Title className="fw-bold fs-4 mb-3">{yacht.name}</Card.Title>
                      
                      <div className="text-muted small mb-3">
                        {/* Rib Boat Özellikleri */}
                        {yacht.specifications?.width && (
                          <div className="mb-1"><strong>{t('spec.width')}:</strong> {yacht.specifications.width}</div>
                        )}
                        {yacht.specifications?.length && (
                          <div className="mb-1"><strong>{t('spec.length')}:</strong> {yacht.specifications.length}</div>
                        )}
                        {yacht.specifications?.weight && (
                          <div className="mb-1"><strong>{t('spec.weight')}:</strong> {yacht.specifications.weight}</div>
                        )}
                        {yacht.specifications?.passengerCapacity && (
                          <div className="mb-1"><strong>{t('spec.capacity')}:</strong> {yacht.specifications.passengerCapacity}</div>
                        )}
                        {yacht.specifications?.emptyWeight && (
                          <div className="mb-1"><strong>{t('spec.emptyWeight')}:</strong> {yacht.specifications.emptyWeight}</div>
                        )}
                        {yacht.specifications?.fullWeight && (
                          <div className="mb-1"><strong>{t('spec.fullWeight')}:</strong> {yacht.specifications.fullWeight}</div>
                        )}
                        {yacht.specifications?.enginePower && (
                          <div className="mb-1"><strong>{t('spec.enginePower')}:</strong> {yacht.specifications.enginePower}</div>
                        )}
                        
                        {/* Ekipman ve Malzemeler Özellikleri */}
                        {yacht.specifications?.brand && (
                          <div className="mb-1"><strong>{t('spec.brand')}:</strong> {yacht.specifications.brand}</div>
                        )}
                        {yacht.specifications?.model && (
                          <div className="mb-1"><strong>{t('spec.model')}:</strong> {yacht.specifications.model}</div>
                        )}
                        {yacht.specifications?.condition && (
                          <div className="mb-1">
                            <strong>{t('spec.condition')}:</strong>{' '}
                            {t(`condition.${yacht.specifications.condition}`)}
                          </div>
                        )}
                        {yacht.specifications?.warranty && (
                          <div className="mb-1"><strong>{t('spec.warranty')}:</strong> {yacht.specifications.warranty}</div>
                        )}
                        {yacht.specifications?.material && (
                          <div className="mb-1"><strong>{t('spec.material')}:</strong> {yacht.specifications.material}</div>
                        )}
                        {yacht.specifications?.color && (
                          <div className="mb-1"><strong>{t('spec.color')}:</strong> {yacht.specifications.color}</div>
                        )}
                        {yacht.specifications?.dimensions && (
                          <div className="mb-1"><strong>{t('spec.dimensions')}:</strong> {yacht.specifications.dimensions}</div>
                        )}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div>
                          <div className="fw-bold fs-4 text-warning">{yacht.price}</div>
                        </div>
                        <Button 
                          as={Link} 
                          to={`/product/${yacht.slug || yacht.id}`}
                          variant="dark" 
                          className="fw-bold"
                        >
                          {t('product.details')} →
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          <div className="text-center mt-5">
            <Button as={Link} to="/products" variant="primary" size="lg" className="fw-bold px-5 py-3">
              {t('home.featured.viewAll')}
            </Button>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="py-5 my-5">
        <Card className="border-0 shadow-lg overflow-hidden">
          <Row className="g-0">
            <Col md={6}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  background: 'linear-gradient(135deg, #0a1f3a 0%, #1a3a5a 100%)',
                  height: '100%',
                  minHeight: '400px'
                }}
              >
                <Logo width={200} height={200} />
              </div>
            </Col>
            <Col md={6}>
              <Card.Body className="p-5 d-flex flex-column justify-content-center h-100">
                <h3 className="display-6 fw-bold mb-4">{t('home.cta.title')}</h3>
                <p className="text-muted fs-5 mb-4">
                  {t('home.cta.description')}
                </p>
                <div className="d-flex gap-3">
                  <Button 
                    as="a" 
                    href="tel:+905533686635" 
                    variant="primary" 
                    size="lg" 
                    className="fw-bold"
                  >
                    📞 {t('home.cta.call')}
                  </Button>
                  <Button 
                    as={Link} 
                    to="/contact" 
                    variant="outline-dark" 
                    size="lg" 
                    className="fw-bold"
                  >
                    ✉️ {t('home.cta.message')}
                  </Button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-10px);
        }
        .hover-zoom:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  )
}

export default Home