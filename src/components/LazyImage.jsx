import { useState, useRef, useEffect } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  placeholder = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, start loading
            loadImage()
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before image comes into view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [src])

  const loadImage = () => {
    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
      setHasError(false)
      console.log('✅ Image loaded:', src)
    }
    
    img.onerror = () => {
      setHasError(true)
      setIsLoading(false)
      console.warn('❌ Image failed to load:', src)
      // Keep placeholder image
    }
    
    img.src = src
  }

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{ 
        position: 'relative',
        overflow: 'hidden',
        ...style 
      }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`lazy-image ${isLoading ? 'loading' : ''} ${hasError ? 'error' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0.7 : 1,
          filter: isLoading ? 'blur(2px)' : 'none'
        }}
        {...props}
      />
      
      {isLoading && (
        <div 
          className="loading-overlay"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            fontWeight: 'bold',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            pointerEvents: 'none'
          }}
        >
          📸 Yükleniyor...
        </div>
      )}
      
      {hasError && (
        <div 
          className="error-overlay"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            fontWeight: 'bold',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            pointerEvents: 'none'
          }}
        >
          🖼️ Varsayılan Görsel
        </div>
      )}
    </div>
  )
}

export default LazyImage