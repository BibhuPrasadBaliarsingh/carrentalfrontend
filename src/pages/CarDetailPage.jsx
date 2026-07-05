import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiUsers, FiSettings, FiCalendar, FiShield, FiMapPin, FiArrowLeft } from 'react-icons/fi'
import { Badge, StarRating, PageLoader } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { useLoader } from '../context/LoaderContext'
import { carsAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'
import { formatPrice } from '../utils/format'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
const DEFAULT_CAR_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'

const resolveCarImages = (images) => {
  if (Array.isArray(images)) return images.filter(src => typeof src === 'string' && src.trim().length)
  if (typeof images === 'string' && images.trim().length) return [images.trim()]
  return []
}

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setIsPageLoading } = useLoader()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [demoMode, setDemoMode] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <PageLoader />
  if (!car) return <div style={{ color: '#fff', padding: 60, textAlign: 'center' }}>Car not found</div>

  const imgs = resolveCarImages(car.images)
  const imgSrc = (src) => {
    if (!src || typeof src !== 'string') return DEFAULT_CAR_IMAGE
    return src.startsWith('http') ? src : `${API_URL}/uploads/${src}`
  }
  const displayImgs = imgs.length ? imgs : [DEFAULT_CAR_IMAGE]

  useEffect(() => {
    if (activeImg >= displayImgs.length) {
      setActiveImg(0)
    }
  }, [displayImgs.length, activeImg])

  const handleBook = () => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${car._id}` } })
      return
    }
    navigate(`/booking/${car._id}`)
  }

  const specs = [
    { icon: <FiZap />, label: 'Fuel Type', val: car.fuelType || car.fuel },
    { icon: <FiUsers />, label: 'Seats', val: `${car.seats} Passengers` },
    { icon: <FiSettings />, label: 'Transmission', val: car.transmission },
    { icon: <FiCalendar />, label: 'Availability', val: car.available ? 'Available Now' : 'Unavailable' },
  ]

  const included = [
    'Full insurance coverage',
    'GPS navigation system',
    '24/7 roadside assistance',
    'Unlimited mileage',
    'Airport pickup & drop',
    'Complimentary car wash',
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: isMobile ? '14px 14px 56px' : isTablet ? '24px 40px 60px' : '36px 80px 60px', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Breadcrumb */}
        {demoMode && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fecaca', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            Showing demo data — could not reach the server.
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isMobile ? 16 : 24, color: '#6b7280', fontSize: isMobile ? 13 : 14, flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 14, padding: 0 }}>
            <FiArrowLeft size={16} /> Back
          </button>
          <span>›</span>
          <span style={{ cursor: 'pointer', color: '#9ca3af' }} onClick={() => navigate('/cars')}>Browse Cars</span>
          <span>›</span>
          <span style={{ color: '#fff' }}>{car.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: isMobile ? 18 : isTablet ? 32 : 52 }}>
          {isMobile ? (
            <div style={{ minWidth: 0 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 10, height: isMobile ? 220 : 240, position: 'relative' }}>
                <img src={imgSrc(displayImgs[activeImg])} alt={car.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = DEFAULT_CAR_IMAGE }} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, padding: '4px 10px', borderRadius: 20, backdropFilter: 'blur(6px)' }}>
                  {activeImg + 1} / {displayImgs.length}
                </div>
              </motion.div>

              {displayImgs.length > 1 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
                  {displayImgs.map((img, i) => (
                    <div key={i} onClick={() => setActiveImg(i)} style={{ flex: '0 0 72px', height: 72, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? '#ef4444' : 'transparent'}`, opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.2s' }}>
                      <img src={imgSrc(img)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = DEFAULT_CAR_IMAGE }} />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: 8 }}><Badge>{car.category}</Badge></div>
              <h1 style={{ color: '#fff', fontSize: isMobile ? 22 : 24, fontWeight: 900, letterSpacing: -1.2, margin: '4px 0 6px', lineHeight: 1.1 }}>{car.name}</h1>
              <div style={{ color: '#ef4444', fontSize: isMobile ? 20 : 24, fontWeight: 800, marginBottom: 12 }}>{formatPrice(car.pricePerDay)} <span style={{ color: '#6b7280', fontSize: 13 }}>/day</span></div>

              <button onClick={handleBook} disabled={!car.available}
                style={{ width: '100%', background: car.available ? '#ef4444' : '#374151', border: 'none', color: '#fff', padding: '13px 0', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: car.available ? 'pointer' : 'not-allowed', transition: 'background 0.2s', marginBottom: 12 }}>
                {car.available ? '🚗 Book Now' : 'Currently Unavailable'}
              </button>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Car Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                  {specs.map(({ icon, label, val }) => (
                    <div key={label} style={{ background: '#0f1727', border: '1px solid #1f2937', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ color: '#6b7280', fontSize: 11, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>{icon} {label}</div>
                      <div style={{ color: val === 'Available Now' ? '#16a34a' : val === 'Unavailable' ? '#ef4444' : '#fff', fontWeight: 600, fontSize: 13 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>About This Car</h3>
                <p style={{ color: '#9ca3af', lineHeight: 1.75, fontSize: 14, margin: 0 }}>{car.description}</p>
              </div>

              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 18 }}>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>What's Included</h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr', gap: 8 }}>
                  {included.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 14 }}>
                      <FiShield size={14} color="#16a34a" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ── Left: Images + Description ─────────────────────────────────── */}
              <div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 14, height: 360, position: 'relative' }}>
                  <img src={imgSrc(safeImgs[activeImg])} alt={car.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800' }} />
                  <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, padding: '4px 12px', borderRadius: 20, backdropFilter: 'blur(6px)' }}>
                    {activeImg + 1} / {displayImgs.length}
                  </div>
                </motion.div>

                {displayImgs.length > 1 && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    {displayImgs.map((img, i) => (
                      <div key={i} onClick={() => setActiveImg(i)} style={{ flex: 1, height: 72, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? '#ef4444' : 'transparent'}`, opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.2s' }}>
                        <img src={imgSrc(img)} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = DEFAULT_CAR_IMAGE }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28, marginTop: 24 }}>
                  <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>About This Car</h3>
                  <p style={{ color: '#9ca3af', lineHeight: 1.85, fontSize: 15, margin: 0 }}>{car.description}</p>
                </div>

                {/* Included */}
                <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 28, marginTop: 16 }}>
                  <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 14 }}>What's Included</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {included.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 14 }}>
                        <FiShield size={14} color="#16a34a" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right: Details + Booking ────────────────────────────────────── */}
              <div style={{ position: isTablet ? 'relative' : 'sticky', top: isTablet ? 'auto' : 80, height: 'fit-content' }}>
                <div style={{ marginBottom: 10 }}><Badge>{car.category}</Badge></div>
                <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 900, letterSpacing: -1.5, margin: '10px 0 4px', lineHeight: 1.1 }}>{car.name}</h1>
                <p style={{ color: '#6b7280', fontSize: 17, marginBottom: 12 }}>{car.brand}</p>
                <div style={{ marginBottom: 18 }}><StarRating rating={car.rating || 4.8} /></div>

                {/* Specs grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                  {specs.map(({ icon, label, val }) => (
                    <div key={label} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: '14px 16px' }}>
                      <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>{icon} {label}</div>
                      <div style={{ color: val === 'Available Now' ? '#16a34a' : val === 'Unavailable' ? '#ef4444' : '#fff', fontWeight: 600, fontSize: 15 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Pricing card */}
                <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: 24, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                    <div>
                      <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 4 }}>Daily Rate</div>
                      <div>
                        <span style={{ color: '#ef4444', fontSize: 42, fontWeight: 900, letterSpacing: -1 }}>{formatPrice(car.pricePerDay)}</span>
                        <span style={{ color: '#6b7280', fontSize: 16 }}>/day</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>Weekly rate</div>
                      <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{formatPrice(Math.round(car.pricePerDay * 7 * 0.9))}</div>
                      <div style={{ color: '#16a34a', fontSize: 11, marginTop: 2 }}>Save 10% weekly</div>
                    </div>
                  </div>

                  <button onClick={handleBook} disabled={!car.available}
                    style={{ width: '100%', background: car.available ? '#ef4444' : '#374151', border: 'none', color: '#fff', padding: '15px 0', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: car.available ? 'pointer' : 'not-allowed', transition: 'background 0.2s', marginBottom: 12 }}>
                    {car.available ? '🚗 Book Now' : 'Currently Unavailable'}
                  </button>

                  {!user && car.available && (
                    <p style={{ color: '#6b7280', fontSize: 12, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <FiShield size={12} /> Sign in required to complete booking
                    </p>
                  )}
                  {user && (
                    <p style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>Free cancellation up to 24h before pickup</p>
                  )}
                </div>

                {/* Location hint */}
                <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FiMapPin size={18} color="#ef4444" />
                  <div>
                    <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Multiple Pickup Locations</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>Airport, downtown, and hotel delivery available</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
