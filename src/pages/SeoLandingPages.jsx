import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiShield, FiClock, FiMapPin, FiTruck, FiCalendar, FiUsers, FiZap, FiSettings, FiHelpCircle, FiChevronRight, FiPhone } from 'react-icons/fi'
import { useLoader } from '../context/LoaderContext'
import { useSeoHead } from '../hooks/useSeoHead'
import CarCard from '../components/CarCard'
import { MOCK_CARS } from '../data/mockData'
import { carsAPI } from '../services/api'

// ─── Shared UI Helpers ────────────────────────────────────────────────────────

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 24, fontSize: 13, color: '#9ca3af' }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 8, listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap' }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {idx > 0 && <FiChevronRight size={12} color="#6b7280" />}
            {idx === items.length - 1 ? (
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{item.name}</span>
            ) : (
              <Link to={item.item} style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function FaqAccordion({ faqs }) {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
      {faqs.map((faq, idx) => (
        <div key={idx} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, overflow: 'hidden' }}>
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            aria-expanded={openIdx === idx}
            style={{ width: '100%', padding: '16px 20px', background: 'none', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          >
            <span>{faq.q}</span>
            <span style={{ color: '#ef4444', fontSize: 18, transition: 'transform 0.2s', transform: openIdx === idx ? 'rotate(45deg)' : 'none' }}>+</span>
          </button>
          {openIdx === idx && (
            <div style={{ padding: '0 20px 18px', color: '#9ca3af', fontSize: 14, lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CarsPreviewGrid({ cars, loading }) {
  if (loading) {
    return <div style={{ color: '#9ca3af', padding: 20, textAlign: 'center' }}>Loading available fleet...</div>
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      {cars.slice(0, 3).map((car, idx) => (
        <CarCard key={car._id || idx} car={car} index={idx} />
      ))}
    </div>
  )
}

// ─── 1. SELF DRIVE CAR RENTAL PAGE ───────────────────────────────────────────

export function SelfDriveLandingPage() {
  const { setIsPageLoading } = useLoader()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsPageLoading(false)
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll()
        setCars(res.data.cars || res.data || MOCK_CARS)
      } catch {
        setCars(MOCK_CARS)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [setIsPageLoading])

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Self Drive Car Rental Bhubaneswar', item: '/self-drive-car-rental-bhubaneswar' }
  ]

  const faqs = [
    { q: 'How does self-drive car rental in Bhubaneswar work?', a: 'Select your car online at SpeedToyzCars.com, choose pickup/drop dates, pay ₹200 advance to reserve, upload your DL & ID proof, and collect the keys at our main garage or choose doorstep/airport delivery.' },
    { q: 'What documents are required to rent a self-drive car in Bhubaneswar?', a: 'You need a valid original Indian Driving License (or International Driving Permit for non-Indians) and a government-issued ID proof (Aadhaar, Passport, or Voter ID). Drivers must be at least 21 years old.' },
    { q: 'Is there a kilometer limit for self-drive cars?', a: 'Yes, rental packages include assigned distance limits: 6 Hours (150 km), 12 Hours (200 km), and 24 Hours (300 km). Extra kilometers incur standard excess charges upon return.' },
    { q: 'How is the security deposit returned?', a: 'Refundable security deposits are collected at vehicle handover and processed immediately upon safe, undamaged return of the vehicle.' }
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Self Drive Car Rental in Bhubaneswar',
      'provider': { '@type': 'AutoRental', 'name': 'SpeedToyzCars', 'url': 'https://speedtoyzcars.com/' },
      'areaServed': { '@type': 'AdministrativeArea', 'name': 'Bhubaneswar, Odisha' },
      'description': 'Rent self drive cars in Bhubaneswar with SpeedToyzCars. Hatchbacks, SUVs, automatic sedans, and 4x4 Thar with instant booking and doorstep delivery.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    }
  ]

  useSeoHead({
    title: 'Self Drive Car Rental in Bhubaneswar | SpeedToyzCars',
    description: 'Book self drive car rental in Bhubaneswar with SpeedToyzCars. Hatchbacks, SUVs, 4x4 Thar & automatic cars with clean vehicles and low daily rates.',
    keywords: 'self drive car rental bhubaneswar, car rent in bhubaneswar self drive, self car rental bhubaneswar, self drive car rental Odisha, solo drive car rental Bhubaneswar',
    path: '/self-drive-car-rental-bhubaneswar',
    breadcrumbs,
    jsonLd
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 20px 60px', color: '#fff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero Section */}
        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #050505 100%)', border: '1px solid #1f2937', borderRadius: 20, padding: '36px 28px', marginBottom: 40, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Self Drive Car Rental Bhubaneswar
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
            Self Drive Car Rental in Bhubaneswar — Total Freedom on the Road
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.7, maxWidth: 780, margin: '0 0 24px' }}>
            Experience independence with SpeedToyzCars <strong>self drive car rental in bhubaneswar</strong>. Choose from sanitized hatchbacks, automatic SUVs, and 4x4 convertibles for city driving, solo trips, or coastal Odisha road trips.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn-primary" style={{ background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Explore Self Drive Fleet
            </Link>
            <a href="tel:+919861332857" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPhone size={15} color="#ef4444" /> Call +91 98613 32857
            </a>
          </div>
        </div>

        {/* How It Works & Requirements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: '#ef4444', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>📋 Eligibility & Documents</h2>
            <ul style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
              <li>Must be at least 21 years of age</li>
              <li>Valid original Indian Driving License or International Driving Permit</li>
              <li>Government ID Proof (Aadhaar Card, Passport, or Voter ID)</li>
              <li>₹200 advance payment (deducted from final rental bill)</li>
            </ul>
          </div>
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 24 }}>
            <h2 style={{ color: '#ef4444', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>⏱️ Rental Distance Packages</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1f2937', padding: '10px 14px', borderRadius: 8 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>6 Hours Rental</span>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>150 km included</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1f2937', padding: '10px 14px', borderRadius: 8 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>12 Hours Rental</span>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>200 km included</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1f2937', padding: '10px 14px', borderRadius: 8 }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>24 Hours (1 Day)</span>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>300 km included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Vehicles */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Available Self Drive Vehicles</h2>
            <Link to="/cars" style={{ color: '#ef4444', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>View All Fleet →</Link>
          </div>
          <CarsPreviewGrid cars={cars} loading={loading} />
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  )
}

// ─── 2. CAR RENTAL WITH DRIVER PAGE ──────────────────────────────────────────

export function DriverLandingPage() {
  const { setIsPageLoading } = useLoader()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsPageLoading(false)
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll()
        setCars(res.data.cars || res.data || MOCK_CARS)
      } catch {
        setCars(MOCK_CARS)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [setIsPageLoading])

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Car Rental in Bhubaneswar With Driver', item: '/car-rental-with-driver-bhubaneswar' }
  ]

  const faqs = [
    { q: 'Are drivers verified and professional?', a: 'Yes, all SpeedToyzCars drivers are background-checked, uniform-wearing professionals with local route expertise across Odisha.' },
    { q: 'Can I book a car with driver for outstation trips from Bhubaneswar?', a: 'Yes, we provide outstation driver-assisted rental packages for Puri, Cuttack, Konark, Chilika, and Kolkata routes.' },
    { q: 'How are driver allowances and night charges billed?', a: 'Driver allowances and hourly night charges are calculated transparently upfront without hidden fees.' }
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Car Rental in Bhubaneswar With Driver',
      'provider': { '@type': 'AutoRental', 'name': 'SpeedToyzCars', 'url': 'https://speedtoyzcars.com/' },
      'areaServed': { '@type': 'AdministrativeArea', 'name': 'Bhubaneswar, Odisha' },
      'description': 'Professional chauffeur-driven car rental in Bhubaneswar for local travel, outstation trips, airport transfers, and wedding events.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    }
  ]

  useSeoHead({
    title: 'Car Rental in Bhubaneswar With Driver | SpeedToyzCars',
    description: 'Book car rental in bhubaneswar with driver at low prices. Chauffeur driven sedans, SUVs, and luxury cars for city travel, airport drops, and outstation trips.',
    keywords: 'car rental in bhubaneswar with driver, car rental in bhubaneswar with driver price, cheapest car rental in bhubaneswar with driver, car rental with driver Bhubaneswar',
    path: '/car-rental-with-driver-bhubaneswar',
    breadcrumbs,
    jsonLd
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 20px 60px', color: '#fff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbs} />

        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #050505 100%)', border: '1px solid #1f2937', borderRadius: 20, padding: '36px 28px', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Chauffeur & Driver Service
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
            Car Rental in Bhubaneswar With Driver — Relaxing Chauffeur Drives
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.7, maxWidth: 780, margin: '0 0 24px' }}>
            Enjoy stress-free travel with SpeedToyzCars <strong>car rental in bhubaneswar with driver</strong>. Ideal for corporate delegates, family vacations, airport transfers, and outstation travel across Odisha.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Request Driver Car Booking
            </Link>
            <a href="tel:+919861332857" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPhone size={15} color="#ef4444" /> Call +91 98613 32857
            </a>
          </div>
        </div>

        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Cars Available With Driver</h2>
          <CarsPreviewGrid cars={cars} loading={loading} />
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  )
}

// ─── 3. BHUBANESWAR AIRPORT PAGE ─────────────────────────────────────────────

export function AirportLandingPage() {
  const { setIsPageLoading } = useLoader()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsPageLoading(false)
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll()
        setCars(res.data.cars || res.data || MOCK_CARS)
      } catch {
        setCars(MOCK_CARS)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [setIsPageLoading])

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Car Rental Near Bhubaneswar Airport', item: '/car-rental-bhubaneswar-airport' }
  ]

  const faqs = [
    { q: 'Where do I meet the SpeedToyzCars representative at BPIA Bhubaneswar Airport?', a: 'Our representative meets you directly outside Arrival Gate 1 (Terminal 1) or Gate 2 (Terminal 2) of Biju Patnaik International Airport.' },
    { q: 'What happens if my flight is delayed?', a: 'We monitor live flight status schedules. Your reservation and key handover will be adjusted without penalty.' },
    { q: 'Is airport delivery available 24/7?', a: 'Yes, SpeedToyzCars operates 24 hours a day, 7 days a week for airport pickups and drop-offs.' }
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Car Rental Near Bhubaneswar Airport (BPIA)',
      'provider': { '@type': 'AutoRental', 'name': 'SpeedToyzCars', 'url': 'https://speedtoyzcars.com/' },
      'areaServed': { '@type': 'Place', 'name': 'Biju Patnaik International Airport (BPIA), Bhubaneswar' },
      'description': '24/7 airport car rental service at Biju Patnaik International Airport Terminal 1 & 2 with self-drive and driver options.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    }
  ]

  useSeoHead({
    title: 'Car Rental Near Bhubaneswar Airport | SpeedToyzCars',
    description: 'Instant 24/7 car rental in bhubaneswar airport (BPIA Terminal 1 & 2). Book self drive cars or airport pickup with low daily rates and clean vehicles.',
    keywords: 'car rental in bhubaneswar airport, car rental near Bhubaneswar airport, airport self drive car rental bhubaneswar',
    path: '/car-rental-bhubaneswar-airport',
    breadcrumbs,
    jsonLd
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 20px 60px', color: '#fff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbs} />

        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #050505 100%)', border: '1px solid #1f2937', borderRadius: 20, padding: '36px 28px', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Airport Terminal Service (BPIA)
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
            Car Rental Near Bhubaneswar Airport — 24/7 BPIA Pickup
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.7, maxWidth: 780, margin: '0 0 24px' }}>
            Land at Biju Patnaik International Airport and drive away instantly. SpeedToyzCars provides 24/7 <strong>car rental in bhubaneswar airport</strong> with key handovers right outside Terminal 1 and Terminal 2.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn-primary" style={{ background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Book Airport Car Now
            </Link>
            <a href="tel:+919861332857" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPhone size={15} color="#ef4444" /> Call +91 98613 32857
            </a>
          </div>
        </div>

        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Popular Airport Rental Cars</h2>
          <CarsPreviewGrid cars={cars} loading={loading} />
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  )
}

// ─── 4. AUTOMATIC CAR RENTAL PAGE ────────────────────────────────────────────

export function AutomaticLandingPage() {
  const { setIsPageLoading } = useLoader()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsPageLoading(false)
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll()
        const fetched = res.data.cars || res.data || MOCK_CARS
        const automatics = fetched.filter(c => c.transmission === 'Automatic')
        setCars(automatics.length ? automatics : fetched)
      } catch {
        setCars(MOCK_CARS.filter(c => c.transmission === 'Automatic'))
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [setIsPageLoading])

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Automatic Car Rental in Bhubaneswar', item: '/automatic-car-rental-bhubaneswar' }
  ]

  const faqs = [
    { q: 'Which automatic cars are available in SpeedToyzCars fleet?', a: 'Our automatic fleet includes Hyundai Creta AT, Kia Seltos AT, Mahindra Thar 4x4 AT, Maruti Baleno CVT, Tata Nexon EV, and Alto K10 AGS.' },
    { q: 'Are automatic rental cars suitable for city traffic in Bhubaneswar?', a: 'Yes! Automatic transmission eliminates clutch fatigue, making city traffic commuting smooth and effortless.' }
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Automatic Car Rental in Bhubaneswar',
      'provider': { '@type': 'AutoRental', 'name': 'SpeedToyzCars', 'url': 'https://speedtoyzcars.com/' },
      'areaServed': { '@type': 'AdministrativeArea', 'name': 'Bhubaneswar, Odisha' },
      'description': 'Rent automatic transmission cars in Bhubaneswar including SUVs, hatchbacks, and sedans with instant online booking.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    }
  ]

  useSeoHead({
    title: 'Automatic Car Rental in Bhubaneswar | SpeedToyzCars',
    description: 'Rent automatic car in bhubaneswar with SpeedToyzCars. Choose automatic SUVs, hatchbacks, and luxury sedans with easy booking and low rates.',
    keywords: 'automatic car rental in bhubaneswar, automatic self drive cars bhubaneswar, automatic hatchback SUV rental',
    path: '/automatic-car-rental-bhubaneswar',
    breadcrumbs,
    jsonLd
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 20px 60px', color: '#fff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbs} />

        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #050505 100%)', border: '1px solid #1f2937', borderRadius: 20, padding: '36px 28px', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Automatic Fleet
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
            Automatic Car Rental in Bhubaneswar — Smooth Gearless Driving
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.7, maxWidth: 780, margin: '0 0 24px' }}>
            Drive effortlessly with SpeedToyzCars <strong>automatic car rental in bhubaneswar</strong>. Top-rated automatic transmission SUVs, hatchbacks, and sedans equipped with hill-assist and cruise control.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/cars" className="btn-primary" style={{ background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Browse Automatic Fleet
            </Link>
            <a href="tel:+919861332857" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPhone size={15} color="#ef4444" /> Call +91 98613 32857
            </a>
          </div>
        </div>

        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Available Automatic Vehicles</h2>
          <CarsPreviewGrid cars={cars} loading={loading} />
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  )
}

// ─── 5. WEDDING CAR RENTAL PAGE ──────────────────────────────────────────────

export function WeddingLandingPage() {
  const { setIsPageLoading } = useLoader()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsPageLoading(false)
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll()
        const fetched = res.data.cars || res.data || MOCK_CARS
        const luxury = fetched.filter(c => ['Luxury', 'Supercar', 'SUV'].includes(c.category))
        setCars(luxury.length ? luxury : fetched)
      } catch {
        setCars(MOCK_CARS.filter(c => ['Luxury', 'Supercar', 'SUV'].includes(c.category)))
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [setIsPageLoading])

  const breadcrumbs = [
    { name: 'Home', item: '/' },
    { name: 'Wedding Car Rental in Bhubaneswar', item: '/wedding-car-rental-bhubaneswar' }
  ]

  const faqs = [
    { q: 'Which luxury cars are available for wedding rentals in Bhubaneswar?', a: 'Our wedding fleet includes Mahindra Thar 4x4 Convertible, Toyota Fortuner Legender, BMW 3 Series, Audi A6, Mercedes S-Class, and Ferrari models.' },
    { q: 'Is floral car decoration included in wedding rental packages?', a: 'Custom floral arrangements can be added upon request during package customization.' },
    { q: 'How can I get custom wedding car rental pricing?', a: 'Contact our team directly at +91 98613 32857 or via our contact page for custom event & wedding quotes.' }
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Wedding Car Rental in Bhubaneswar',
      'provider': { '@type': 'AutoRental', 'name': 'SpeedToyzCars', 'url': 'https://speedtoyzcars.com/' },
      'areaServed': { '@type': 'AdministrativeArea', 'name': 'Bhubaneswar, Odisha' },
      'description': 'Luxury wedding car rental in Bhubaneswar with decorated Thar 4x4, Fortuner, BMW, Audi, and Mercedes models.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    }
  ]

  useSeoHead({
    title: 'Wedding Car Rental in Bhubaneswar | SpeedToyzCars',
    description: 'Book wedding car rental in bhubaneswar with price quotes. Premium luxury sedans, Fortuner Legender, Thar 4x4 convertible & Audi for marriage events.',
    keywords: 'wedding car rental in bhubaneswar with price, wedding car rental bhubaneswar, luxury wedding car rental bhubaneswar',
    path: '/wedding-car-rental-bhubaneswar',
    breadcrumbs,
    jsonLd
  })

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 20px 60px', color: '#fff' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbs} />

        <div style={{ background: 'linear-gradient(135deg, #111827 0%, #050505 100%)', border: '1px solid #1f2937', borderRadius: 20, padding: '36px 28px', marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Marriage & Event Fleet
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 14px', letterSpacing: '-0.8px' }}>
            Wedding Car Rental in Bhubaneswar — Grand Celebrations
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.7, maxWidth: 780, margin: '0 0 24px' }}>
            Make your wedding day unforgettable with SpeedToyzCars <strong>wedding car rental in bhubaneswar with price</strong> customization. Luxury convertibles, decorated Thar 4x4s, and executive sedans.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
              Get Wedding Car Quote
            </Link>
            <a href="tel:+919861332857" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: '#fff', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiPhone size={15} color="#ef4444" /> Call +91 98613 32857
            </a>
          </div>
        </div>

        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px' }}>Luxury Event Vehicles</h2>
          <CarsPreviewGrid cars={cars} loading={loading} />
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>Frequently Asked Questions</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  )
}
