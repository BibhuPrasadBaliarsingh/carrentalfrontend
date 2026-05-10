import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { MainLayout, DashboardLayout } from './layouts/Layouts'
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute'

import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import CarDetailPage from './pages/CarDetailPage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminDashboard from './pages/AdminDashboard'
import { LoginPage, RegisterPage } from './pages/AuthPages'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cars" element={<BrowsePage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected user routes */}
            <Route path="/booking/:id" element={
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
            } />
          </Route>

          {/* Admin dashboard - no main layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/*" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
