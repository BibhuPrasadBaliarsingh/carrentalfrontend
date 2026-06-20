import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShield, FiZap, FiStar, FiArrowRight, FiMapPin, FiCalendar, FiCheckCircle, FiClock, FiPhone, FiCompass } from 'react-icons/fi'
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
      title: 'Fully insured self-drive rentals',
      desc: 'Every ride comes with verified insurance, roadside support, and clean vehicles ready for Bhubaneswar and Odisha road trips.',
    },
    {
      icon: <FiZap size={28} color="#ef4444" />,
      title: 'Instant doorstep delivery',
      desc: 'Reserve your SUV, hatchback, or premium sedan in minutes with flexible pickup and delivery across Bhubaneswar.',
    },
    {
      icon: <FiStar size={28} color="#ef4444" />,
      title: 'Luxury & budget-friendly fleet',
      desc: 'Choose from 80+ cars, from affordable daily rentals to premium self-drive options for family trips and business travel.',
    },
    {
      icon: <FiClock size={28} color="#ef4444" />,
      title: '24/7 support team',
      desc: 'Our travel experts and support team help with route guidance, booking assistance, and quick help whenever you need it.',
    },
  ]

  const seoHighlights = [
    { heading: 'Self-drive car rental in Bhubaneswar', detail: 'Book a clean, insured SUV or sedan for city trips, airport transfers, and weekend outings with zero hassle.' },
    { heading: 'Affordable car rental in Odisha', detail: 'Enjoy transparent pricing, daily packages, and premium vehicles tailored for couples, families, and corporate travellers.' },
    { heading: 'Premium SUV and hatchback booking', detail: 'Select from compact cars, premium SUVs, and stylish sedans to match your comfort, budget, and travel plan.' },
    { heading: '24/7 support & doorstep delivery', detail: 'Travel confidently with flexible pickup, local guidance, and quick support from our dedicated rental team.' },
  ]

  const odishaHighlights = [
    'Puri, Konark, and Chilika road trip ready vehicles',
    'Airport pickup, hotel drop, and city-to-city delivery',
    'Clean, serviced cars for business and leisure travel',
    'Flexible daily, weekend, and outstation rental plans',
    'Safe self-drive options for couples, families, and groups',
    'Local tourism guidance for Odisha travel and sightseeing',
    'Fuel-efficient cars for long scenic drives',
    'Easy online booking with quick confirmation support',
  ]

  const testimonials = [
    { name: 'Pritam Sahoo', quote: 'I would say best service in very less price compared to their competitors.' },
    { name: 'Amlan Biswas', quote: 'Great experience and staff behaviour are so good.' },
    { name: 'Arya Nandini', quote: 'Excellent staffs! condition of car is very good ! reasonable price' },
    { name: 'Pratham Raj', quote: 'Loved the wide selection of cars they had available. The rental process was quick, and the car performed flawlessly throughout my journey.' },
    { name: 'Chinmaya Mahanta', quote: 'One of the most trusted self driving car company. The rent of all cars price is absolutely mind blowing 😍. Car conditions are good as compare to other self rental car.' },
    { name: 'Sanath', quote: 'Really nice folks. The cars are in good condition, and the terms and conditions are very clear. Loved the attitude of the people.on charge.' },
    { name: 'Satya Swaroop Das', quote: 'I had awesome experience. Brand new car and in prime condition. The process was super smooth. Very reasonable price. Would recommend highly.' },
    { name: 'Biswajeet Choudhury', quote: 'The cars i have taken from them are all in good shape and new cars. Everytime i come to bhubaneswar, i make sure to take the self drive cars from Sambit. Really satisfied and glad to be using the cars for my commute in and around bhubaneswar.' },
  ]

  const faqs = [
    { q: 'Do you provide self-drive cars in Bhubaneswar?', a: 'Yes, we offer self-drive car rental in Bhubaneswar with insured and well-maintained vehicles for city and outstation travel.' },
    { q: 'Can I book an SUV or premium sedan for a weekend trip?', a: 'Absolutely. You can choose from compact, premium, SUV, and luxury cars based on your trip purpose and budget.' },
    { q: 'Do you offer pickup and delivery?', a: 'Yes, our team provides flexible pickup and doorstep delivery in Bhubaneswar and nearby routes for convenience.' },
    { q: 'Is there 24/7 support available?', a: 'Yes, our support team is available round the clock for booking help, trip guidance, and quick assistance.' },
  ]

  const stats = [
    { val: '80+', label: 'Cars' },
    { val: '20K+', label: 'Happy Clients' },
    { val: '4.9★', label: 'Rating' },
    { val: '24/7', label: 'Support' },
  ]

  return (
    <div style={{ background: '#0a0a0a' }}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: isMobile ? 460 : 600, height: isMobile ? 'auto' : 600, overflow: 'hidden', paddingTop: isMobile ? 18 : 0 }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80"
          alt="hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0 }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-start' : 'center', padding: isMobile ? '18px 16px 24px' : '0 80px', maxWidth: 1280, margin: '0 auto', left: 0, right: 0 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 14px', marginBottom: 20 }}>
              <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Premium Car Rental</span>
            </div>
            <h1 style={{ color: '#fff', fontSize: isMobile ? 32 : 60, fontWeight: 900, lineHeight: isMobile ? 1.2 : 1.08, margin: '0 0 16px', letterSpacing: -1 }}>
              Best Self Drive & Luxury Car Rental in Bhubaneswar
            </h1>
            <p style={{ color: '#9ca3af', fontSize: isMobile ? 13 : 18, maxWidth: isMobile ? 340 : 580, marginBottom: isMobile ? 24 : 28, lineHeight: 1.6 }}>
              Book premium SUVs, hatchbacks, and self-drive cars instantly with clean vehicles, easy booking, and 24/7 support across Odisha.
            </p>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 14, width: isMobile ? '100%' : 'auto' }}>
              <button onClick={() => navigate('/cars')} className="btn-primary" style={{ border: 'none', color: '#fff', padding: isMobile ? '12px 28px' : '14px 34px', borderRadius: 10, fontSize: isMobile ? 15 : 16, fontWeight: 700, cursor: 'pointer', flex: isMobile ? 1 : 'none' }}>
                Explore Now
              </button>
              <button onClick={() => navigate('/cars')} className="btn-outline" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: isMobile ? '12px 24px' : '14px 32px', borderRadius: 10, fontSize: isMobile ? 15 : 16, fontWeight: 600, cursor: 'pointer', flex: isMobile ? 1 : 'none' }}>
                Browse Cars
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 16 : 40, marginTop: isMobile ? 24 : 52 }}>
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
          style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: isMobile ? '14px 14px' : '24px 28px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr) auto', gap: isMobile ? 10 : 16, alignItems: 'end', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
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

      {/* ── Booking Highlight ─────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '32px 16px 0' : '56px 80px 0', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, minHeight: isMobile ? 320 : 420, border: '1px solid #1f2937', boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80" alt="Luxury car background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.75) 45%, rgba(5,5,5,0.4) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '24px 18px' : '42px 48px', maxWidth: 740 }}>
            <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Top Booking Page</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 24 : 38, lineHeight: 1.15, fontWeight: 800, margin: '0 0 14px' }}>
              Best Self Drive car rental in Bhubaneswar — instantly cleaned, premium, and hassle-free delivery all over the city.
            </h2>
            <p style={{ color: '#e5e7eb', fontSize: isMobile ? 13 : 16, lineHeight: 1.7, maxWidth: 620, marginBottom: 18 }}>
              Pick a premium SUV, sedan, or hatchback for airport transfer, city rides, business travel, or a smooth Odisha road trip with simple booking and no stress.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['80+ Cars', '24/7 Support', 'Doorstep Delivery', 'Odisha Travel Friendly'].map(tag => (
                <span key={tag} style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(17,24,39,0.8)', color: '#fff', borderRadius: 999, padding: '8px 12px', fontSize: 13, fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* ── SEO Content Blocks ────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '40px 16px' : '72px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 18 }}>
          {seoHighlights.map(item => (
            <article key={item.heading} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 18, padding: isMobile ? 18 : 22 }}>
              <h4 style={{ color: '#fff', fontSize: isMobile ? 15 : 18, fontWeight: 700, marginBottom: 8 }}>{item.heading}</h4>
              <p style={{ color: '#cbd5e1', fontSize: isMobile ? 13 : 14, lineHeight: 1.7, margin: 0 }}>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Fleet Scroll ───────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '0 16px 40px' : '0 80px 72px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Fleet</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>Choose yours from a fleet of 80+ cars</h2>
          </div>
          <button onClick={() => navigate('/cars')} style={{ border: '1px solid #374151', background: 'transparent', color: '#d1d5db', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Book Now</button>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track" style={{ display: 'flex', gap: 18, width: 'max-content', animation: 'marqueeLeft 28s linear infinite' }}>
            {(cars.length ? cars : MOCK_CARS).concat(cars.length ? cars : MOCK_CARS).slice(0, 16).map((car, i) => (
              <div key={`${car._id || car.name}-${i}`} style={{ minWidth: isMobile ? 260 : 320, maxWidth: isMobile ? 260 : 320 }}>
                <CarCard car={car} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#050505', padding: isMobile ? '40px 16px' : '72px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#ef4444', fontSize: isMobile ? 11 : 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Why Us</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: -1 }}>
              Why Choose <span style={{ color: '#ef4444' }}>Speed Toyz Cars</span>?
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

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section style={{ background: '#050505', padding: isMobile ? '40px 16px' : '72px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Testimonials</div>
              <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>What travellers say about Speed Toyz Cars</h2>
            </div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div className="marquee-track-reverse" style={{ display: 'flex', gap: 18, width: 'max-content', animation: 'marqueeRight 50s linear infinite' }}>
              {testimonials.concat(testimonials).map((t, i) => (
                <article key={`${t.name}-${i}`} style={{ minWidth: isMobile ? 280 : 340, background: '#111827', border: '1px solid #1f2937', borderRadius: 18, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FFD700', marginBottom: 10 }}><FiStar /> <FiStar /> <FiStar /> <FiStar /> <FiStar /></div>
                  <p style={{ color: '#e5e7eb', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{t.quote}</p>
                  <strong style={{ color: '#fff', fontSize: 14 }}>{t.name}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Highlights of Us ──────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '40px 16px' : '72px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Highlights</div>
          <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 32, fontWeight: 800, margin: '0 0 10px', letterSpacing: -1 }}>Odisha tourism, self-drive freedom, and 24/7 support</h2>
          <p style={{ color: '#9ca3af', maxWidth: 640, margin: '0 auto', fontSize: isMobile ? 13 : 15 }}>From city rides to beach trips, our rentals are designed for easy Odisha travel and smooth self-drive experiences.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 18 }}>
          {odishaHighlights.map((item, i) => (
            <article key={item} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 18, padding: 18, display: 'flex', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}><FiCompass size={16} /></div>
              <p style={{ color: '#e5e7eb', margin: 0, fontSize: 14, lineHeight: 1.7 }}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? '0 16px 40px' : '0 80px 72px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>FAQ</div>
          <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {faqs.map((item, i) => (
            <details key={item.q} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: '14px 16px' }}>
              <summary style={{ color: '#fff', fontWeight: 700, cursor: 'pointer', listStyle: 'none' }}>{item.q}</summary>
              <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>{item.a}</p>
            </details>
          ))}
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
