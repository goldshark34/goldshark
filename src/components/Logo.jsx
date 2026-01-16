import React from 'react'

const Logo = ({ width = 70, height = 70, className = "", style = {} }) => {
  // Yeni logo URL'si
  const logoUrl = "https://img.sanishtech.com/u/899c1a0738c3b7bac71f9bd547d661ad.jpg"
  
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