import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiShield, FiCreditCard, FiCalendar, FiCheck } from 'react-icons/fi'
import { Badge, PageLoader } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLoader } from '../context/LoaderContext'
import { carsAPI, bookingsAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'
import { formatPrice } from '../utils/format'
import { useEffect as useReactEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
const PAYMENT_METHOD_MAP = { card: 'Credit Card', paypal: 'PayPal', bank: 'Bank Transfer' }
const calcDays = (a, b) => {
  const diff = (new Date(b) - new Date(a)) / 86400000
  return diff > 0 ? Math.ceil(diff) : 1
}

function BookingField({ label, name, value, error, onChange, ...props }) {
  const [focused, setFocused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div>
      <label htmlFor={name} style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, cursor: 'text' }}>{label}</label>
      <motion.input
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        initial={false}
        animate={shouldReduceMotion ? { borderColor: error ? '#ef4444' : '#374151', boxShadow: 'none' } : { borderColor: error ? '#ef4444' : focused ? '#f87171' : '#374151', boxShadow: focused ? '0 0 0 3px rgba(239,68,68,0.16)' : 'none' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{ width: '100%', background: '#1f2937', border: `1px solid ${error ? '#ef4444' : '#374151'}`, borderRadius: 8, color: '#fff', padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        {...props}
      />
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const { setIsPageLoading } = useLoader()

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])
  const shouldReduceMotion = useReducedMotion()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [taxRate, setTaxRate] = useState(0.08)
  const [taxAmount, setTaxAmount] = useState(0)
  const [publicSettings, setPublicSettings] = useState({ platformName: 'SpeedToyz', supportEmail: 'support@speedtoyz.com', currency: 'INR (₹)', taxRate: 8 })

  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    insurance: false,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
  })
  const [errors, setErrors] = useState({})

  useReactEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings/public`)
        const data = await res.json()
        if (data?.success) {
          setPublicSettings(data.settings || publicSettings)
          if (data.settings?.taxRate) setTaxRate(Number(data.settings.taxRate) / 100)
        }
      } catch {
        // keep defaults
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carsAPI.getById(id)
        setCar(res.data.car || res.data)
      } catch {
        setDemoMode(true)
        const found = MOCK_CARS.find(c => c._id === id)
        setCar(found || MOCK_CARS[0])
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [id])

  if (loading) return <PageLoader />
  if (!car) return null

  const bookingImageList = Array.isArray(car.images)
    ? car.images.filter(src => typeof src === 'string' && src.trim().length)
    : typeof car.images === 'string' && car.images.trim().length
      ? [car.images.trim()]
      : []
  const bookingImageSrc = bookingImageList[0]
    ? bookingImageList[0].startsWith('http')
      ? bookingImageList[0]
      : `${API_URL}/uploads/${bookingImageList[0]}`
    : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80'

  const days = form.pickupDate && form.returnDate ? calcDays(form.pickupDate, form.returnDate) : 1
  const subtotal = days * car.pricePerDay
  const insuranceFee = form.insurance ? 50 * days : 0
  const tax = taxAmount || Math.round(subtotal * taxRate * 100) / 100
  const total = subtotal + insuranceFee + tax

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.phone) e.phone = 'Required'
    if (!form.pickupDate) e.pickupDate = 'Required'
    if (!form.returnDate) e.returnDate = 'Required'
    if (form.pickupDate && form.returnDate && new Date(form.returnDate) <= new Date(form.pickupDate)) e.returnDate = 'Return must be after pickup'
    if (!form.pickupLocation) e.pickupLocation = 'Required'
    if (form.paymentMethod === 'card') {
      if (!form.cardNumber) e.cardNumber = 'Required'
      if (!form.cardExpiryMonth) e.cardExpiryMonth = 'Required'
      if (!form.cardExpiryYear) e.cardExpiryYear = 'Required'
      if (!form.cardCVV) e.cardCVV = 'Required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) { addToast('Please fill in all required fields', 'error'); return }
    setSubmitting(true)
    try {
      const payload = {
        carId: car._id,
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        pickupLocation: form.pickupLocation,
        includesInsurance: form.insurance,
        paymentMethod: PAYMENT_METHOD_MAP[form.paymentMethod] || 'Credit Card',
      }
      const res = await bookingsAPI.create(payload)
      setBookingRef(res.data?.booking?.bookingRef || res.data?.booking?._id || res.data?._id || '')
      setTaxRate(Number(res.data?.taxRate || 0.08))
      setTaxAmount(Number(res.data?.taxAmount || 0))
      setSuccess(true)
      addToast('Booking confirmed! 🎉', 'success')
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create your booking. Please try again.'
      addToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 56, maxWidth: 500, width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {!shouldReduceMotion && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {Array.from({ length: 10 }).map((_, idx) => (
                <motion.span key={idx} initial={{ opacity: 0, y: 0, x: 0 }} animate={{ opacity: [0, 1, 0], y: [-8, -48], x: [0, (idx % 2 === 0 ? 1 : -1) * 24], rotate: 180 }} transition={{ duration: 0.8 + (idx % 3) * 0.1, ease: 'easeOut', delay: 0.1 + idx * 0.03 }} style={{ position: 'absolute', top: '28%', left: `${18 + idx * 7}%`, width: 8, height: 8, borderRadius: '50%', background: idx % 2 === 0 ? '#ef4444' : '#fbbf24' }} />
              ))}
            </div>
          )}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 14 }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', position: 'relative', zIndex: 1 }}>
            <FiCheck size={36} color="#16a34a" />
          </motion.div>
          <h2 style={{ color: '#fff', fontSize: 30, fontWeight: 900, margin: '0 0 10px' }}>Booking Confirmed!</h2>
          <p style={{ color: '#9ca3af', fontSize: 16, marginBottom: 8 }}>Your {car.name} has been successfully reserved.</p>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 28 }}>Ref: <strong style={{ color: '#ef4444' }}>#{bookingRef}</strong></p>

          <div style={{ background: '#1f2937', borderRadius: 12, padding: 20, marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
              {[
                ['Pickup', form.pickupDate],
                ['Return', form.returnDate],
                ['Duration', `${days} day${days > 1 ? 's' : ''}`],
                ['Total', formatPrice(total)],
              ].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'left' }}>
                  <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 4 }}>{k}</div>
                  <div style={{ color: k === 'Total' ? '#ef4444' : '#fff', fontWeight: k === 'Total' ? 800 : 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('/my-bookings')} style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '12px 0', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>View Bookings</button>
            <button onClick={() => navigate('/cars')} style={{ flex: 1, background: 'none', border: '1px solid #374151', color: '#d1d5db', padding: '12px 0', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Browse More</button>
          </div>
        </motion.div>
      </div>
    )
  }

  const section = (title, icon, children) => (
    <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28 }}>
      <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>{icon} {title}</h3>
      {children}
    </div>
  )

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '40px 80px 60px' }}>
      <div style={{ maxWidth: 1150, margin: '0 auto' }}>
        {demoMode && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fecaca', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            Showing demo data — could not reach the server.
          </div>
        )}
        <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 800, letterSpacing: -1, marginBottom: 36 }}>Complete Your Booking</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {section('Personal Information', '👤', (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <BookingField label="First Name" name="firstName" value={form.firstName} error={errors.firstName} onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); setErrors(e2 => ({ ...e2, firstName: '' })) }} placeholder="John" />
                  <BookingField label="Last Name" name="lastName" value={form.lastName} error={errors.lastName} onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); setErrors(e2 => ({ ...e2, lastName: '' })) }} placeholder="Doe" />
                  <BookingField label="Email Address" name="email" type="email" value={form.email} error={errors.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e2 => ({ ...e2, email: '' })) }} placeholder="john@example.com" />
                  <BookingField label="Phone Number" name="phone" value={form.phone} error={errors.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(e2 => ({ ...e2, phone: '' })) }} placeholder="+1 (555) 000-0000" />
              </div>
            ))}

            {section('Pickup & Return Details', <FiCalendar />, (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <BookingField label="Pickup Date" name="pickupDate" type="date" value={form.pickupDate} error={errors.pickupDate} onChange={e => { setForm(f => ({ ...f, pickupDate: e.target.value })); setErrors(e2 => ({ ...e2, pickupDate: '' })) }} />
                <BookingField label="Return Date" name="returnDate" type="date" value={form.returnDate} error={errors.returnDate} onChange={e => { setForm(f => ({ ...f, returnDate: e.target.value })); setErrors(e2 => ({ ...e2, returnDate: '' })) }} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <BookingField label="Pickup Location" name="pickupLocation" placeholder="Airport, Hotel, or City Center" value={form.pickupLocation} error={errors.pickupLocation} onChange={e => { setForm(f => ({ ...f, pickupLocation: e.target.value })); setErrors(e2 => ({ ...e2, pickupLocation: '' })) }} />
                </div>
              </div>
            ))}

            {section('Insurance Options', <FiShield />, (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { key: false, title: 'Basic Coverage', desc: 'Third-party liability included', price: 'Free' },
                  { key: true, title: 'Full Coverage Insurance', desc: 'Comprehensive protection — collision, theft, damage', price: '+₹4718/day' },
                ].map(opt => (
                  <label key={String(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: form.insurance === opt.key ? 'rgba(239,68,68,0.06)' : '#1f2937', border: `1px solid ${form.insurance === opt.key ? '#ef4444' : '#374151'}`, borderRadius: 10, padding: 16, transition: 'all 0.2s' }}>
                    <input type="radio" name="insurance" checked={form.insurance === opt.key} onChange={() => setForm(f => ({ ...f, insurance: opt.key }))} style={{ accentColor: '#ef4444' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{opt.title}</div>
                      <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 3 }}>{opt.desc}</div>
                    </div>
                    <div style={{ color: opt.key ? '#ef4444' : '#16a34a', fontWeight: 700, fontSize: 15 }}>{opt.price}</div>
                  </label>
                ))}
              </div>
            ))}

            {section('Payment Method', <FiCreditCard />, (
              <>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  {[['card', '💳 Credit Card'], ['paypal', '🅿️ PayPal'], ['bank', '🏦 Bank Transfer']].map(([val, label]) => (
                    <button key={val} onClick={() => setForm(f => ({ ...f, paymentMethod: val }))}
                      style={{ flex: 1, padding: '11px', borderRadius: 8, border: `1px solid ${form.paymentMethod === val ? '#ef4444' : '#374151'}`, background: form.paymentMethod === val ? 'rgba(239,68,68,0.08)' : 'transparent', color: form.paymentMethod === val ? '#ef4444' : '#9ca3af', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                      {label}
                    </button>
                  ))}
                </div>
                {form.paymentMethod === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <BookingField label="Card Number" name="cardNumber" placeholder="1234 5678 9012 3456" value={form.cardNumber} error={errors.cardNumber} onChange={e => { setForm(f => ({ ...f, cardNumber: e.target.value })); setErrors(e2 => ({ ...e2, cardNumber: '' })) }} maxLength={19} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                      <BookingField label="Month" name="cardExpiryMonth" placeholder="MM" value={form.cardExpiryMonth} error={errors.cardExpiryMonth} onChange={e => { setForm(f => ({ ...f, cardExpiryMonth: e.target.value })); setErrors(e2 => ({ ...e2, cardExpiryMonth: '' })) }} />
                      <BookingField label="Year" name="cardExpiryYear" placeholder="YY" value={form.cardExpiryYear} error={errors.cardExpiryYear} onChange={e => { setForm(f => ({ ...f, cardExpiryYear: e.target.value })); setErrors(e2 => ({ ...e2, cardExpiryYear: '' })) }} />
                      <BookingField label="CVV" name="cardCVV" placeholder="123" value={form.cardCVV} error={errors.cardCVV} onChange={e => { setForm(f => ({ ...f, cardCVV: e.target.value })); setErrors(e2 => ({ ...e2, cardCVV: '' })) }} maxLength={4} />
                    </div>
                  </div>
                )}
                {form.paymentMethod === 'paypal' && (
                  <div style={{ background: '#1f2937', borderRadius: 10, padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                    You will be redirected to PayPal to complete payment.
                  </div>
                )}
                {form.paymentMethod === 'bank' && (
                  <div style={{ background: '#1f2937', borderRadius: 10, padding: 20, color: '#9ca3af', fontSize: 14, lineHeight: 1.8 }}>
                    <strong style={{ color: '#fff' }}>Bank Transfer Details:</strong><br />
                    Account Name: SpeedToyz LLC<br />
                    Account Number: 1234-5678-9012<br />
                    Routing: 021000021
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Right: Summary */}
          <div>
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 26, position: 'sticky', top: 80 }}>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Booking Summary</h3>

              <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 16, height: 160 }}>
                <img src={imgSrc} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' }} />
              </div>

              <div style={{ marginBottom: 6 }}><Badge>{car.category}</Badge></div>
              <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>{car.name}</h4>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{car.brand}</p>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Duration', `${days} day${days > 1 ? 's' : ''}`],
                  ['Daily Rate', `${formatPrice(car.pricePerDay)}/day`],
                  ['Subtotal', formatPrice(subtotal)],
                  form.insurance && ['Insurance', formatPrice(insuranceFee)],
                  [`Tax (${Math.round(taxRate * 100)}%)`, formatPrice(tax)],
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span style={{ color: '#d1d5db' }}>{v}</span>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid #1f2937', paddingTop: 14, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Total</span>
                  <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 22 }}>{formatPrice(total)}</span>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={submitting}
                style={{ width: '100%', marginTop: 22, background: '#ef4444', border: 'none', color: '#fff', padding: '15px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.8 : 1, transition: 'opacity 0.2s' }}>
                {submitting ? '⏳ Processing...' : 'Confirm Booking →'}
              </button>

              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#6b7280', fontSize: 12 }}>
                <FiShield size={12} /> Secure & encrypted payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
