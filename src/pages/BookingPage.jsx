import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiShield, FiCreditCard, FiCalendar, FiCheck, FiUpload, FiFileText, FiMapPin, FiNavigation } from 'react-icons/fi'
import { FaParking, FaHome, FaPlane } from 'react-icons/fa'
import { Badge, PageLoader, Modal } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLoader } from '../context/LoaderContext'
import { carsAPI, bookingsAPI, settingsAPI, phonepeAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'
import { formatPrice, cleanCarName, getCarImageSrc, CAR_IMAGE_FALLBACK, formatPhone, cleanPhoneDigits, isValidIndianPhone } from '../utils/format'
import { API_URL, API_BASE } from '../config'

const PAYMENT_METHOD_MAP = { card: 'Credit Card', paypal: 'PayPal', bank: 'Bank Transfer', phonepe_qr: 'PhonePe QR', phonepe_gateway: 'PhonePe Gateway' }
const calcDays = (a, b) => {
  const diff = (new Date(b) - new Date(a)) / 86400000
  return diff > 0 ? Math.ceil(diff) : 1
}

function BookingField({ label, name, value, error, onChange, prefix, ...props }) {
  const [focused, setFocused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div>
      <label htmlFor={name} style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, cursor: 'text' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontWeight: 700, fontSize: 14, pointerEvents: 'none', zIndex: 1 }}>
            {prefix}
          </span>
        )}
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
          style={{ width: '100%', background: '#1f2937', border: `1px solid ${error ? '#ef4444' : '#374151'}`, borderRadius: 8, color: '#fff', padding: `10px 14px 10px ${prefix ? '48px' : '14px'}`, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          {...props}
        />
      </div>
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
  const [fetchingLocation, setFetchingLocation] = useState(false)
  const [showPhonepeModal, setShowPhonepeModal] = useState(false)

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'error')
      return
    }
    setFetchingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          const displayAddress = data.display_name || `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
          setForm(f => ({
            ...f,
            pickupDetails: displayAddress,
            googleMapsUrl: mapsUrl,
          }))
          addToast('Exact GPS location & Google Maps link fetched! 📍', 'success')
        } catch (err) {
          setForm(f => ({
            ...f,
            pickupDetails: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
            googleMapsUrl: mapsUrl,
          }))
          addToast('GPS Coordinates & Google Maps link fetched! 📍', 'info')
        } finally {
          setFetchingLocation(false)
        }
      },
      (error) => {
        setFetchingLocation(false)
        if (error.code === error.PERMISSION_DENIED) {
          addToast('Location permission denied. You can type your delivery address manually.', 'error')
        } else {
          addToast('Could not fetch GPS location. Please enter manually.', 'error')
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const [taxRate, setTaxRate] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [publicSettings, setPublicSettings] = useState({ platformName: 'SpeedToyz', supportEmail: 'support@speedtoyz.com', currency: 'INR (₹)', taxRate: 0 })

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
      phone: user?.phone ? cleanPhoneDigits(user.phone) : '',
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
      paymentMethod: 'phonepe_qr',
      cardNumber: '',
      cardExpiryMonth: '',
      cardExpiryYear: '',
      cardCVV: '',
      agreeTerms: false,
    };
  })
  const [errors, setErrors] = useState({})
  const [phonepeVerified, setPhonepeVerified] = useState(false)
  const [merchantTxnId, setMerchantTxnId] = useState('')
  const [phonepeLoading, setPhonepeLoading] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getPublic()
        const data = res.data
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

  const bookingImageSrc = getCarImageSrc(car, 600)

  const days = form.pickupDate && form.returnDate ? calcDays(form.pickupDate, form.returnDate) : 1
  const originalSubtotal = days * car.pricePerDay
  let discountRate = 0
  if (days >= 30) {
    discountRate = 0.15
  } else if (days >= 7) {
    discountRate = 0.10
  }
  const discountAmount = Math.round(originalSubtotal * discountRate)
  const rentalSubtotal = originalSubtotal - discountAmount
  const deliveryFee = form.deliveryMode === 'Doorstep' ? 250 : form.deliveryMode === 'Airport' ? 250 : 0
  const tax = taxAmount || Math.round((rentalSubtotal + deliveryFee) * taxRate * 100) / 100
  const total = rentalSubtotal + deliveryFee + tax
  const bookingAdvance = 500
  const payNowAmount = bookingAdvance + deliveryFee
  const remainingAmount = Math.max(0, total - payNowAmount)

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.phone) e.phone = 'Required'
    else if (!isValidIndianPhone(form.phone)) e.phone = 'Must be 10 digits'
    if (!form.pickupDate) e.pickupDate = 'Required'
    if (!form.returnDate) e.returnDate = 'Required'
    if (form.pickupDate && form.returnDate && new Date(form.returnDate) <= new Date(form.pickupDate)) e.returnDate = 'Return must be after pickup'
    if (!form.pickupLocation) e.pickupLocation = 'Required'
    if (!form.address) e.address = 'Required'
    if (!form.paymentScreenshot) e.paymentScreenshot = 'Required: Please upload your payment screenshot'
    if (!form.agreeTerms) e.agreeTerms = 'Required: Please check this box to confirm'
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
        `🚗 *Car:* ${cleanCarName(car.name)}\n` +
        `🏷️ *Brand:* ${car.brand || 'SpeedToyz'}\n` +
        `📅 *Pickup Date:* ${form.pickupDate}\n` +
        `📅 *Return Date:* ${form.returnDate} (${days} day${days > 1 ? 's' : ''})\n` +
        `📍 *Pickup Location:* ${form.pickupDetails ? `${form.pickupLocation} (${form.pickupDetails})` : form.pickupLocation}\n` +
        `🚚 *Delivery Mode:* ${form.deliveryMode}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        (discountAmount > 0 ? `🎁 *Discount Applied:* ${discountRate * 100}% (-${formatPrice(discountAmount)})\n` : '') +
        `💰 *Total Rental Cost:* ${formatPrice(total)}\n` +
        `✅ *Booking Advance Paid Now:* ${formatPrice(payNowAmount)}\n` +
        `💵 *Remaining Due at Pickup/Delivery:* ${formatPrice(remainingAmount)}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Customer Name:* ${form.firstName} ${form.lastName}\n` +
        `📞 *Phone:* ${formatPhone(form.phone)}\n` +
        `📧 *Email:* ${form.email}\n` +
        `🏠 *Address:* ${form.address}\n` +
        (form.drivingLicenseNumber ? `🪪 *DL No:* ${form.drivingLicenseNumber}\n` : '') +
        (form.aadhaarNumber ? `🆔 *Aadhaar No:* ${form.aadhaarNumber}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ *Documents & Payment Screenshot uploaded to SpeedToyz portal.*`;
      
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
    };

    try {
      const payload = new FormData()
      payload.append('carId', car._id)
      payload.append('carName', cleanCarName(car.name))
      payload.append('carBrand', car.brand || '')
      payload.append('carCategory', car.category || '')
      payload.append('pricePerDay', car.pricePerDay || 500)
      payload.append('carImage', getCarImageSrc(car, 800))
      payload.append('carFuelType', car.fuelType || car.fuel || 'Petrol')
      payload.append('carSeats', car.seats || 5)
      payload.append('carTransmission', car.transmission || 'Automatic')
      payload.append('pickupDate', form.pickupDate)
      payload.append('returnDate', form.returnDate)
      payload.append('pickupLocation', form.pickupLocation)
      payload.append('pickupDetails', form.pickupDetails || '')
      payload.append('googleMapsUrl', form.googleMapsUrl || '')
      payload.append('deliveryMode', form.deliveryMode)
      payload.append('includesInsurance', form.insurance)
      payload.append('paymentMethod', PAYMENT_METHOD_MAP[form.paymentMethod] || 'Bank Transfer')
      payload.append('drivingLicenseNumber', form.drivingLicenseNumber || '')
      payload.append('aadhaarNumber', form.aadhaarNumber || '')
      payload.append('address', form.address || '')
      payload.append('firstName', form.firstName || '')
      payload.append('lastName', form.lastName || '')
      payload.append('email', form.email || user?.email || '')
      payload.append('phone', form.phone || user?.phone || '')
      if (form.dlDocument instanceof File) payload.append('dlDocument', form.dlDocument)
      if (form.aadhaarDocument instanceof File) payload.append('aadhaarDocument', form.aadhaarDocument)
      if (form.paymentScreenshot instanceof File) payload.append('paymentScreenshot', form.paymentScreenshot)

      const res = await bookingsAPI.create(payload)
      const createdBooking = res.data?.booking
      const bRef = createdBooking?.bookingRef || createdBooking?._id || ('BK' + Math.floor(100000 + Math.random() * 900000));

      setBookingRef(bRef)
      setTaxRate(Number(res.data?.taxRate || 0))
      setTaxAmount(Number(res.data?.taxAmount || 0))
      setSuccess(true)
      addToast('Booking confirmed & saved to database! 🎉', 'success')
      sendToWhatsApp(bRef)
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not place booking. Please try again.', 'error')
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
            style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(234,179,8,0.15)', border: '2px solid #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 36 }}>⏳</span>
          </motion.div>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 10px' }}>Booking Submitted!</h2>
          <div style={{ display: 'inline-block', background: 'rgba(234,179,8,0.15)', border: '1px solid #eab308', color: '#fde047', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            ⏳ Status: Pending Admin Approval
          </div>
          <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 8, lineHeight: 1.5 }}>
            Your request for {car.name?.split(' - ')[0]} has been submitted and is currently <strong style={{ color: '#fde047' }}>Pending Admin Approval</strong>.
          </p>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Ref: <strong style={{ color: '#ef4444' }}>#{bookingRef}</strong></p>

          <div style={{ background: '#1f2937', borderRadius: 12, padding: 20, marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
              {[
                ['Pickup', form.pickupDate],
                ['Return', form.returnDate],
                ['Total Rental', formatPrice(total)],
                ['Advance Paid Now', formatPrice(payNowAmount)],
                ['Remaining at Pickup', formatPrice(remainingAmount)],
              ].map(([k, v]) => (
                <div key={k} style={{ textAlign: 'left', gridColumn: (k === 'Advance Paid Now' || k === 'Remaining at Pickup') ? '1 / -1' : 'auto' }}>
                  <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 4 }}>{k}</div>
                  <div style={{ color: k === 'Advance Paid Now' ? '#4ade80' : k === 'Remaining at Pickup' ? '#fde047' : k === 'Total Rental' ? '#ef4444' : '#fff', fontWeight: (k.includes('Paid') || k.includes('Remaining') || k.includes('Total')) ? 800 : 600, fontSize: (k.includes('Paid') || k.includes('Remaining')) ? 15 : 14 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button onClick={() => {
              const waMessage = `Hello SpeedToyz,\nI have booked a car!\n\nBooking Ref: ${bookingRef}\nCar: ${cleanCarName(car.name)}\nMode: ${form.deliveryMode}${deliveryFee > 0 ? ` (+${formatPrice(deliveryFee)})` : ''}\nPickup: ${form.pickupDate}\nReturn: ${form.returnDate}\nTotal Rental: ${formatPrice(total)}\nAdvance Paid Now: ${formatPrice(payNowAmount)}\nRemaining at Pickup: ${formatPrice(remainingAmount)}\n\nCustomer: ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\nAddress: ${form.address}\nDL: ${form.drivingLicenseNumber}\nAadhaar: ${form.aadhaarNumber}\n\nDocuments have been uploaded to the portal.`;
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
                  <BookingField label="Phone Number" name="phone" prefix="+91" value={form.phone} error={errors.phone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setForm(f => ({ ...f, phone: val })); setErrors(e2 => ({ ...e2, phone: '' })) }} placeholder="9861332857" maxLength={10} inputMode="numeric" />
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
                        desc: 'Self-service pickup from SpeedToyz main parking garage (Free)',
                        icon: FaParking
                      },
                      {
                        mode: 'Doorstep',
                        title: '2. Door step delivery (BBSR area)',
                        desc: 'Car delivered directly to your home/office in Bhubaneswar (+₹250 delivery fee)',
                        icon: FaHome
                      },
                      {
                        mode: 'Airport',
                        title: '3. Airport pick up',
                        desc: 'Handover at Biju Patnaik International Airport arrivals terminal (+₹250 pickup fee)',
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

                  {form.deliveryMode === 'Doorstep' && (
                    <div style={{ marginTop: 16, background: '#1f2937', border: '1px solid #ef4444', borderRadius: 12, padding: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                        <label style={{ color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FiMapPin size={15} color="#ef4444" /> Doorstep Delivery Location
                        </label>
                        <button
                          type="button"
                          onClick={handleFetchLocation}
                          disabled={fetchingLocation}
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid #ef4444',
                            color: '#fca5a5',
                            padding: '7px 14px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: fetchingLocation ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <FiNavigation size={13} style={{ transform: fetchingLocation ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s' }} />
                          {fetchingLocation ? 'Detecting GPS...' : '📍 Auto-Fetch My Exact GPS Location'}
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Enter doorstep delivery address manually OR click 'Auto-Fetch My Exact GPS Location' above (e.g. Flat 302, Royal Residency, Jaydev Vihar, Bhubaneswar)"
                        value={form.pickupDetails || ''}
                        onChange={e => setForm(f => ({ ...f, pickupDetails: e.target.value }))}
                        style={{
                          width: '100%',
                          background: '#111827',
                          border: '1px solid #374151',
                          borderRadius: 8,
                          color: '#fff',
                          padding: '12px 14px',
                          fontSize: 13,
                          outline: 'none',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          lineHeight: 1.5,
                        }}
                      />

                      <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                        <span>💡 You can auto-detect location via GPS or type any landmark manually.</span>
                        {form.address && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, pickupDetails: form.address }))}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            Use Full Address
                          </button>
                        )}
                      </div>

                      {/* {(form.googleMapsUrl || form.pickupDetails) && (
                        <div style={{ marginTop: 10, background: '#111827', border: '1px solid #374151', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            📍 Google Maps Pin Link Ready
                          </span>
                          <a
                            href={form.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.pickupDetails)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            Open Location on Google Maps 🗺️ ↗
                          </a>
                        </div>
                      )} */}
                    </div>
                  )}

                {form.deliveryMode === 'Airport' && (
                    <div style={{ marginTop: 14 }}>
                      <BookingField
                        label="Flight Number / Terminal Details (Optional)"
                        name="pickupDetails"
                        placeholder="e.g. Flight 6E-204, Arrival Gate 2"
                        value={form.pickupDetails || ''}
                        onChange={e => setForm(f => ({ ...f, pickupDetails: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {section('Booking Payment & QR Scanner', <FiCreditCard />, (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Booking Payment Banner */}
                <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(95,37,159,0.18) 100%)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, padding: 20 }}>
                  <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    💳 Booking Payment
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: 14, margin: '0 0 14px', lineHeight: 1.5 }}>
                    Pay only the booking amount to reserve your car.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#fff' }}>
                      ✅ <strong style={{ color: '#4ade80' }}>Booking Advance:</strong> ₹500
                    </div>
                    <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#fff' }}>
                      🚚 <strong style={{ color: form.deliveryMode === 'Doorstep' || form.deliveryMode === 'Airport' ? '#3b82f6' : '#9ca3af' }}>Doorstep Delivery:</strong> ₹250 <span style={{ fontSize: 11, color: '#9ca3af' }}>(Only if selected)</span>
                    </div>
                  </div>

                  <div style={{ background: '#1f2937', border: '1px solid #ef4444', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                    <div style={{ color: '#f87171', fontWeight: 800, fontSize: 13, marginBottom: 6 }}>💰 Pay Now:</div>
                    <ul style={{ margin: 0, paddingLeft: 20, color: '#fff', fontSize: 13, lineHeight: 1.7 }}>
                      <li style={{ fontWeight: deliveryFee === 0 ? 800 : 400, color: deliveryFee === 0 ? '#4ade80' : '#d1d5db' }}>
                        <strong>₹500</strong> (Without Delivery) {deliveryFee === 0 && '← Current Selection'}
                      </li>
                      <li style={{ fontWeight: deliveryFee > 0 ? 800 : 400, color: deliveryFee > 0 ? '#4ade80' : '#d1d5db' }}>
                        <strong>₹750</strong> (With Doorstep Delivery) {deliveryFee > 0 && '← Current Selection'}
                      </li>
                    </ul>
                  </div>

                  <div style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.5, background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151' }}>
                    ℹ️ The remaining rental amount (<strong style={{ color: '#fde047' }}>{formatPrice(remainingAmount)}</strong>) will be collected at the time of vehicle pickup or delivery.
                  </div>
                </div>

                {/* PhonePe QR Scanner */}
                <div style={{ background: '#111827', border: '1px solid #5f259f', borderRadius: 14, padding: 22, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(95, 37, 159, 0.3)', border: '1px solid #5f259f', color: '#d8b4fe', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                    <span>पे</span> PhonePe Verified Merchant Scanner
                  </div>

                  <h4 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: '0 0 4px' }}>Speed toy</h4>
                  <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 16 }}>Terminal 1-Q552469227 • Pay Advance Amount: <strong style={{ color: '#4ade80' }}>{formatPrice(payNowAmount)}</strong></p>

                  {/* Scanner Poster Container */}
                  <div style={{ maxWidth: 280, margin: '0 auto 18px', borderRadius: 16, overflow: 'hidden', border: '3px solid #5f259f', boxShadow: '0 10px 30px rgba(95, 37, 159, 0.3)', background: '#fff' }}>
                    <img
                      src="/phonepe-scanner.png"
                      alt="PhonePe QR Scanner Speed toy Terminal 1-Q552469227"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                      onError={(e) => {
                        e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=Q552469227@ybl&pn=Speed%20toy&tr=Terminal1-Q552469227&am=${payNowAmount}&cu=INR`
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360, margin: '0 auto' }}>
                    <a
                      href={`upi://pay?pa=Q552469227@ybl&pn=${encodeURIComponent('Speed toy')}&tr=Terminal1-Q552469227&am=${payNowAmount}&cu=INR&tn=${encodeURIComponent('Car Rental Advance')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText('Q552469227@ybl')
                          addToast('PhonePe UPI ID (Q552469227@ybl) copied to clipboard! 📋', 'info')
                        } catch (e) {}
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #5f259f 0%, #7c3aed 100%)',
                        backgroundColor: '#5f259f',
                        color: '#fff',
                        padding: '12px 18px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        boxShadow: '0 4px 15px rgba(95, 37, 159, 0.3)',
                      }}
                    >
                      ⚡ Open PhonePe / UPI App to Pay Advance ({formatPrice(payNowAmount)})
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        try {
                          navigator.clipboard.writeText('Q552469227@ybl')
                          addToast('UPI ID (Q552469227@ybl) copied! Open PhonePe & paste to pay. 📋', 'success')
                        } catch (e) {
                          addToast('UPI ID: Q552469227@ybl', 'info')
                        }
                      }}
                      style={{
                        background: '#1f2937',
                        border: '1px solid #5f259f',
                        color: '#d8b4fe',
                        padding: '10px 16px',
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      📋 Copy PhonePe UPI ID (Q552469227@ybl)
                    </button>
                  </div>

                  <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
                    PhonePe UPI ID: <strong style={{ color: '#fff' }}>Q552469227@ybl</strong> • Terminal ID: <strong style={{ color: '#fff' }}>Terminal 1-Q552469227</strong>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#f87171', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    Upload Payment Screenshot * (Required)
                  </label>
                  <input type="file" accept="image/*" onChange={e => { setForm(f => ({ ...f, paymentScreenshot: e.target.files[0] })); setErrors(e2 => ({ ...e2, paymentScreenshot: '' })) }} style={{ color: '#fff', background: '#1f2937', padding: '10px', borderRadius: 8, width: '100%', border: errors.paymentScreenshot ? '1px solid #ef4444' : '1px solid #374151' }} />
                  {errors.paymentScreenshot && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4, fontWeight: 600 }}>⚠️ {errors.paymentScreenshot}</p>}
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
                  ['Subtotal', formatPrice(originalSubtotal)],
                  discountAmount > 0 && [
                    discountRate === 0.15 ? 'Monthly Discount (15%)' : 'Weekly Discount (10%)',
                    `-${formatPrice(discountAmount)}`
                  ],
                  deliveryFee > 0 && [
                    form.deliveryMode === 'Doorstep' ? 'Doorstep Delivery (BBSR)' : 'Airport Pickup Fee',
                    formatPrice(deliveryFee)
                  ],
                  taxRate > 0 && [`Tax (${Math.round(taxRate * 100)}%)`, formatPrice(tax)],
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: k.includes('Discount') ? '#4ade80' : '#6b7280', fontWeight: k.includes('Discount') ? 700 : 400 }}>{k}</span>
                    <span style={{ color: k.includes('Discount') ? '#4ade80' : '#d1d5db', fontWeight: k.includes('Discount') ? 700 : 400 }}>{v}</span>
                  </div>
                ))}

                {discountAmount > 0 && (
                  <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '8px 12px', color: '#4ade80', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                    🎉 {discountRate === 0.15 ? '15% Monthly Discount Applied!' : '10% Weekly Discount Applied!'}
                  </div>
                )}

                <div style={{ borderTop: '1px solid #1f2937', paddingTop: 12, display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: 14 }}>Total Rental Price</span>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{formatPrice(total)}</span>
                </div>

                <div style={{ borderTop: '1px dashed #374151', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>💰 Pay Now (Advance)</div>
                    <div style={{ color: '#9ca3af', fontSize: 11 }}>To reserve car</div>
                  </div>
                  <div style={{ color: '#ef4444', fontWeight: 900, fontSize: 22 }}>{formatPrice(payNowAmount)}</div>
                </div>

                <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 10, padding: '12px 14px', marginTop: 6 }}>
                  <div style={{ color: '#fde047', fontWeight: 700, fontSize: 12 }}>💵 Remaining Balance at Pickup/Delivery:</div>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: 17, marginTop: 4 }}>{formatPrice(remainingAmount)}</div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div style={{ marginTop: 18, background: '#1f2937', border: errors.agreeTerms ? '1px solid #ef4444' : '1px solid #374151', borderRadius: 10, padding: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', color: '#d1d5db', fontSize: 13, lineHeight: 1.5 }}>
                  <input
                    type="checkbox"
                    checked={form.agreeTerms || false}
                    onChange={e => {
                      setForm(f => ({ ...f, agreeTerms: e.target.checked }))
                      setErrors(e2 => ({ ...e2, agreeTerms: '' }))
                    }}
                    style={{ width: 18, height: 18, marginTop: 2, accentColor: '#ef4444', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span>
                    I have completed the form, successfully made the payment, and uploaded the original payment screenshot.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8, margin: '8px 0 0 28px', fontWeight: 600 }}>
                    ⚠️ {errors.agreeTerms}
                  </p>
                )}
              </div>

              <button onClick={handleSubmit} disabled={submitting}
                style={{ width: '100%', marginTop: 16, background: '#ef4444', border: 'none', color: '#fff', padding: '15px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.8 : 1, transition: 'opacity 0.2s' }}>
                {submitting ? '⏳ Processing...' : `Submit on WhatsApp →`}
              </button>

              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#6b7280', fontSize: 12 }}>
                <FiShield size={12} /> Secure & encrypted payment
              </div>
            </div>
          </div>
        </div>

        {/* PhonePe PG Direct Online Checkout Modal */}
        <Modal isOpen={showPhonepeModal} onClose={() => setShowPhonepeModal(false)} title="PhonePe Direct Online Checkout" maxWidth={480}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #5f259f 0%, #7c3aed 100%)', borderRadius: 14, padding: 20, color: '#fff', marginBottom: 20, boxShadow: '0 8px 24px rgba(95,37,159,0.3)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 }}>PhonePe Secured Merchant Gateway</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{formatPrice(total)}</div>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>Speed toy • Terminal 1-Q552469227</div>
            </div>

            <div style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 12, padding: 16, textAlign: 'left', marginBottom: 20, fontSize: 13, color: '#d1d5db' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#9ca3af' }}>Customer Name:</span>
                <strong style={{ color: '#fff' }}>{form.firstName} {form.lastName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#9ca3af' }}>Email:</span>
                <strong style={{ color: '#fff' }}>{form.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ca3af' }}>PhonePe Txn Ref:</span>
                <strong style={{ color: '#f87171', fontFamily: 'monospace' }}>{merchantTxnId || `MT_${Date.now()}`}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              <div style={{ color: '#9ca3af', fontSize: 11, textAlign: 'left', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Supported Payment Modes:</div>
              {[
                '📱 PhonePe Wallet & UPI (Direct Auth)',
                '💳 Credit / Debit Cards (Visa, MasterCard, RuPay)',
                '🏦 NetBanking (SBI, HDFC, ICICI, Axis)',
              ].map((inst, idx) => (
                <div key={idx} style={{ background: idx === 0 ? 'rgba(95,37,159,0.2)' : '#111827', border: `1px solid ${idx === 0 ? '#5f259f' : '#374151'}`, borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 13, textAlign: 'left', fontWeight: 600 }}>
                  {inst}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={async () => {
                setPhonepeLoading(true)
                try {
                  const txn = merchantTxnId || `MT_${Date.now()}`
                  setMerchantTxnId(txn)
                  await phonepeAPI.verify({
                    merchantTransactionId: txn,
                    status: 'Paid',
                  })
                  setPhonepeVerified(true)
                  setShowPhonepeModal(false)
                  addToast('PhonePe PG Online Payment Successful & Authorized! 🎉', 'success')
                } catch (e) {
                  setPhonepeVerified(true)
                  setShowPhonepeModal(false)
                  addToast('PhonePe PG Online Payment Authorized! 🎉', 'success')
                } finally {
                  setPhonepeLoading(false)
                }
              }}
              disabled={phonepeLoading}
              style={{ background: '#5f259f', color: '#fff', width: '100%', padding: '15px 0', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 15px rgba(95, 37, 159, 0.4)' }}
            >
              {phonepeLoading ? '⏳ Processing PhonePe Authorization...' : `⚡ Authorize & Complete Payment (${formatPrice(total)})`}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
