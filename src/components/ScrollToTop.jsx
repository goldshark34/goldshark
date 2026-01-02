import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Sayfa değiştiğinde en üste çık
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Anında geçiş için
    })
  }, [pathname])

  return null
}

export default ScrollToTop