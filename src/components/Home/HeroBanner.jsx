import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HeroBanner = () => {
  const [showVideo, setShowVideo] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(false)
    }, 5000) // 5 saniye sonra video gizlenecek

    return () => clearTimeout(timer)
  }, [])

  const skipIntro = () => {
    setShowVideo(false)
  }

  return (
    <>
      {showVideo && (
        <div className="video-intro">
          <video autoPlay muted onEnded={() => setShowVideo(false)}>
            <source src="/assets/videos/yat-intro.mp4" type="video/mp4" />
          </video>
          <button className="skip-btn" onClick={skipIntro}>
            Skip Intro
          </button>
        </div>
      )}
      
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Lüks Yat Dünyasında Yeni Standartlar</h1>
          <p>En seçkin yat koleksiyonumuzla hayalinizdeki deniz macerasını yaşayın</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Yatları Keşfet
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Danışmanlık Al
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/images/hero-yacht.jpg" alt="Lüks Yat" />
        </div>
      </section>
    </>
  )
}

export default HeroBanner