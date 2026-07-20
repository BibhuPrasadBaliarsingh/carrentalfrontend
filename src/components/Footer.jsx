import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Logo from './common/Logo'
import { useToast } from '../context/ToastContext'
import { newsletterAPI } from '../services/api'
import { formatPrice } from '../utils/format'
import { API_BASE } from '../config'

export default function Footer() {
  const { addToast } = useToast()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [settings, setSettings] = useState({ platformName: 'SpeedToyz', supportEmail: 'support@speedtoyz.com', currency: 'INR (₹)' })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings/public`)
        const data = await res.json()
        if (data?.success) setSettings(data.settings || settings)
      } catch {
        // keep defaults
      }
    }
    fetchSettings()
  }, [])

  const links = {
    'Quick Links': [
      { label: 'Home', to: '/' },
      { label: 'Browse Cars', to: '/cars' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
    'Categories': [
      { label: 'Sports Cars', to: '/cars?category=Sports' },
      { label: 'Luxury', to: '/cars?category=Luxury' },
      { label: 'SUV', to: '/cars?category=SUV' },
      { label: 'Electric', to: '/cars?category=Electric' },
      { label: 'Supercars', to: '/cars?category=Supercar' },
    ],
    'Support': [
      { label: 'FAQ', to: '/faq' },
      { label: 'Help Center', to: '/help' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  }

  const socials = [
    { Icon: FiInstagram, href: 'https://www.instagram.com/speedtoyzcars?igsh=NzAyYnVmbXd4NjYz&utm_source=qr' },
    { Icon: FiFacebook, href: 'https://www.facebook.com/SpeedtoyzCarsRental' },
  ]

  const locationAddress = 'Lane-4, Satya Sai Enclave Road, Near Manipal Hospital, Kolathia, Khandagiri, Bhubaneswar, Odisha 751030'
  const googleMapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1352.6576179591075!2d85.77613609969278!3d20.257452855684868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a70155609a7b%3A0x377c73120b48822b!2sSpeed%20Toyz%20Cars%20%7C%20Self%20Drive%20Car%20Rental%20%7C%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1781157796951!5m2!1sen!2sin'

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(newsletterEmail)) {
      addToast('Please enter a valid email', 'error')
      return
    }
    setSubscribing(true)
    try {
      const res = await newsletterAPI.subscribe(newsletterEmail)
      addToast(res.data?.message || 'Subscribed! 🎉', 'success')
      setNewsletterEmail('')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not subscribe.', 'error')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="reveal-on-scroll" data-reveal="fade-up" style={{ background: '#050505', borderTop: '1px solid #1f2937', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08, filter: 'grayscale(1)' }} />
      
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: isMobile ? '40px 20px 20px' : '56px 80px 28px' }}>
        <div style={{ marginTop: 8, marginBottom: 24, padding: '18px', borderRadius: 18, border: '1px solid #1f2937', background: 'linear-gradient(135deg, rgba(17,24,39,0.95), rgba(5,5,5,0.95))' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1.1fr', gap: 18, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 240, padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <div>
                <h4 style={{ color: '#fff', marginBottom: 12, fontSize: 18, fontWeight: 700 }}>Visit us for premium self-drive cars</h4>
                <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.8, margin: 0 }}>Explore premium cars in Bhubaneswar, airport transfers, and Odisha road trips with a team that helps you travel confidently.</p>
              </div>
              <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 16, border: '1px solid #1f2937', background: 'rgba(255,255,255,0.04)' }}>
                  <strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Contact US</strong>
                  <span style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.7, display: 'block' }}>Location: {locationAddress}</span>
                  <span style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.7, display: 'block' }}>Phone: <a href="tel:+919861332857" style={{ color: '#ef4444', textDecoration: 'none', cursor: 'pointer' }}>+91 98613 32857</a>, <a href="tel:+917608068450" style={{ color: '#ef4444', textDecoration: 'none', cursor: 'pointer' }}>+91 76080 68450</a></span>
                  <span style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.7, display: 'block' }}>Email: <a href={`mailto:${settings.supportEmail}`} style={{ color: '#ef4444', textDecoration: 'none', cursor: 'pointer' }}>{settings.supportEmail}</a></span>
                </div>
                
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #1f2937', background: 'rgba(255,255,255,0.04)', minHeight: 240 }}>
              <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6, padding: '14px 16px 0' }}>Map</div>
              <iframe
                title="Speed Toyz Cars location map"
                src={googleMapEmbedUrl}
                style={{ width: '100%', height: '100%', minHeight: 220, border: '0', display: 'block' }}
                allowFullScreen={false}
                loading="lazy"
              />
              <div style={{ padding: '14px 16px 18px', color: '#d1d5db', fontSize: 13, lineHeight: 1.6 }}>
                <div>Bhubaneswar • Cuttack • Puri • Konark • Chilika • Odisha tourism routes</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 32 : 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
              <Logo size="sm" />
            </Link>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8, maxWidth: 320, marginBottom: 18 }}>
              Best self-drive and luxury car rental in Bhubaneswar with clean cars, affordable rates, 24/7 support, and smooth Odisha tours.
            </p>
            <div style={{ display: 'grid', gap: 8, color: '#d1d5db', fontSize: 13, marginBottom: 18 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiMapPin size={34} color="#ef4444" /> {locationAddress}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPhone size={14} color="#ef4444" /> <a href="tel:+919861332857" style={{ color: '#d1d5db', textDecoration: 'none', cursor: 'pointer' }}>98613 32857</a>, <a href="tel:+917608068450" style={{ color: '#d1d5db', textDecoration: 'none', cursor: 'pointer' }}>76080 68450</a></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiMail size={14} color="#ef4444" /> <a href={`mailto:${settings.supportEmail}`} style={{ color: '#d1d5db', textDecoration: 'none', cursor: 'pointer' }}>{settings.supportEmail}</a></span>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 12 }}>
              <input value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} type="email" placeholder="Email for updates" style={{ flex: 1, background: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff', padding: '10px 12px', fontSize: 13, outline: 'none' }} />
              <button type="submit" disabled={subscribing} style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiSend size={14} />
              </button>
            </form>
            <div style={{ display: 'flex', gap: 12 }}>
              {socials.map(({ Icon, href }, i) => (
                <a key={i} target='_blank' href={href} style={{ width: 36, height: 36, borderRadius: 8, background: '#111827', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#111827'; e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.color = '#9ca3af' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>{heading}</h4>
              {items.map(({ label, to }) => (
                <Link key={label} to={to} style={{ display: 'block', color: '#6b7280', textDecoration: 'none', fontSize: 14, marginBottom: 12, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#ef4444'}
                  onMouseLeave={e => e.target.style.color = '#6b7280'}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>© {new Date().getFullYear()} {settings.platformName}. All rights reserved.</span>
          
          <span style={{ color: '#9ca3af', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
            Designed and Developed by{' '}
            <a
              href="https://www.odify.agency"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #ff3131, #ff914d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Odify
            </a>
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 24 }}>
            {[
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Cookie Policy', '/privacy'],
            ].map(([t, to]) => (
              <Link key={t} to={to} style={{ color: '#6b7280', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#9ca3af'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <a
        href="tel:+919861332857"
        className="animate-float"
        style={{ position: 'fixed', right: 18, bottom: 86, zIndex: 50, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 12px 30px rgba(239, 68, 68, 0.35)', textDecoration: 'none' }}
        aria-label="Call Us"
      >
        <FiPhone size={26} aria-hidden="true" />
      </a>
      <a
        href="https://wa.me/919861332857?text=Hi%20Speed%20Toyz%20Cars%2C%20I%20would%20like%20to%20book%20a%20self-drive%20car%20in%20Bhubaneswar."
        target="_blank"
        rel="noreferrer"
        className="animate-float"
        style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 50, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 12px 30px rgba(37, 211, 102, 0.35)', textDecoration: 'none', animationDelay: '1.5s' }}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} aria-hidden="true" />
      </a>
    </footer>
  )
}
