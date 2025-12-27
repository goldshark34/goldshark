import React from 'react'

const Logo = ({ width = 70, height = 70, className = "", style = {} }) => {
  // Yeni logo URL'si
  const logoUrl = "https://i.ibb.co/Z1chvfxy/Ekran-g-r-nt-s-2025-11-29-172417-Photoroom.png"
  
  return (
    <img 
      src={logoUrl}
      alt="Gold Shark Yatçılık Logo" 
      className={className}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        objectFit: 'contain',
        ...style
      }}
      onError={(e) => {
        // Eğer logo yüklenmezse fallback logo kullan
        console.warn('Logo yüklenemedi, fallback kullanılıyor')
        e.target.src = "/vite.svg"
      }}
    />
  )
}

export default Logo