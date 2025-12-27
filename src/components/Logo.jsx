import React from 'react'

const Logo = ({ width = 70, height = 70, className = "", style = {} }) => {
  // Eski logo URL'si
  const logoUrl = "https://img.sanishtech.com/u/08b7b90d54b686b1efdb75a49ab7a9e8.png"
  
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