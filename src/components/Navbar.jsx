import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiCalendar } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Logo from './common/Logo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Browse Cars', to: '/cars' },
    { label: 'Bookings', to: user ? '/my-bookings' : '/login' },
    { label: 'Account', to: user ? '/account' : '/login' },
  ]

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const isActive = (to) => location.pathname === to

  return (
    <nav style={{ background: '#0a0a0a', borderBottom: '1px solid #1f2937', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minWidth: 0 }} aria-label="Speed Toyz Cars home">
          <Logo size="lg" />
           </Link>

        {/* Desktop Nav */}
        <div style={{ display: isMobile ? 'none' : 'flex', gap: 32, alignItems: 'center' }}>
          {navLinks.map(l => (
            <Link key={`${l.to}-${l.label}`} to={l.to} style={{ color: isActive(l.to) ? '#ef4444' : '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => { if (!isActive(l.to)) e.target.style.color = '#d1d5db' }}
              onMouseLeave={e => { if (!isActive(l.to)) e.target.style.color = '#9ca3af' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 8, background: 'none', border: '1px solid #374151', borderRadius: 8, padding: isMobile ? '6px 10px' : '6px 14px', cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {user.name?.[0] || 'U'}
                </div>
                {!isMobile && <span style={{ color: '#d1d5db', fontSize: 14 }}>{user.name}</span>}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                    style={{ position: 'absolute', right: 0, top: 44, background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: 8, minWidth: 180, boxShadow: '0 16px 40px rgba(0,0,0,0.6)', zIndex: 50 }}>
                    {user.role === 'admin' && (
                      <button onClick={() => { navigate('/dashboard'); setDropdownOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, border: 'none', background: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <FiSettings size={15} /> Dashboard
                      </button>
                    )}
                    <button onClick={() => { navigate('/account'); setDropdownOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, border: 'none', background: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <FiUser size={15} /> My Account
                    </button>
                    <button onClick={() => { navigate('/my-bookings'); setDropdownOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, border: 'none', background: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <FiCalendar size={15} /> My Bookings
                    </button>
                    <div style={{ height: 1, background: '#1f2937', margin: '4px 0' }} />
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <FiLogOut size={15} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              {!isMobile && <Link to="/login" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Login</Link>}
              <Link to="/register" style={{ background: '#ef4444', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, fontSize: isMobile ? 13 : 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: isMobile ? 'block' : 'none', padding: '4px' }}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ background: '#0a0a0a', borderTop: '1px solid #1f2937', padding: '16px 16px', overflow: 'hidden' }}>
            {navLinks.map(l => (
              <Link key={`${l.to}-${l.label}`} to={l.to} onClick={() => setMenuOpen(false)} style={{ display: 'block', color: isActive(l.to) ? '#ef4444' : '#d1d5db', textDecoration: 'none', padding: '12px 0', fontSize: 15, fontWeight: 500, borderBottom: '1px solid #1f2937' }}>
                {l.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', color: '#d1d5db', textDecoration: 'none', padding: '12px 0', fontSize: 15, fontWeight: 500, borderBottom: '1px solid #1f2937' }}>
                  Login
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
