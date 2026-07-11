import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGrid, FiTruck, FiCalendar, FiUsers, FiTrendingUp, FiSettings, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiMenu, FiX, FiToggleLeft, FiToggleRight, FiUpload } from 'react-icons/fi'
import { StatCard, StatusBadge, Modal, Input, PageLoader } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { dashboardAPI, carsAPI, bookingsAPI, usersAPI, settingsAPI } from '../services/api'
import { MOCK_CARS, MOCK_STATS } from '../data/mockData'
import Logo from '../components/common/Logo'
import { formatPrice } from '../utils/format'
import { API_URL } from '../config'

const fmt = formatPrice
const EMPTY_CAR = { name: '', brand: '', category: 'Sports', pricePerDay: '', fuelType: 'Petrol', seats: '', transmission: 'Automatic', description: '' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const [activePage, setActivePage] = useState('overview')
  const [stats, setStats] = useState(MOCK_STATS)
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddCar, setShowAddCar] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  const [editingCarId, setEditingCarId] = useState(null)
  const [savingCar, setSavingCar] = useState(false)
  const [carImageFiles, setCarImageFiles] = useState([])
  const [newCar, setNewCar] = useState(EMPTY_CAR)
  const [settings, setSettings] = useState({
    platformName: 'SpeedToyz',
    supportEmail: 'support@speedtoyz.com',
    currency: 'INR (₹)',
    taxRate: 8,
    brands: ['Ferrari', 'Mercedes', 'Land Rover', 'Porsche', 'BMW', 'Tesla', 'Lamborghini', 'Audi', 'McLaren'],
    categories: ['Sports', 'Luxury', 'SUV', 'Electric', 'Supercar', 'Convertible', 'Sedan'],
  })
  const [savingSettings, setSavingSettings] = useState(false)
  const [newBrand, setNewBrand] = useState('')
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
      if (window.innerWidth < 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, carsRes, bookingsRes, usersRes] = await Promise.all([
          dashboardAPI.stats(),
          carsAPI.getAll({ limit: 100 }),
          bookingsAPI.getAll({ limit: 100 }),
          usersAPI.getAll({ limit: 100 }),
        ])
        setStats(statsRes.data.stats || statsRes.data)
        setCars(carsRes.data.cars || carsRes.data)
        setBookings(bookingsRes.data.bookings || [])
        setUsers(usersRes.data.users || [])
      } catch {
        setDemoMode(true)
        setCars(MOCK_CARS)
        setStats(MOCK_STATS)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    settingsAPI.get().then(res => setSettings(res.data.settings || settings)).catch(() => {})
  }, [])

  if (loading) return <PageLoader />

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>Access Denied</h2>
          <p style={{ color: '#6b7280', margin: '10px 0 24px' }}>Admin privileges required.</p>
          <button onClick={() => navigate('/')} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '10px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Go Home</button>
        </div>
      </div>
    )
  }

  const sideLinks = [
    { key: 'overview', icon: <FiGrid />, label: 'Dashboard' },
    { key: 'cars', icon: <FiTruck />, label: 'Car Management' },
    { key: 'bookings', icon: <FiCalendar />, label: 'Bookings' },
    { key: 'users', icon: <FiUsers />, label: 'Users' },
    { key: 'analytics', icon: <FiTrendingUp />, label: 'Analytics' },
    { key: 'settings', icon: <FiSettings />, label: 'Settings' },
  ]

  const barData = stats.revenueByMonth || MOCK_STATS.revenueByMonth
  const maxBar = Math.max(...barData.map(d => d.revenue))

  const handleDeleteCar = async (id) => {
    if (!confirm('Delete this car?')) return
    try {
      await carsAPI.delete(id)
      setCars(prev => prev.filter(c => c._id !== id))
      addToast('Car deleted', 'info')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not delete this car.', 'error')
    }
  }

  const handleToggleAvailability = async (car) => {
    try {
      const res = await carsAPI.toggleAvailability(car._id)
      const updated = res.data.car || res.data
      setCars(prev => prev.map(c => c._id === car._id ? updated : c))
      addToast(updated.available ? 'Car marked as available' : 'Car marked as unavailable', 'info')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not update availability.', 'error')
    }
  }

  const openAddCar = () => { setEditingCarId(null); setNewCar(EMPTY_CAR); setCarImageFiles([]); setShowAddCar(true) }

  const openEditCar = (car) => {
    setEditingCarId(car._id)
    setNewCar({ name: car.name || '', brand: car.brand || '', category: car.category || 'Sports', pricePerDay: car.pricePerDay ?? '', fuelType: car.fuelType || 'Petrol', seats: car.seats ?? '', transmission: car.transmission || 'Automatic', description: car.description || '' })
    setCarImageFiles([])
    setShowAddCar(true)
  }

  const handleSaveCar = async () => {
    if (!newCar.name || !newCar.brand || !newCar.pricePerDay || !newCar.seats || !newCar.description) { addToast('Please fill in all required fields', 'error'); return }
    setSavingCar(true)
    try {
      const formData = new FormData()
      Object.entries(newCar).forEach(([k, v]) => formData.append(k, v))
      carImageFiles.forEach(file => formData.append('images', file))
      if (editingCarId) {
        const res = await carsAPI.update(editingCarId, formData)
        setCars(prev => prev.map(c => c._id === editingCarId ? (res.data.car || res.data) : c))
        addToast('Car updated!', 'success')
      } else {
        const res = await carsAPI.create(formData)
        setCars(prev => [res.data.car || res.data, ...prev])
        addToast('Car added!', 'success')
      }
      setShowAddCar(false); setEditingCarId(null); setCarImageFiles([]); setNewCar(EMPTY_CAR)
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not save car.', 'error')
    } finally {
      setSavingCar(false)
    }
  }

  const handleCancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      const res = await bookingsAPI.cancel(id)
      setBookings(prev => prev.map(bk => bk._id === id ? { ...bk, ...(res.data.booking || res.data) } : bk))
      addToast('Booking cancelled', 'info')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not cancel booking.', 'error')
    }
  }

  const handleBookingStatusChange = async (id, status) => {
    try {
      const res = await bookingsAPI.updateStatus(id, status)
      setBookings(prev => prev.map(bk => bk._id === id ? { ...bk, ...(res.data.booking || res.data) } : bk))
      addToast(`Booking marked as ${status}`, 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not update status.', 'error')
    }
  }

  const handleToggleBan = async (u) => {
    try {
      const res = await usersAPI.ban(u._id)
      const updated = res.data.user || res.data
      setUsers(prev => prev.map(uu => uu._id === u._id ? { ...uu, ...updated } : uu))
      addToast(updated.isBanned ? 'User banned' : 'User unbanned', 'info')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not update user.', 'error')
    }
  }

  const handleDeleteUser = async (u) => {
    if (!confirm(`Delete user ${u.name}?`)) return
    try {
      await usersAPI.delete(u._id)
      setUsers(prev => prev.filter(uu => uu._id !== u._id))
      addToast('User deleted', 'info')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not delete user.', 'error')
    }
  }

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      const res = await settingsAPI.update(settings)
      setSettings(res.data.settings || settings)
      addToast('Settings saved!', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not save settings.', 'error')
    } finally {
      setSavingSettings(false)
    }
  }

  const addBrand = () => {
    const value = newBrand.trim()
    if (!value) { addToast('Enter a brand name', 'error'); return }
    if (settings.brands.includes(value)) { addToast('Brand already exists', 'error'); return }
    setSettings(s => ({ ...s, brands: [...s.brands, value] }))
    setNewBrand('')
  }

  const updateBrand = (index, value) => {
    setSettings(s => ({ ...s, brands: s.brands.map((item, idx) => idx === index ? value : item) }))
  }

  const removeBrand = (index) => {
    setSettings(s => ({ ...s, brands: s.brands.filter((_, idx) => idx !== index) }))
  }

  const addCategory = () => {
    const value = newCategory.trim()
    if (!value) { addToast('Enter a car type', 'error'); return }
    if (settings.categories.includes(value)) { addToast('Car type already exists', 'error'); return }
    setSettings(s => ({ ...s, categories: [...s.categories, value] }))
    setNewCategory('')
  }

  const updateCategory = (index, value) => {
    setSettings(s => ({ ...s, categories: s.categories.map((item, idx) => idx === index ? value : item) }))
  }

  const removeCategory = (index) => {
    setSettings(s => ({ ...s, categories: s.categories.filter((_, idx) => idx !== index) }))
  }

  const thStyle = { color: '#6b7280', fontSize: 11, fontWeight: 600, textAlign: 'left', padding: '10px 16px', textTransform: 'uppercase', letterSpacing: 1 }
  const tdStyle = { padding: '13px 16px', borderBottom: '1px solid #1a2332' }

  return (
    <div style={{ display: 'flex', background: '#0a0a0a', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }} transition={{ type: 'tween', duration: 0.2 }}
            style={{ width: 224, background: '#050505', borderRight: '1px solid #1f2937', display: 'flex', flexDirection: 'column', position: isTablet ? 'fixed' : 'sticky', top: 0, height: '100vh', zIndex: 50, left: 0 }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1f2937' }}>
              <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div>
                  <Logo size="sm" />
                  <div style={{ color: '#4b5563', fontSize: 12, marginTop: 2 }}>Admin Panel</div>
                </div>
              </button>
            </div>

            <div style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
              {sideLinks.map(({ key, icon, label }) => (
                <button key={key} onClick={() => { setActivePage(key); if (isTablet) setSidebarOpen(false) }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: activePage === key ? 'rgba(239,68,68,0.12)' : 'none', color: activePage === key ? '#ef4444' : '#9ca3af', cursor: 'pointer', fontSize: 14, fontWeight: activePage === key ? 600 : 400, textAlign: 'left', marginBottom: 2, transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (activePage !== key) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#d1d5db' } }}
                  onMouseLeave={e => { if (activePage !== key) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#9ca3af' } }}>
                  <span style={{ fontSize: 16 }}>{icon}</span> {label}
                </button>
              ))}
            </div>

            <div style={{ padding: '16px 14px', borderTop: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{user.name?.[0]}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                  <div style={{ color: '#4b5563', fontSize: 11 }}>Administrator</div>
                </div>
              </div>
              <button onClick={() => { logout(); navigate('/') }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'auto', marginLeft: isTablet && sidebarOpen ? 224 : 0 }}>
        {/* Topbar */}
        <div style={{
          borderBottom: '1px solid #1f2937',
          padding: isMobile ? '12px 16px' : '16px 32px',
          background: '#050505',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: sidebarOpen && !isMobile ? 224 : 0,
          width: sidebarOpen && !isMobile ? 'calc(100% - 224px)' : '100%',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isTablet && (
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}>
                {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            )}
            <img src="/logo.jpeg" alt="Speed Toyz Cars logo" style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
            <div>
              <h1 style={{ color: '#fff', fontSize: isMobile ? 16 : 20, fontWeight: 800, margin: 0 }}>
                {{ overview: 'Dashboard Overview', cars: 'Car Management', bookings: 'All Bookings', users: 'User Management', analytics: 'Analytics', settings: 'Settings' }[activePage]}
              </h1>
              {!isMobile && <p style={{ color: '#4b5563', fontSize: 12, margin: '2px 0 0' }}>Manage your platform efficiently</p>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #374151', color: '#9ca3af', padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <FiExternalLink size={13} /> {isMobile ? 'Live' : 'Live Site'}
            </button>
            {activePage === 'cars' && (
              <button onClick={openAddCar} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ef4444', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap' }}>
                <FiPlus size={14} /> {isMobile ? '' : 'Add Car'}
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: isMobile ? '80px 16px 16px' : '80px 28px 28px' }}>
          {demoMode && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fecaca', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              Showing demo data — could not reach the server.
            </div>
          )}

          {/* ── Overview ─────────────────────────────────────────────────────── */}
          {activePage === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Total Revenue', value: fmt(stats.revenue || MOCK_STATS.revenue), icon: '💰', change: '+12.5%', color: '#ef4444' },
                  { label: 'Total Bookings', value: stats.totalBookings || MOCK_STATS.totalBookings, icon: '📅', change: '+8.2%', color: '#3b82f6' },
                  { label: 'Active Cars', value: stats.activeCars || MOCK_STATS.activeCars, icon: '🚗', change: '+4.1%', color: '#10b981' },
                  { label: 'Total Users', value: (stats.totalUsers || MOCK_STATS.totalUsers).toLocaleString(), icon: '👥', change: '+18.7%', color: '#f59e0b' },
                ].map(s => <StatCard key={s.label} {...s} />)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
                {/* Revenue chart */}
                <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>Revenue Overview</h3>
                    <select style={{ background: '#1f2937', border: '1px solid #374151', color: '#9ca3af', padding: '5px 10px', borderRadius: 6, fontSize: 12, outline: 'none' }}>
                      <option>Last 7 months</option><option>Last year</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
                    {barData.map((d, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: '100%', background: `linear-gradient(to top, #ef4444, rgba(239,68,68,0.4))`, borderRadius: '5px 5px 0 0', height: `${(d.revenue / maxBar) * 140}px`, minHeight: 4, transition: 'height 0.5s ease', cursor: 'pointer', position: 'relative' }}
                          title={`${d.month}: ${fmt(d.revenue)}`} />
                        <span style={{ color: '#6b7280', fontSize: 11 }}>{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fleet distribution */}
                <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 24px' }}>Fleet Distribution</h3>
                  {(stats.fleetDistribution || MOCK_STATS.fleetDistribution).map((d, i) => {
                    const colors = ['#ef4444', '#3b82f6', '#10b981', '#FFD700']
                    const total = (stats.fleetDistribution || MOCK_STATS.fleetDistribution).reduce((s, x) => s + x.count, 0)
                    const pct = Math.round((d.count / total) * 100)
                    return (
                      <div key={d.category} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                          <span style={{ color: '#d1d5db', fontSize: 14 }}>{d.category}</span>
                          <span style={{ color: colors[i], fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ background: '#1f2937', borderRadius: 4, height: 6 }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.7 }}
                            style={{ background: colors[i], height: '100%', borderRadius: 4 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent bookings table */}
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14 }}>
                <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>Recent Bookings</h3>
                  <button onClick={() => setActivePage('bookings')} style={{ background: 'none', border: '1px solid #374151', color: '#9ca3af', padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>View All</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#0f1929', borderBottom: '1px solid #1f2937' }}>
                    {['ID', 'Car', 'Customer', 'Pickup', 'Amount', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr></thead>
                  <tbody>{bookings.slice(0, 5).map(b => (
                    <tr key={b._id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...tdStyle, color: '#6b7280', fontSize: 13 }}>{b._id}</td>
                      <td style={{ ...tdStyle, color: '#fff', fontWeight: 600, fontSize: 14 }}>{b.car?.name?.split(' - ')[0]}</td>
                      <td style={{ ...tdStyle, color: '#d1d5db', fontSize: 13 }}>{b.user?.name}</td>
                      <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 13 }}>{b.pickupDate}</td>
                      <td style={{ ...tdStyle, color: '#ef4444', fontWeight: 700 }}>{fmt(b.totalPrice)}</td>
                      <td style={tdStyle}><StatusBadge status={b.bookingStatus} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
          )}

          {/* ── Car Management ───────────────────────────────────────────────── */}
          {activePage === 'cars' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  ['Total Cars', cars.length, '🚗'],
                  ['Available', cars.filter(c => c.available !== false).length, '✅'],
                  ['Sports', cars.filter(c => c.category === 'Sports').length, '🏎️'],
                  ['Supercars', cars.filter(c => c.category === 'Supercar').length, '⚡'],
                ].map(([l, v, i]) => (
                  <div key={l} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: '16px 20px' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{i}</div>
                    <div style={{ color: '#fff', fontSize: 24, fontWeight: 900 }}>{v}</div>
                    <div style={{ color: '#6b7280', fontSize: 12, marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#0f1929', borderBottom: '1px solid #1f2937' }}>
                    {['Car', 'Brand', 'Category', 'Price/Day', 'Seats', 'Rating', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr></thead>
                  <tbody>{cars.map(car => {
                    const imgSrc = car.images?.[0]?.startsWith('http') ? car.images[0] : car.images?.[0] ? `${API_URL}/uploads/${car.images[0]}` : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100'
                    return (
                      <tr key={car._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 56, height: 38, borderRadius: 7, overflow: 'hidden', flexShrink: 0 }}>
                              <img src={imgSrc} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100' }} />
                            </div>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{car.name?.split(' - ')[0]}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 13 }}>{car.brand}</td>
                        <td style={tdStyle}><span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 10, padding: '3px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{car.category}</span></td>
                        <td style={{ ...tdStyle, color: '#ef4444', fontWeight: 700 }}>{fmt(car.pricePerDay)}</td>
                        <td style={{ ...tdStyle, color: '#d1d5db', fontSize: 13 }}>{car.seats}</td>
                        <td style={{ ...tdStyle, color: '#FFD700', fontSize: 13 }}>★ {car.rating || 4.5}</td>
                        <td style={tdStyle}><StatusBadge status={car.available !== false ? 'Active' : 'Banned'} /></td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {car.isExternal ? (
                              <span style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, padding: '5px 0' }}>External Source (Read-only)</span>
                            ) : (
                              <>
                                <button onClick={() => handleToggleAvailability(car)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16,185,129,0.1)', border: 'none', color: '#10b981', padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                  {car.available === false ? <FiToggleLeft size={12} /> : <FiToggleRight size={12} />} {car.available === false ? 'Offline' : 'Live'}
                                </button>
                                <button onClick={() => openEditCar(car)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                  <FiEdit2 size={12} /> Edit
                                </button>
                                <button onClick={() => handleDeleteCar(car._id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '5px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                  <FiTrash2 size={12} /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}</tbody>
                </table>
              </div>
            </div>
          </div>
          )}

          {/* ── Bookings ─────────────────────────────────────────────────────── */}
          {activePage === 'bookings' && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0f1929', borderBottom: '1px solid #1f2937' }}>
                  {['Booking ID', 'Car', 'Customer', 'Pickup', 'Return', 'Total', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>{bookings.map(b => (
                  <tr key={b._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: 12, fontFamily: 'monospace' }}>{b._id}</td>
                    <td style={{ ...tdStyle, color: '#fff', fontWeight: 600, fontSize: 14 }}>{b.car?.name?.split(' - ')[0]}</td>
                    <td style={{ ...tdStyle, color: '#d1d5db', fontSize: 13 }}>{b.user?.name}</td>
                    <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 13 }}>{b.pickupDate}</td>
                    <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 13 }}>{b.returnDate}</td>
                    <td style={{ ...tdStyle, color: '#ef4444', fontWeight: 700 }}>{fmt(b.totalPrice)}</td>
                    <td style={tdStyle}><StatusBadge status={b.bookingStatus} /></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <select value={b.bookingStatus} onChange={(e) => handleBookingStatusChange(b._id, e.target.value)} style={{ background: '#1f2937', border: '1px solid #374151', color: '#d1d5db', borderRadius: 6, padding: '5px 8px', fontSize: 12 }}>
                          {['Pending','Confirmed','Active','Completed','Cancelled'].map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                        {b.bookingStatus !== 'Cancelled' && (
                          <button onClick={() => handleCancelBooking(b._id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          )}

          {/* ── Users ────────────────────────────────────────────────────────── */}
          {activePage === 'users' && (
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0f1929', borderBottom: '1px solid #1f2937' }}>
                  {['User', 'Email', 'Role', 'Bookings', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>{users.map(u => (
                  <tr key={u._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: u.role === 'admin' ? '#7c3aed' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{u.name[0]}</div>
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 13 }}>{u.email}</td>
                    <td style={tdStyle}><StatusBadge status={u.role === 'admin' ? 'Active' : 'Active'} /></td>
                    <td style={{ ...tdStyle, color: '#d1d5db', fontSize: 13 }}>{u.bookingCount ?? '—'}</td>
                    <td style={tdStyle}><StatusBadge status={u.isBanned ? 'Banned' : 'Active'} /></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {u.role !== 'admin' && (
                          <button onClick={() => handleToggleBan(u)} style={{ background: u.isBanned ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)', border: 'none', color: u.isBanned ? '#16a34a' : '#ef4444', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                            {u.isBanned ? 'Unban' : 'Ban'}
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          )}

          {/* ── Analytics ───────────────────────────────────────────────────── */}
          {activePage === 'analytics' && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
              {[
                { title: 'Top Performing Cars', data: [['Ferrari F8 Tributo', 42, '#ef4444'], ['Porsche 911', 38, '#3b82f6'], ['Lamborghini', 31, '#FFD700'], ['Mercedes S-Class', 28, '#10b981']] },
                { title: 'Booking Trends', data: [['Mon', 12, '#ef4444'], ['Tue', 18, '#ef4444'], ['Wed', 9, '#ef4444'], ['Thu', 24, '#ef4444'], ['Fri', 31, '#ef4444'], ['Sat', 42, '#ef4444'], ['Sun', 28, '#ef4444']] },
              ].map(({ title, data }) => (
                <div key={title} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 24 }}>{title}</h3>
                  {data.map(([label, val, color]) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: '#d1d5db', fontSize: 13 }}>{label}</span>
                        <span style={{ color, fontSize: 13, fontWeight: 700 }}>{val}</span>
                      </div>
                      <div style={{ background: '#1f2937', borderRadius: 4, height: 6 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(val / 50) * 100}%` }} transition={{ duration: 0.6 }}
                          style={{ background: color, height: '100%', borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── Settings ────────────────────────────────────────────────────── */}
          {activePage === 'settings' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Platform Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><Input label="Platform Name" value={settings.platformName} onChange={e => setSettings(s => ({ ...s, platformName: e.target.value }))} /></div>
                  <div><Input label="Support Email" value={settings.supportEmail} onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))} /></div>
                  <div><Input label="Currency" value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} /></div>
                  <div><Input label="Tax Rate" type="number" value={settings.taxRate} onChange={e => setSettings(s => ({ ...s, taxRate: Number(e.target.value) }))} /></div>

                  <div style={{ background: '#0f1727', border: '1px solid #1f2937', borderRadius: 12, padding: 18 }}>
                    <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Brand Management</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {settings.brands.map((brand, index) => (
                        <div key={`${brand}-${index}`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            value={brand}
                            onChange={e => updateBrand(index, e.target.value)}
                            style={{ flex: 1, background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, outline: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeBrand(index)}
                            style={{ minWidth: 82, background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          placeholder="Add new brand"
                          value={newBrand}
                          onChange={e => setNewBrand(e.target.value)}
                          style={{ flex: 1, background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, outline: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={addBrand}
                          style={{ minWidth: 82, background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#0f1727', border: '1px solid #1f2937', borderRadius: 12, padding: 18 }}>
                    <h4 style={{ color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Car Type Management</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {settings.categories.map((category, index) => (
                        <div key={`${category}-${index}`} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input
                            value={category}
                            onChange={e => updateCategory(index, e.target.value)}
                            style={{ flex: 1, background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, outline: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            style={{ minWidth: 82, background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          placeholder="Add new car type"
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value)}
                          style={{ flex: 1, background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, outline: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={addCategory}
                          style={{ minWidth: 82, background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <button disabled={savingSettings} onClick={handleSaveSettings} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '11px 28px', borderRadius: 8, cursor: savingSettings ? 'not-allowed' : 'pointer', fontWeight: 700, alignSelf: 'flex-start', opacity: savingSettings ? 0.8 : 1 }}>Save Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Car Modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={showAddCar} onClose={() => setShowAddCar(false)} title={editingCarId ? 'Edit Car' : 'Add New Car'} maxWidth={580}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Car Name *', key: 'name', placeholder: 'e.g. 911 Carrera S' },
            { label: 'Brand *', key: 'brand', placeholder: 'e.g. Porsche' },
            { label: 'Price Per Day *', key: 'pricePerDay', placeholder: '799', type: 'number' },
            { label: 'Seats', key: 'seats', placeholder: '2', type: 'number' },
          ].map(({ label, key, placeholder, type = 'text' }) => (
            <div key={key}>
              <Input label={label} type={type} placeholder={placeholder} value={newCar[key]} onChange={e => setNewCar(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          {[
            { label: 'Category', key: 'category', opts: settings.categories },
            { label: 'Fuel Type', key: 'fuelType', opts: ['Petrol', 'Hybrid', 'Electric', 'Diesel'] },
            { label: 'Transmission', key: 'transmission', opts: ['Automatic', 'Manual'] },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</label>
              <select value={newCar[key]} onChange={e => setNewCar(p => ({ ...p, [key]: e.target.value }))} style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#d1d5db', padding: '10px 12px', fontSize: 14, outline: 'none' }}>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Description</label>
            <textarea value={newCar.description} onChange={e => setNewCar(p => ({ ...p, description: e.target.value }))} placeholder="Car description..." rows={3}
              style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '10px 14px', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Images</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1f2937', border: '1px dashed #374151', borderRadius: 8, padding: '10px 14px', color: '#d1d5db', cursor: 'pointer' }}>
              <FiUpload size={14} />
              <span>{carImageFiles.length ? `${carImageFiles.length} image(s) selected` : 'Choose images'}</span>
              <input type="file" accept="image/*" multiple onChange={e => setCarImageFiles(Array.from(e.target.files || []))} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
          <button onClick={() => setShowAddCar(false)} style={{ background: 'none', border: '1px solid #374151', color: '#9ca3af', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button onClick={handleSaveCar} disabled={savingCar} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '10px 28px', borderRadius: 8, cursor: savingCar ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: savingCar ? 0.8 : 1 }}>{editingCarId ? 'Save Changes' : 'Add Car'}</button>
        </div>
      </Modal>
    </div>
  )
}
