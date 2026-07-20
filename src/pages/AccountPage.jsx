import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiFileText } from 'react-icons/fi'
import { FaCarSide } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLoader } from '../context/LoaderContext'
import { authAPI, bookingsAPI } from '../services/api'
import { formatPrice } from '../utils/format'
import { StatusBadge } from '../components/UI'

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const { setIsPageLoading } = useLoader()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  useEffect(() => {
    const load = async () => {
      let apiList = []
      try {
        const res = await bookingsAPI.myBookings()
        const data = res.data?.bookings ?? res.data
        if (Array.isArray(data)) apiList = data
      } catch (err) {
        // Fallback to local bookings if API fails or demo mode
      }

      let localList = []
      try {
        const saved = localStorage.getItem('speedtoyz_user_bookings')
        if (saved) localList = JSON.parse(saved)
      } catch {}

      const combinedMap = new Map()
      apiList.forEach(b => {
        const key = b._id || b.bookingRef
        if (key) combinedMap.set(key, b)
      })
      localList.forEach(b => {
        const key = b._id || b.bookingRef
        if (key && !combinedMap.has(key)) combinedMap.set(key, b)
      })

      const finalBookings = Array.from(combinedMap.values())
      setBookings(finalBookings)
      setLoading(false)
    }
    load()
  }, [])

  if (!user) return null

  const formatDateStr = (d) => {
    if (!d) return ''
    if (typeof d === 'string') return d.split('T')[0]
    try {
      return new Date(d).toISOString().split('T')[0]
    } catch {
      return String(d)
    }
  }

  return (
    <div style={{ minHeight: '75vh', padding: '40px 24px 60px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gap: 24 }}>
        {/* User profile card */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>My Account</h1>
              <p style={{ color: '#9ca3af', marginTop: 6, fontSize: 15 }}>{user.name || user.email}</p>
            </div>
            <button onClick={logout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              Logout
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 16px', minWidth: 200, flex: 1 }}>
              <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Email Address</div>
              <div style={{ marginTop: 4, fontWeight: 600, color: '#fff' }}>{user.email}</div>
            </div>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 16px', minWidth: 160 }}>
              <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Account Role</div>
              <div style={{ marginTop: 4, fontWeight: 600, color: '#ef4444', textTransform: 'capitalize' }}>{user.role || 'Customer'}</div>
            </div>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 16px', minWidth: 160 }}>
              <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Total Bookings</div>
              <div style={{ marginTop: 4, fontWeight: 800, fontSize: 18, color: '#fff' }}>{bookings.length}</div>
            </div>
          </div>
        </div>

        {/* Recent bookings card */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Recent Bookings</h2>
            {bookings.length > 0 && (
              <button onClick={() => navigate('/my-bookings')} style={{ background: 'none', border: '1px solid #374151', color: '#d1d5db', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                View All →
              </button>
            )}
          </div>

          {loading ? (
            <p style={{ color: '#9ca3af' }}>Loading recent bookings...</p>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', background: '#1f2937', borderRadius: 12 }}>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                <FiFileText size={36} color="#9ca3af" />
              </div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>No bookings yet</div>
              <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 4, marginBottom: 16 }}>Explore our premium fleet and make your first reservation!</div>
              <button onClick={() => navigate('/cars')} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                Browse Cars
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id || booking.bookingRef} style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaCarSide size={22} color="#ef4444" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{booking.car?.name?.split(' - ')[0] || 'Luxury Car'}</div>
                      <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FiCalendar size={13} color="#9ca3af" /> {formatDateStr(booking.pickupDate)} → {formatDateStr(booking.returnDate)}
                      </div>
                      {booking.pickupLocation && (
                        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FiMapPin size={12} color="#6b7280" /> {booking.pickupLocation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <div style={{ color: '#ef4444', fontWeight: 900, fontSize: 18 }}>{formatPrice(booking.totalPrice)}</div>
                    <StatusBadge status={booking.bookingStatus || 'Confirmed'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
