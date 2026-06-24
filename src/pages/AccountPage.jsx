import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authAPI, bookingsAPI } from '../services/api'
import { formatPrice } from '../utils/format'

export default function AccountPage() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authAPI.me()
        if (res.data.user) {
          const bookingsRes = await bookingsAPI.myBookings()
          setBookings(bookingsRes.data.bookings || bookingsRes.data || [])
        }
      } catch (err) {
        const message = err?.response?.data?.message || 'Could not load account details.'
        addToast(message, 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [addToast])

  if (!user) return null

  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gap: 24 }}>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>My Account</h1>
          <p style={{ color: '#9ca3af', marginTop: 8 }}>{user.name || user.email}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 14px', minWidth: 180 }}>
              <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Email</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{user.email}</div>
            </div>
            <div style={{ background: '#1f2937', borderRadius: 12, padding: '12px 14px', minWidth: 180 }}>
              <div style={{ color: '#6b7280', fontSize: 12, textTransform: 'uppercase' }}>Role</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>{user.role}</div>
            </div>
          </div>
          <button onClick={logout} style={{ marginTop: 20, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontWeight: 700 }}>Logout</button>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 24 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Recent bookings</h2>
          {loading ? <p style={{ color: '#9ca3af' }}>Loading...</p> : bookings.length === 0 ? <p style={{ color: '#9ca3af' }}>No bookings yet.</p> : (
            <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} style={{ background: '#1f2937', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{booking.car?.name || 'Car'}</div>
                    <div style={{ color: '#9ca3af', fontSize: 13 }}>{booking.pickupDate} → {booking.returnDate}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ef4444', fontWeight: 800 }}>{formatPrice(booking.totalPrice)}</div>
                    <div style={{ color: '#9ca3af', fontSize: 13 }}>{booking.bookingStatus}</div>
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
