import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiZap, FiStar, FiArrowRight, FiMapPin, FiCalendar } from 'react-icons/fi'
import CarCard from '../components/CarCard'
import { CarCardSkeleton } from '../components/UI'
import { carsAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'

export default function HomePage() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({ pickup: '', dropoff: '', pickupDate: '', returnDate: '' })
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
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll({ limit: 6 })
        setCars(res.data.cars || res.data)
      } catch {
        setCars(MOCK_CARS.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search.pickup) params.set('location', search.pickup)
    if (search.pickupDate) params.set('pickupDate', search.pickupDate)
    if (search.returnDate) params.set('returnDate', search.returnDate)
    navigate(`/cars?${params.toString()}`)
  }

  const features = [
    {
      icon: <FiShield size={28} color="#ef4444" />,
      title: 'Fully Insured',
      desc: 'All vehicles come with comprehensive insurance coverage for complete peace of mind during your rental period.',
    },
    {
      icon: <FiZap size={28} color="#ef4444" />,
      title: 'Instant Booking',
      desc: 'Book your dream car in minutes. No lengthy paperwork or waiting periods – get on the road instantly.',
    },
    {
      icon: <FiStar size={28} color="#ef4444" />,
      title: 'Premium Fleet',
      desc: 'Choose from an exclusive collection of luxury and sports cars maintained to the absolute highest standards.',
    },
  ]

  const stats = [
    { val: '500+', label: 'Luxury Cars' },
    { val: '50K+', label: 'Happy Clients' },
    { val: '4.9★', label: 'Rating' },
    { val: '24/7', label: 'Support' },
  ]

  return (
    <div style={{ background: '#0a0a0a' }}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: isMobile ? 400 : 600, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80"
          alt="hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0 }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '0 16px' : '0 80px', maxWidth: 1280, margin: '0 auto', left: 0, right: 0 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 14px', marginBottom: 20 }}>
              <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Premium Car Rental</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: isMobile ? 32 : 60, fontWeight: 900, lineHeight: isMobile ? 1.2 : 1.08, margin: '0 0 16px', letterSpacing: -1 }}>
              {isMobile ? 'Rent Premium\nCars, Instantly.' : 'Rent Premium Cars,'}{
                !isMobile && <br />
              }
              {!isMobile && <span style={{ color: '#ef4444' }}>Instantly.</span>}
              {isMobile && <span style={{ color: '#ef4444' }}>{' Instantly.'}</span>}
            </h1>
            <p style={{ color: '#9ca3af', fontSize: isMobile ? 13 : 18, maxWidth: isMobile ? 320 : 480, marginBottom: isMobile ? 24 : 36, lineHeight: 1.6 }}>
              Experience luxury vehicles from $100/day and above.
            </p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 14, width: isMobile ? '100%' : 'auto' }}>
              <button onClick={() => navigate('/cars')} className="btn-primary" style={{ border: 'none', color: '#fff', padding: isMobile ? '12px 28px' : '14px 34px', borderRadius: 10, fontSize: isMobile ? 15 : 16, fontWeight: 700, cursor: 'pointer', flex: isMobile ? 1 : 'none' }}>
                Explore Now
              </button>
              <button onClick={() => navigate('/cars')} className="btn-outline" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: isMobile ? '12px 24px' : '14px 32px', borderRadius: 10, fontSize: isMobile ? 15 : 16, fontWeight: 600, cursor: 'pointer', flex: isMobile ? 1 : 'none' }}>
                Browse Cars
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 24 : 40, marginTop: isMobile ? 36 : 52 }}>
              {stats.map(({ val, label }) => (
                <div key={label}>
                  <div style={{ color: '#ef4444', fontSize: isMobile ? 20 : 28, fontWeight: 900 }}>{val}</div>
                  <div style={{ color: '#9ca3af', fontSize: isMobile ? 12 : 13, marginTop: 4, fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Search Bar ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: isMobile ? '-18px auto 0' : '-36px auto 0', padding: isMobile ? '0 12px' : '0 40px', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: isMobile ? '14px 14px' : '24px 28px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr auto' : '1fr 1fr 1fr 1fr auto', gap: isMobile ? 10 : 16, alignItems: 'end', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {[
            { label: 'Pickup Location', icon: <FiMapPin />, key: 'pickup', type: 'text', placeholder: 'City or Airport' },
            { label: 'Dropoff Location', icon: <FiMapPin />, key: 'dropoff', type: 'text', placeholder: 'Same as pickup' },
            { label: 'Pickup Date', icon: <FiCalendar />, key: 'pickupDate', type: 'date', placeholder: '' },
            { label: 'Return Date', icon: <FiCalendar />, key: 'returnDate', type: 'date', placeholder: '' },
          ].map(({ label, icon, key, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', color: '#6b7280', fontSize: isMobile ? 10 : 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: isMobile ? 4 : 8 }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 14 }}>{icon}</span>
                <input type={type} value={search[key]} onChange={e => setSearch(s => ({ ...s, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: isMobile ? '8px 10px 8px 32px' : '10px 12px 10px 36px', fontSize: isMobile ? 13 : 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
          ))}
          <button onClick={handleSearch} className="btn-primary" style={{ border: 'none', color: '#fff', padding: isMobile ? '8px 16px' : '11px 28px', borderRadius: 8, fontSize: isMobile ? 13 : 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
            {isMobile ? 'Search' : 'Search Now'}
          </button>
        </motion.div>
      </div>

      {/* ── Popular Cars ───────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '40px 16px' : '80px 80px 48px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: 36, gap: 16 }}>
          <div>
            <div style={{ color: '#ef4444', fontSize: isMobile ? 11 : 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Our Fleet</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 34, fontWeight: 800, margin: 0, letterSpacing: -1 }}>Popular Cars</h2>
            <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 15, marginTop: 8 }}>Discover our most sought-after premium vehicles</p>
          </div>
          {!isMobile && (
            <button onClick={() => navigate('/cars')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #374151', color: '#9ca3af', padding: '10px 20px', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.color = '#9ca3af' }}>
              View All <FiArrowRight size={15} />
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 24 }}>
          {loading
            ? Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
            : cars.slice(0, 6).map((car, i) => <CarCard key={car._id} car={car} index={i} />)
          }
        </div>
      </section>

      {/* ── Why Choose ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#050505', padding: isMobile ? '40px 16px' : '72px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#ef4444', fontSize: isMobile ? 11 : 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Why Us</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: -1 }}>
              Why Choose <span style={{ color: '#ef4444' }}>SpeedToyz</span>?
            </h2>
            <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 16, maxWidth: 480, margin: '0 auto' }}>
              We deliver the finest automotive experiences with unmatched service and care.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: isMobile ? 20 : 36, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  {f.icon}
                </div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 14, lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=80" alt="cta" style={{ width: '100%', height: isMobile ? 180 : 300, objectFit: 'cover', opacity: 0.25 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.7))', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '20px 16px' : '0 120px', gap: 20 }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 36, fontWeight: 900, margin: '0 0 8px', letterSpacing: -1 }}>Ready to Drive?</h2>
            <p style={{ color: '#9ca3af', fontSize: isMobile ? 13 : 14, margin: 0 }}>Book your premium vehicle today and experience luxury on wheels.</p>
          </div>
          <button onClick={() => navigate('/cars')} className="btn-primary" style={{ border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', width: isMobile ? '100%' : 'auto' }}>
            Browse Cars →
          </button>
        </div>
      </section>

    </div>
  )
}
