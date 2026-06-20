import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import Logo from './common/Logo'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
  const googleMapLink = 'https://www.google.com/maps/search/?api=1&query=Speed+Toyz+Cars+Bhubaneswar'

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid #1f2937', position: 'relative', overflow: 'hidden' }}>
      
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
                  <span style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.7, display: 'block' }}>Phone: +91 98613 32857, +91 76080 68450</span>
                  <span style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.7, display: 'block' }}>Email: speedtoyzcarsodisha@gmail.com</span>
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
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiMapPin size={38} color="#ef4444" /> {locationAddress}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPhone size={14} color="#ef4444" /> +91 98613 32857, +91 76080 68450</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiMail size={14} color="#ef4444" /> speedtoyzcarsodisha@gmail.com</span>
            </div>
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
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: '#4b5563', fontSize: 13 }}>© {new Date().getFullYear()} Speed Toyz Cars. All rights reserved.</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <Link key={t} to="#" style={{ color: '#4b5563', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#9ca3af'}
                onMouseLeave={e => e.target.style.color = '#4b5563'}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <a
        href="https://wa.me/919861332857?text=Hi%20Speed%20Toyz%20Cars%2C%20I%20would%20like%20to%20book%20a%20self-drive%20car%20in%20Bhubaneswar."
        target="_blank"
        rel="noreferrer"
        style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 50, width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #25d366, #128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 12px 30px rgba(37, 211, 102, 0.35)', textDecoration: 'none' }}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.272-.099-.47-.149-.67.149-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.67-1.612-.92-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.571-.01-.198 0-.521.074-.793.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.073.149.198 2.096 3.2 5.077 4.487.709.306 1.262.49 1.694.625.712.227 1.36.195 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.174-1.413-.074-.123-.272-.198-.57-.347z"/></svg>
      </a>
    </footer>
  )
}
