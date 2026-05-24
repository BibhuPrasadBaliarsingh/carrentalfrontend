import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi'

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
    { Icon: FiInstagram, href: '#' },
    { Icon: FiTwitter, href: '#' },
    { Icon: FiFacebook, href: '#' },
    { Icon: FiYoutube, href: '#' },
  ]

  return (
    <footer style={{ background: '#050505', borderTop: '1px solid #1f2937' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '40px 20px 20px' : '56px 80px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? 32 : 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{ background: '#ef4444', width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16 }}>S</div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>SpeedToyz</span>
            </Link>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.8, maxWidth: 280, marginBottom: 24 }}>
              Experience the thrill of luxury driving. Your premier destination for premium car rentals worldwide.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {socials.map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{ width: 36, height: 36, borderRadius: 8, background: '#111827', border: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textDecoration: 'none', transition: 'all 0.2s' }}
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
          <span style={{ color: '#4b5563', fontSize: 13 }}>© {new Date().getFullYear()} SpeedToyz. All rights reserved.</span>
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
    </footer>
  )
}
