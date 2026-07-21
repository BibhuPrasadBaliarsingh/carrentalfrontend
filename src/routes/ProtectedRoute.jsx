import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/UI'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login') {
      navigate('/login', { state: { from: location.pathname }, replace: true })
    }
  }, [user, loading, location.pathname, navigate])

  if (loading) return <PageLoader />
  if (!user) return null
  return children
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (location.pathname !== '/login') {
          navigate('/login', { state: { from: location.pathname }, replace: true })
        }
      } else if (user.role !== 'admin') {
        if (location.pathname !== '/') {
          navigate('/', { replace: true })
        }
      }
    }
  }, [user, loading, location.pathname, navigate])

  if (loading) return <PageLoader />
  if (!user || user.role !== 'admin') return null
  return children
}
