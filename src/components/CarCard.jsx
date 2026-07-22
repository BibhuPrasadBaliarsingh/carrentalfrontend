import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiUsers, FiSettings } from 'react-icons/fi'
import { Badge, StarRating } from './UI'
import { formatPrice, cleanCarName, getCarImageSrc, CAR_IMAGE_FALLBACK } from '../utils/format'
import { API_URL } from '../config'

export default function CarCard({ car, index = 0 }) {
  const navigate = useNavigate()
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const imgSrc = getCarImageSrc(car, 600)

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      whileHover={prefersReducedMotion ? { scale: 1 } : { y: -6, scale: 1.01, boxShadow: '0 20px 45px rgba(0,0,0,0.32)' }}
      whileTap={prefersReducedMotion ? { scale: 1 } : { scale: 0.985 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.06, duration: prefersReducedMotion ? 0.16 : 0.35, ease: 'easeOut' }}
      className="car-card"
      onClick={() => navigate(`/cars/${car._id}`)}
      style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
    >
      <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
        <img
          src={imgSrc}
          alt={car.name}
          loading="lazy"
          className="car-card-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.onerror = null; e.target.src = CAR_IMAGE_FALLBACK }}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <Badge>{car.category}</Badge>
          <span style={{ background: car.transmission === 'Manual' ? '#2563eb' : '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⚙️ {car.transmission || 'Automatic'}
          </span>
        </div>
        {!car.available && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 16, letterSpacing: 2 }}>UNAVAILABLE</span>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{car.brand}</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginTop: 2 }}>
              {cleanCarName(car.name)}{!cleanCarName(car.name).toLowerCase().includes('manual') && !cleanCarName(car.name).toLowerCase().includes('automatic') ? ` ` : ''}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#ef4444', fontWeight: 900, fontSize: 20 }}>{formatPrice(car.pricePerDay)}</div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>/day</div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <StarRating rating={car.rating || 4.5} />
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            [FiZap, car.fuelType || car.fuel],
            [FiUsers, `${car.seats} seats`],
            [FiSettings, car.transmission],
          ].map(([Icon, val]) => (
            <span key={val} style={{ color: '#9ca3af', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon size={12} /> {val}
            </span>
          ))}
        </div>

        <button
          onClick={e => { e.stopPropagation(); navigate(`/cars/${car._id}`) }}
          className="btn-outline"
          style={{ width: '100%', background: 'transparent', border: '1px solid #374151', color: '#d1d5db', padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          View Details
        </button>
      </div>
    </motion.div>
  )
}
