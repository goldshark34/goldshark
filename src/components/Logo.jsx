import React from 'react'

const Logo = ({ width = 70, height = 70, className = "", style = {} }) => {
  // Yeni logo URL'si
  const logoUrl = "https://img.sanishtech.com/u/d8f847772a55382e7fba8bb8b16ac21a.png"
  
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