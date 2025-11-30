import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // LocalStorage'dan kullanıcıyı kontrol et
    const savedUser = localStorage.getItem('adminAuth')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('adminAuth')
      }
    }

    // Mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Auth state değişikliklerini dinle
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      // Test için basit admin girişi
      if (email === 'admin@luxuryyachts.com' && password === 'admin123') {
        const mockUser = {
          id: '1',
          email: 'admin@luxuryyachts.com',
          role: 'admin'
        }
        setUser(mockUser)
        localStorage.setItem('adminAuth', JSON.stringify(mockUser))
        return { success: true, data: mockUser }
      }

      // Supabase ile giriş denemesi
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        // Supabase hatası varsa test kullanıcısı öner
        return { 
          success: false, 
          message: 'Giriş başarısız. Test için: admin@luxuryyachts.com / admin123' 
        }
      }
      
      localStorage.setItem('adminAuth', JSON.stringify(data.user))
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Giriş başarısız. Test için: admin@luxuryyachts.com / admin123'
      }
    }
  }

  const logout = async () => {
    localStorage.removeItem('adminAuth')
    setUser(null)
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Logout error:', error)
  }

  const value = {
    user,
    login,
    logout,
    isAdmin: user?.email === 'admin@site.com' // Veya rol bazlı kontrol
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}