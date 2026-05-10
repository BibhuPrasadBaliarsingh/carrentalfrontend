import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/UI'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
