import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages'
import AccountPage from './pages/AccountPage'
import ContactPage from './pages/ContactPage'
import { TermsPage, PrivacyPage } from './pages/InfoPages'
import NotFoundPage from './pages/NotFoundPage'

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/cars" element={<PageTransition><BrowsePage /></PageTransition>} />
              <Route path="/cars/:id" element={<PageTransition><CarDetailPage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
              <Route path="/reset-password/:token" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />

              <Route path="/account" element={
                <PageTransition><ProtectedRoute><AccountPage /></ProtectedRoute></PageTransition>
              } />
              <Route path="/booking/:id" element={
                <PageTransition><ProtectedRoute><BookingPage /></ProtectedRoute></PageTransition>
              } />
              <Route path="/my-bookings" element={
                <PageTransition><ProtectedRoute><MyBookingsPage /></ProtectedRoute></PageTransition>
              } />
            </Route>

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/*" element={
                <PageTransition><AdminRoute><AdminDashboard /></AdminRoute></PageTransition>
              } />
            </Route>

            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </ToastProvider>
    </AuthProvider>
  )
}
