import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('speedtoyz_user')
    const token = localStorage.getItem('speedtoyz_token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = useCallback((userData, token) => {
    setUser(userData)
    localStorage.setItem('speedtoyz_user', JSON.stringify(userData))
    localStorage.setItem('speedtoyz_token', token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('speedtoyz_user')
    localStorage.removeItem('speedtoyz_token')
  }, [])

  const updateUser = useCallback((data) => {
    setUser(prev => {
      const updated = { ...prev, ...data }
      localStorage.setItem('speedtoyz_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}
