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

  useEffect(() => {
    const rehydrate = async () => {
      const stored = localStorage.getItem('speedtoyz_user')
      const token = localStorage.getItem('speedtoyz_token')
      if (!stored || !token) {
        setLoading(false)
        return
      }
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        const res = await authAPI.me()
        if (res?.data?.user) setUser(res.data.user)
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem('speedtoyz_token')
          localStorage.removeItem('speedtoyz_user')
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    rehydrate()
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
    localStorage.removeItem('speedtoyz_user_bookings')
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
