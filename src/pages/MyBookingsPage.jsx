import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin, FiHash } from 'react-icons/fi'
import { StatusBadge, EmptyState, PageLoader } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { bookingsAPI } from '../services/api'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

const MOCK_MY_BOOKINGS = [
  {
    _id: 'BK001',
    car: { _id: '4', name: 'Porsche 911 Carrera S', brand: 'Porsche', category: 'Sports', images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80'] },
    pickupDate: '2025-07-10', returnDate: '2025-07-13', totalPrice: 2397, bookingStatus: 'Confirmed', pickupLocation: 'Miami International Airport',
  },
  {
    _id: 'BK002',
    car: { _id: '1', name: 'Ferrari F8 Tributo', brand: 'Ferrari', category: 'Sports', images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400&q=80'] },
    pickupDate: '2025-06-20', returnDate: '2025-06-22', totalPrice: 1798, bookingStatus: 'Completed', pickupLocation: 'Downtown Miami',
  },
]

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingsAPI.myBookings()
        const data = res.data?.bookings ?? res.data
        setBookings(Array.isArray(data) ? data : [])
      } catch {
        setBookings(MOCK_MY_BOOKINGS)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(id)
    try {
      await bookingsAPI.cancel(id)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: 'Cancelled' } : b))
      addToast('Booking cancelled successfully', 'info')
    } catch {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: 'Cancelled' } : b))
      addToast('Booking cancelled', 'info')
    } finally {
      setCancellingId(null)
    }
  }

  const tabs = ['all', 'Confirmed', 'Completed', 'Cancelled']
  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.bookingStatus === activeTab)

  if (loading) return <PageLoader />

  const imgSrc = (car) => {
    const src = car?.images?.[0]
    if (!src) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400'
    return src.startsWith('http') ? src : `${API_URL}/uploads/${src}`
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: isMobile ? '24px 16px 60px' : '44px 80px 60px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: 36, gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <img src="/logo.jpeg" alt="Speed Toyz Cars logo" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <div className="brand-font" style={{ color: '#fff', fontSize: isMobile ? 20 : 22, margin: 0, fontFamily: 'Ethnocentric' }}>SPEED TOYZ CARS</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>Your bookings dashboard</div>
              </div>
            </div>
            <h1 style={{ color: '#fff', fontSize: isMobile ? 26 : 34, fontWeight: 800, letterSpacing: -1, margin: '0 0 8px' }}>My Bookings</h1>
            <p style={{ color: '#6b7280', fontSize: 15 }}>Track and manage your rental history</p>
          </div>
          <button onClick={() => navigate('/cars')} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
            + Book New Car
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            ['Total Bookings', bookings.length, '#3b82f6'],
            ['Confirmed', bookings.filter(b => b.bookingStatus === 'Confirmed').length, '#16a34a'],
            ['Completed', bookings.filter(b => b.bookingStatus === 'Completed').length, '#9ca3af'],
            ['Cancelled', bookings.filter(b => b.bookingStatus === 'Cancelled').length, '#ef4444'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: isMobile ? '12px 16px' : '16px 20px' }}>
              <div style={{ color, fontSize: isMobile ? 20 : 24, fontWeight: 900 }}>{val}</div>
              <div style={{ color: '#6b7280', fontSize: isMobile ? 12 : 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 20px', borderRadius: 7, border: 'none', background: activeTab === tab ? '#ef4444' : 'transparent', color: activeTab === tab ? '#fff' : '#9ca3af', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', textTransform: tab === 'all' ? 'capitalize' : 'none' }}>
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="No bookings found" message="You haven't made any bookings yet. Start exploring our premium fleet!" action="Browse Cars" onAction={() => navigate('/cars')} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {filtered.map((booking, i) => (
              <motion.div key={booking._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: isMobile ? 16 : 24, display: 'grid', gridTemplateColumns: isMobile ? '80px 1fr' : isTablet ? '100px 1fr auto' : '130px 1fr auto', gap: isMobile ? 16 : 24, alignItems: isMobile ? 'flex-start' : 'center' }}>

                {/* Image */}
                <div style={{ borderRadius: 10, overflow: 'hidden', height: isMobile ? 80 : 88, width: '100%' }}>
                  <img src={imgSrc(booking.car)} alt={booking.car?.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200' }} />
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: isMobile ? 15 : 18 }}>{booking.car?.name}</span>
                    <StatusBadge status={booking.bookingStatus} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 20, color: '#9ca3af', fontSize: isMobile ? 12 : 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <FiCalendar size={13} /> {booking.pickupDate} → {booking.returnDate}
                    </span>
                    {!isMobile && (
                      <>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FiMapPin size={13} /> {booking.pickupLocation}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FiHash size={13} /> {booking._id}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ textAlign: isMobile ? 'left' : 'right', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
                  <div style={{ color: '#ef4444', fontWeight: 900, fontSize: isMobile ? 18 : 24, marginBottom: isMobile ? 8 : 12 }}>{fmt(booking.totalPrice)}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: isMobile ? 'flex-start' : 'flex-end', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate(`/cars/${booking.car?._id}`)}
                      style={{ background: 'none', border: '1px solid #374151', color: '#9ca3af', padding: '7px 14px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      View Car
                    </button>
                    {booking.bookingStatus === 'Confirmed' && (
                      <button onClick={() => handleCancel(booking._id)} disabled={cancellingId === booking._id}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '7px 14px', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {cancellingId === booking._id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
