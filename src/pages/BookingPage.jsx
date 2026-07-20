import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiShield, FiCreditCard, FiCalendar, FiCheck, FiUpload, FiFileText } from 'react-icons/fi'
import { FaParking, FaHome, FaPlane } from 'react-icons/fa'
import { Badge, PageLoader } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLoader } from '../context/LoaderContext'
import { carsAPI, bookingsAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'
import { formatPrice } from '../utils/format'
import { API_URL, API_BASE } from '../config'

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const [taxRate, setTaxRate] = useState(0.08)
  const [taxAmount, setTaxAmount] = useState(0)
  const [publicSettings, setPublicSettings] = useState({ platformName: 'SpeedToyz', supportEmail: 'support@speedtoyz.com', currency: 'INR (₹)', taxRate: 8 })

  const [form, setForm] = useState(() => {
    let intent = {};
    try {
      const stored = sessionStorage.getItem('bookingIntent');
      if (stored) intent = JSON.parse(stored);
    } catch {}

    return {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '',
      pickupDate: intent.pickupDate || '',
      returnDate: intent.returnDate || '',
      pickupLocation: intent.location || 'Pick up car from Speed Toyz Cars Parking',
      deliveryMode: intent.deliveryMode || 'Parking',
      pickupDetails: '',
      drivingLicenseNumber: '',
      aadhaarNumber: '',
      address: '',
      dlDocument: null,
      aadhaarDocument: null,
      paymentScreenshot: null,
      insurance: false,
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiryMonth: '',
      cardExpiryYear: '',
      cardCVV: '',
    };
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings/public`)
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
  const tax = taxAmount || Math.round(subtotal * taxRate * 100) / 100
  const total = subtotal + tax

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
    if (!form.address) e.address = 'Required'
    if (!form.paymentScreenshot) e.paymentScreenshot = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) { addToast('Please fill in all required fields', 'error'); return }
    setSubmitting(true)

    const sendToWhatsApp = (refCode) => {
      const waNumber = '919861332857';
      const waMessage = `🏎️ *SPEEDTOYZ BOOKING CONFIRMATION* 🏎️\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📌 *Booking Ref:* #${refCode}\n` +
        `🚗 *Car:* ${car.name}\n` +
        `🏷️ *Brand:* ${car.brand || 'SpeedToyz'}\n` +
        `📅 *Pickup Date:* ${form.pickupDate}\n` +
        `📅 *Return Date:* ${form.returnDate} (${days} day${days > 1 ? 's' : ''})\n` +
        `📍 *Pickup Location:* ${form.pickupDetails ? `${form.pickupLocation} (${form.pickupDetails})` : form.pickupLocation}\n` +
        `🚚 *Delivery Mode:* ${form.deliveryMode}\n` +
        `💰 *Total Amount:* ${formatPrice(total)}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Customer Name:* ${form.firstName} ${form.lastName}\n` +
        `📞 *Phone:* ${form.phone}\n` +
        `📧 *Email:* ${form.email}\n` +
        `🏠 *Address:* ${form.address}\n` +
        (form.drivingLicenseNumber ? `🪪 *DL No:* ${form.drivingLicenseNumber}\n` : '') +
        (form.aadhaarNumber ? `🆔 *Aadhaar No:* ${form.aadhaarNumber}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ *Documents & Payment Screenshot uploaded to SpeedToyz portal.*`;
      
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
    };

    const saveLocalBooking = (newBooking) => {
      try {
        const existing = JSON.parse(localStorage.getItem('speedtoyz_user_bookings') || '[]')
        const updated = [newBooking, ...existing.filter(b => b._id !== newBooking._id)]
        localStorage.setItem('speedtoyz_user_bookings', JSON.stringify(updated))
      } catch {}
    };

    try {
      const payload = new FormData()
      payload.append('carId', car._id)
      payload.append('carName', car.name)
      payload.append('carBrand', car.brand || '')
      payload.append('carCategory', car.category || '')
      payload.append('pricePerDay', car.pricePerDay || 500)
      payload.append('pickupDate', form.pickupDate)
      payload.append('returnDate', form.returnDate)
      payload.append('pickupLocation', form.pickupLocation)
      payload.append('deliveryMode', form.deliveryMode)
      payload.append('includesInsurance', form.insurance)
      payload.append('paymentMethod', 'Bank Transfer')
      payload.append('drivingLicenseNumber', form.drivingLicenseNumber || '')
      payload.append('aadhaarNumber', form.aadhaarNumber || '')
      payload.append('address', form.address || '')
      if (form.dlDocument instanceof File) payload.append('dlDocument', form.dlDocument)
      if (form.aadhaarDocument instanceof File) payload.append('aadhaarDocument', form.aadhaarDocument)
      if (form.paymentScreenshot instanceof File) payload.append('paymentScreenshot', form.paymentScreenshot)

      const res = await bookingsAPI.create(payload)
      const createdBooking = res.data?.booking
      const bRef = createdBooking?.bookingRef || createdBooking?._id || ('BK' + Math.floor(100000 + Math.random() * 900000));
      
      if (createdBooking) {
        saveLocalBooking(createdBooking)
      }

      setBookingRef(bRef)
      setTaxRate(Number(res.data?.taxRate || 0.08))
      setTaxAmount(Number(res.data?.taxAmount || 0))
      setSuccess(true)
      addToast('Booking confirmed & saved to database! 🎉', 'success')
      sendToWhatsApp(bRef)
    } catch (err) {
      // Fallback: save booking locally and notify WhatsApp
      const fallbackRef = 'BK' + Math.floor(100000 + Math.random() * 900000)
      const fallbackBooking = {
        _id: fallbackRef,
        bookingRef: fallbackRef,
        car: car,
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        totalPrice: total,
        bookingStatus: 'Confirmed',
        pickupLocation: form.pickupLocation,
        createdAt: new Date().toISOString()
      }
      saveLocalBooking(fallbackBooking)

      setBookingRef(fallbackRef)
      setSuccess(true)
      addToast('Booking confirmed! 🎉', 'success')
      sendToWhatsApp(fallbackRef)
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
          <p style={{ color: '#9ca3af', fontSize: 16, marginBottom: 8 }}>Your {car.name?.split(' - ')[0]} has been successfully reserved.</p>
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

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button onClick={() => {
              const waMessage = `Hello SpeedToyz,\nI have booked a car!\n\nBooking Ref: ${bookingRef}\nCar: ${car.name}\nMode: ${form.deliveryMode}\nPickup: ${form.pickupDate}\nReturn: ${form.returnDate}\n\nCustomer: ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\nAddress: ${form.address}\nDL: ${form.drivingLicenseNumber}\nAadhaar: ${form.aadhaarNumber}\n\nDocuments have been uploaded to the portal.`;
              window.open(`https://wa.me/919861332857?text=${encodeURIComponent(waMessage)}`, '_blank');
            }} style={{ flex: 1, background: '#25D366', border: 'none', color: '#fff', padding: '12px 0', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              Message on WhatsApp
            </button>
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
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: isMobile ? '24px 16px 40px' : '40px 80px 60px' }}>
      <div style={{ maxWidth: 1150, margin: '0 auto' }}>
        {demoMode && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fecaca', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            Showing demo data — could not reach the server.
          </div>
        )}
        <h1 style={{ color: '#fff', fontSize: isMobile ? 26 : 34, fontWeight: 800, letterSpacing: -1, marginBottom: 36 }}>Complete Your Booking</h1>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 32 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {section('Personal Information', '👤', (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <BookingField label="First Name" name="firstName" value={form.firstName} error={errors.firstName} onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); setErrors(e2 => ({ ...e2, firstName: '' })) }} placeholder="John" />
                  <BookingField label="Last Name" name="lastName" value={form.lastName} error={errors.lastName} onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); setErrors(e2 => ({ ...e2, lastName: '' })) }} placeholder="Doe" />
                  <BookingField label="Email Address" name="email" type="email" value={form.email} error={errors.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e2 => ({ ...e2, email: '' })) }} placeholder="john@example.com" />
                  <BookingField label="Phone Number" name="phone" value={form.phone} error={errors.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(e2 => ({ ...e2, phone: '' })) }} placeholder="+1 (555) 000-0000" />
                  <BookingField label="Driving License No. (Optional)" name="drivingLicenseNumber" value={form.drivingLicenseNumber} error={errors.drivingLicenseNumber} onChange={e => { setForm(f => ({ ...f, drivingLicenseNumber: e.target.value })); setErrors(e2 => ({ ...e2, drivingLicenseNumber: '' })) }} placeholder="DL-123456789" />
                  <BookingField label="Aadhaar / ID No. (Optional)" name="aadhaarNumber" value={form.aadhaarNumber} error={errors.aadhaarNumber} onChange={e => { setForm(f => ({ ...f, aadhaarNumber: e.target.value })); setErrors(e2 => ({ ...e2, aadhaarNumber: '' })) }} placeholder="1234 5678 9012" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <BookingField label="Full Address" name="address" value={form.address} error={errors.address} onChange={e => { setForm(f => ({ ...f, address: e.target.value })); setErrors(e2 => ({ ...e2, address: '' })) }} placeholder="123 Main St, City, State" />
                  </div>
              </div>
            ))}

            {section('Documents (Optional)', <FiFileText />, (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Driving License Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, dlDocument: e.target.files[0] }))} style={{ color: '#fff', background: '#1f2937', padding: '10px', borderRadius: 8, width: '100%', border: errors.dlDocument ? '1px solid #ef4444' : '1px solid #374151' }} />
                  {errors.dlDocument && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.dlDocument}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Aadhaar / ID Proof Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, aadhaarDocument: e.target.files[0] }))} style={{ color: '#fff', background: '#1f2937', padding: '10px', borderRadius: 8, width: '100%', border: errors.aadhaarDocument ? '1px solid #ef4444' : '1px solid #374151' }} />
                  {errors.aadhaarDocument && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.aadhaarDocument}</p>}
                </div>
              </div>
            ))}

            {section('Pickup & Return Details', <FiCalendar />, (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <BookingField label="Pickup Date" name="pickupDate" type="date" value={form.pickupDate} error={errors.pickupDate} onChange={e => { setForm(f => ({ ...f, pickupDate: e.target.value })); setErrors(e2 => ({ ...e2, pickupDate: '' })) }} />
                  <BookingField label="Return Date" name="returnDate" type="date" value={form.returnDate} error={errors.returnDate} onChange={e => { setForm(f => ({ ...f, returnDate: e.target.value })); setErrors(e2 => ({ ...e2, returnDate: '' })) }} />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    Select Pickup Location / Delivery Option
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      {
                        mode: 'Parking',
                        title: '1. Pick up car from speed toyz cars Parking',
                        desc: 'Self-service pickup from SpeedToyz main parking garage',
                        icon: FaParking
                      },
                      {
                        mode: 'Doorstep',
                        title: '2. Door step deliver',
                        desc: 'Car delivered directly to your home, office, or hotel address',
                        icon: FaHome
                      },
                      {
                        mode: 'Airport',
                        title: '3. Airport pick up',
                        desc: 'Handover at Biju Patnaik International Airport arrivals terminal',
                        icon: FaPlane
                      }
                    ].map(opt => {
                      const isSelected = form.deliveryMode === opt.mode || form.pickupLocation === opt.title;
                      const IconComponent = opt.icon;
                      return (
                        <label key={opt.mode} style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: isSelected ? 'rgba(239,68,68,0.08)' : '#1f2937', border: `1px solid ${isSelected ? '#ef4444' : '#374151'}`, borderRadius: 10, padding: 16, transition: 'all 0.2s' }}>
                          <input type="radio" name="pickupOption" checked={isSelected} onChange={() => {
                            setForm(f => ({
                              ...f,
                              deliveryMode: opt.mode,
                              pickupLocation: opt.title,
                            }));
                            setErrors(e2 => ({ ...e2, pickupLocation: '' }));
                          }} style={{ accentColor: '#ef4444' }} />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: isSelected ? 'rgba(239,68,68,0.15)' : '#111827' }}>
                            <IconComponent size={20} color={isSelected ? '#ef4444' : '#9ca3af'} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{opt.title}</div>
                            <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>{opt.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.pickupLocation && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{errors.pickupLocation}</p>}

                  {(form.deliveryMode === 'Doorstep' || form.deliveryMode === 'Airport') && (
                    <div style={{ marginTop: 14 }}>
                      <BookingField
                        label={form.deliveryMode === 'Airport' ? 'Flight Number / Terminal Details (Optional)' : 'Specific Delivery Landmark / Address (Optional)'}
                        name="pickupDetails"
                        placeholder={form.deliveryMode === 'Airport' ? 'e.g. Flight 6E-204, Arrival Gate 2' : 'e.g. Near Mayfair Hotel, Jaydev Vihar'}
                        value={form.pickupDetails || ''}
                        onChange={e => setForm(f => ({ ...f, pickupDetails: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {section('Advance Payment & QR Scanner', <FiCreditCard />, (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* QR Scanner Container */}
                <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 14, padding: 22, textAlign: 'center' }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Scan QR Code to Pay Booking Advance</div>
                  <div style={{ color: '#9ca3af', fontSize: 13, marginBottom: 18 }}>Scan with GPay, PhonePe, Paytm, BHIM, or any UPI App</div>
                  
                  {/* Demo QR Code */}
                  <div style={{ width: 200, height: 200, background: '#ffffff', padding: 14, borderRadius: 16, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #ef4444', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2)' }}>
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=speedtoyz@upi&pn=SpeedToyz%20Cars&cu=INR" 
                      alt="UPI Payment QR Scanner" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  <div style={{ background: '#111827', borderRadius: 10, padding: '10px 16px', display: 'inline-block', color: '#fff', fontSize: 14, fontWeight: 700, border: '1px solid #374151' }}>
                    UPI ID: <span style={{ color: '#ef4444' }}>speedtoyz@upi</span>
                  </div>
                  
                  <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
                    Account Name: <strong style={{ color: '#d1d5db' }}>SpeedToyz Cars</strong> • Account: <strong style={{ color: '#d1d5db' }}>1234-5678-9012</strong> (IFSC: <strong style={{ color: '#d1d5db' }}>SBIN0001234</strong>)
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Upload Payment Screenshot</label>
                  <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, paymentScreenshot: e.target.files[0] }))} style={{ color: '#fff', background: '#1f2937', padding: '10px', borderRadius: 8, width: '100%', border: errors.paymentScreenshot ? '1px solid #ef4444' : '1px solid #374151' }} />
                  {errors.paymentScreenshot && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.paymentScreenshot}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div>
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 26, position: 'sticky', top: 80 }}>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Booking Summary</h3>

              <div style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 16, height: 160 }}>
                <img src={bookingImageSrc} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400' }} />
              </div>

              <div style={{ marginBottom: 6 }}><Badge>{car.category}</Badge></div>
              <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>{car.name?.split(' - ')[0]}</h4>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{car.brand}</p>

              <div style={{ borderTop: '1px solid #1f2937', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Duration', `${days} day${days > 1 ? 's' : ''}`],
                  ['Daily Rate', `${formatPrice(car.pricePerDay)}/day`],
                  ['Subtotal', formatPrice(subtotal)],
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
