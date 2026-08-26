import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { FiShield, FiZap, FiStar, FiArrowRight, FiMapPin, FiCalendar, FiClock, FiCompass } from 'react-icons/fi'
import { FaParking, FaHome, FaPlane } from 'react-icons/fa'
import CarCard from '../components/CarCard'
import { CarCardSkeleton } from '../components/UI'
import { carsAPI } from '../services/api'
import { MOCK_CARS } from '../data/mockData'
import { useLoader } from '../context/LoaderContext.jsx'
import { useHeroAnimation } from '../hooks/useHeroAnimation.js'
import { useSeoHead } from '../hooks/useSeoHead.js'
import { cleanCarName } from '../utils/format'

export default function HomePage() {
  useSeoHead({
    title: 'SpeedToyzCars | Car Rental in Bhubaneswar',
    description: 'Looking for a top-rated car rental near me in Bhubaneswar? SpeedToyzCars provides premium self-drive SUVs, sedans & hatchbacks with 24/7 doorstep delivery & airport pickup across Odisha.',
    path: '/'
  })

  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [deliveryMode, setDeliveryMode] = useState('Parking')
  const [search, setSearch] = useState({ location: '', pickupDate: '', pickupTime: '10:00 AM' })
  const [demoMode, setDemoMode] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)
  const { isPageLoading, setIsPageLoading, hasInitialLoaderRun, setHasInitialLoaderRun } = useLoader()
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const contentRef = useRef(null)
  const heroRef = useRef(null)
  const loaderRef = useRef(null)
  const carRef = useRef(null)
  const headlightsRef = useRef(null)
  const redGlowRef = useRef(null)
  const streaksRef = useRef(null)
  const logoContainerRef = useRef(null)
  const taglineRef = useRef(null)
  const progressTextRef = useRef(null)
  const barFillRef = useRef(null)
  const barHighlightRef = useRef(null)

  useHeroAnimation(heroRef, !isPageLoading)

  useEffect(() => {
    if (prefersReducedMotion || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.home-reveal').forEach((section, index) => {
        gsap.fromTo(section, { opacity: 0, y: 28, scale: 0.98 }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          delay: index * 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 86%',
            once: true,
          },
        })
      })
    }, contentRef)

    return () => ctx.revert()
  }, [prefersReducedMotion])
  const assetsReadyRef = useRef(false)
  const exitTriggeredRef = useRef(false)
  const loaderTimelineRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const assets = [
      '/images/hero-car-2.jpg',
      '/images/hero-car-3.jpg',
      '/images/hero-car-1.jpg',
    ]

    const loadImage = src => new Promise(resolve => {
      const image = new Image()
      image.src = src
      image.onload = image.onerror = resolve
    })

    Promise.all(assets.map(loadImage)).then(() => {
      assetsReadyRef.current = true
      if (exitTriggeredRef.current && loaderTimelineRef.current?.paused()) {
        loaderTimelineRef.current?.play()
      }
    })

    const progressState = { value: 0 }
    const updateProgress = () => {
      const value = Math.round(progressState.value)
      if (progressTextRef.current) progressTextRef.current.textContent = `${value}%`
      if (barFillRef.current) barFillRef.current.style.width = `${Math.min(100, progressState.value)}%`
    }

    const logoChars = gsap.utils.toArray('.loader-logo-char')

    if (hasInitialLoaderRun) {
      if (loaderRef.current) gsap.set(loaderRef.current, { autoAlpha: 0, display: 'none' })
      if (contentRef.current) gsap.set(contentRef.current, { autoAlpha: 1 })
      setIsPageLoading(false)
      return
    }

    // Show loader and hide navbar during animation
    setIsPageLoading(true)

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    loaderTimelineRef.current = tl

    tl.set(contentRef.current, { autoAlpha: 0 })
    tl.set(loaderRef.current, { autoAlpha: 1, display: 'flex' })
    tl.set(carRef.current, { autoAlpha: 0, scale: 0.85, y: 0, rotationZ: -0.5 })
    tl.set(headlightsRef.current, { autoAlpha: 0.2 })
    tl.set(redGlowRef.current, { autoAlpha: 0.3, scale: 0.92 })
    tl.set(taglineRef.current, { autoAlpha: 0, y: 12 })
    tl.set(logoChars, { autoAlpha: 0, y: 20 })
    tl.set(barFillRef.current, { width: '0%' })
    tl.set(progressTextRef.current, { autoAlpha: 1 })

    tl.to(carRef.current, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0)
    tl.to(headlightsRef.current, { autoAlpha: 0.95, duration: 0.4 }, 0.1)
    tl.to(redGlowRef.current, { autoAlpha: 0.55, scale: 1, duration: 0.5 }, 0.05)
    tl.to(carRef.current, { y: -6, repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut' }, 0)
    tl.to(carRef.current, { rotationZ: 0.5, repeat: -1, yoyo: true, duration: 2.5, ease: 'sine.inOut' }, 0)

    tl.addLabel('brand', 0.2)
    tl.to(logoChars, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'power4.out' }, 'brand')
    tl.to(taglineRef.current, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 'brand+=0.2')

    tl.addLabel('progress', 0.4)
    tl.to(progressState, { value: 100, duration: 1.2, ease: 'power1.inOut', onUpdate: updateProgress }, 'progress')

    tl.addLabel('engine', 'progress+=1.0')
    tl.to(carRef.current, { scale: 1.01, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 'engine')
    tl.to(redGlowRef.current, { autoAlpha: 0.78, duration: 0.1, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 'engine')
    tl.to(headlightsRef.current, { autoAlpha: 1, duration: 0.1, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 'engine')

    tl.add(() => {
      if (!assetsReadyRef.current) {
        exitTriggeredRef.current = true
        tl.pause()
      }
    }, 'engine+=0.3')

    tl.addLabel('exit', 'engine+=0.4')
    tl.to([logoChars, taglineRef.current, progressTextRef.current], { autoAlpha: 0, y: -24, duration: 0.4, ease: 'power3.in' }, 'exit')
    tl.to(barFillRef.current, { opacity: 0.18, duration: 0.3, ease: 'power3.in' }, 'exit')
    tl.to(carRef.current, { scale: 1.25, y: -120, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 'exit')
    tl.to(loaderRef.current, {
      autoAlpha: 0,
      duration: 1.05,
      ease: 'power2.in',
      onComplete: () => {
        setHasInitialLoaderRun(true)
        setIsPageLoading(false)

        if (contentRef.current) {
          gsap.to(contentRef.current, {
            autoAlpha: 1,
            duration: 0.9,
            ease: 'power3.out',
            onComplete: () => {
              requestAnimationFrame(() => {
                ScrollTrigger.refresh()
              })
            },
          })
        } else {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh()
          })
        }
      }
    }, 'exit')

    tl.play()

    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await carsAPI.getAll({ limit: 50 })
        const allCars = res.data.cars || res.data

        const uniqueCarsMap = new Map()
        allCars.forEach(car => {
          const baseName = cleanCarName(car.name)
          if (!uniqueCarsMap.has(baseName)) {
            uniqueCarsMap.set(baseName, car)
          }
        })
        const uniqueCars = Array.from(uniqueCarsMap.values())

        // Shuffle the unique cars array randomly
        for (let i = uniqueCars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [uniqueCars[i], uniqueCars[j]] = [uniqueCars[j], uniqueCars[i]];
        }

        setCars(uniqueCars)
      } catch {
        setDemoMode(true)
        setCars(MOCK_CARS.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  const handleSearch = () => {
    sessionStorage.setItem('bookingIntent', JSON.stringify({
      deliveryMode,
      location: deliveryMode === 'Parking' ? 'SpeedToyzCars Parking' : search.location,
      pickupDate: search.pickupDate,
      pickupTime: search.pickupTime,
    }))
    const params = new URLSearchParams()
    if (search.pickupDate) params.set('pickupDate', search.pickupDate)
    if (search.pickupTime) params.set('pickupTime', search.pickupTime)
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
    { heading: 'Self Drive Car Rental in Bhubaneswar', detail: 'Book a clean, insured SUV, hatchback or sedan for city trips and outstation drives with full privacy.', link: '/self-drive-car-rental-bhubaneswar', linkText: 'Self Drive Car Rental in Bhubaneswar →' },
    { heading: 'Car Rental in Bhubaneswar With Driver', detail: 'Professional, background-checked chauffeurs for stress-free city travel, airport drops, and outstation trips.', link: '/car-rental-with-driver-bhubaneswar', linkText: 'Car Rental With Driver →' },
    { heading: 'Car Rental Near Bhubaneswar Airport', detail: '24/7 terminal key handovers at Biju Patnaik International Airport (BPIA Terminal 1 & 2).', link: '/car-rental-bhubaneswar-airport', linkText: 'Bhubaneswar Airport Car Rental →' },
    { heading: 'Automatic Car Rental in Bhubaneswar', detail: 'Drive gearless automatic SUVs, sedans, and hatchbacks with hill-assist and cruise control.', link: '/automatic-car-rental-bhubaneswar', linkText: 'Automatic Car Rental →' },
    { heading: 'Wedding Car Rental in Bhubaneswar', detail: 'Luxury Thar 4x4 convertibles, Fortuner, BMW, and Audi models for marriage events and bridal entry.', link: '/wedding-car-rental-bhubaneswar', linkText: 'Wedding Car Rental →' },
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
    { value: 80, suffix: '+', label: 'Cars' },
    { value: 20000, suffix: '+', label: 'Happy Clients' },
    { value: 4.9, suffix: '★', label: 'Rating', fixed: 1 },
    { value: 24, suffix: '/7', label: 'Support' },
  ]

  return (
    <>
      <div ref={loaderRef} className="speedtoyz-loader" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#050505', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(239,68,68,0.12) 0%, transparent 50%), #050505', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: isMobile ? '85%' : isTablet ? 640 : 720, minHeight: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: isMobile ? 20 : 28 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 660, height: isMobile ? 260 : 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img ref={carRef} src="./car.png" alt="Speed Toys Car" style={{ width: '100%', height: '100%', objectFit: 'contain', transformStyle: 'preserve-3d', filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.6))' }} />
            <div ref={headlightsRef} style={{ position: 'absolute', top: '40%', left: '10%', width: '18%', height: '10%', background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 100%)', filter: 'blur(14px)', opacity: 0.2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '40%', right: '10%', width: '18%', height: '10%', background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 100%)', filter: 'blur(14px)', opacity: 0.16, pointerEvents: 'none' }} />
            <div ref={redGlowRef} style={{ position: 'absolute', bottom: '12%', left: '15%', right: '15%', height: '12%', background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.3) 0%, transparent 75%)', filter: 'blur(16px)', opacity: 0.28, pointerEvents: 'none' }} />
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div ref={logoContainerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, fontSize: isMobile ? 30 : isTablet ? 38 : 46, fontWeight: 900, letterSpacing: 2, color: '#fff', textTransform: 'uppercase' }}>
              {'SPEEDTOYZCARS'.split(' ').map((word, wordIndex) => (
                <span key={word} style={{ display: 'flex', gap: 10 }}>
                  {word.split('').map((char, charIndex) => (
                    <span key={`${wordIndex}-${charIndex}`} className="loader-logo-char" style={{ display: 'inline-block', opacity: 0 }}>{char}</span>
                  ))}
                </span>
              ))}
            </div>
            <div ref={taglineRef} style={{ color: '#9ca3af', letterSpacing: 8, fontSize: isMobile ? 11 : 13, textTransform: 'uppercase' }}>Drive Your Dreams</div>
            <div style={{ width: '100%', maxWidth: isMobile ? 360 : 520, marginTop: 6 }}>
              <div style={{ width: '100%', height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                <div ref={barFillRef} style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)', borderRadius: 999, transition: 'width 0.15s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, width: '100%', color: '#d1d5db', fontSize: isMobile ? 11 : 13, letterSpacing: 0.8 }}>
                <span style={{ opacity: 0.88 }}>SPEEDTOYZCARS</span>
                <span ref={progressTextRef} style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.95 }}>0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={contentRef} style={{ background: '#0a0a0a' }}>
        {demoMode && (
          <div style={{ background: 'rgba(239,68,68,0.12)', borderBottom: '1px solid rgba(239,68,68,0.25)', color: '#fecaca', padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>
            Showing demo data — could not reach the server.
          </div>
        )}

        {/* ── Hero & Search Section ───────────────────────────────────────────── */}
        <section ref={heroRef} style={{ position: 'relative', minHeight: isTablet ? 'auto' : 640, overflow: 'hidden', padding: isMobile ? '36px 0 48px' : isTablet ? '56px 0' : '72px 0', display: 'flex', alignItems: 'center' }}>
          <img
            className="hero-image"
            src="/images/hero-car-1.jpg"
            alt="SpeedToyzCars premium self-drive luxury car fleet in Bhubaneswar"
            loading="eager"
            fetchpriority="high"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', transformOrigin: 'center', opacity: 0.75 }}
          />
          <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.85) 100%), linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: isMobile ? '0 16px' : isTablet ? '0 40px' : '0 80px' }}>
            <div className="hero-grid-container">
              
              {/* Left Column: Hero Text, Actions & Stats */}
              <div>
                <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '5px 14px', marginBottom: 20 }}>
                  <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Premium Car Rental</span>
                </div>
                <h1 className="hero-headline" style={{ color: '#fff', fontSize: isMobile ? 24 : isTablet ? 38 : 52, fontWeight: 900, lineHeight: isMobile ? 1.15 : 1.1, margin: '0 0 16px', letterSpacing: -0.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Best Self Drive & Luxury <span className='text-red-500'>Car Rental</span> in Bhubaneswar
                </h1>
                <p className="hero-subtitle" style={{ color: '#f3f4f6', fontSize: isMobile ? 13 : 16, maxWidth: 540, marginBottom: isMobile ? 24 : 28, lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Book premium SUVs, hatchbacks, and self-drive cars instantly with clean vehicles, easy booking, and 24/7 support across Odisha.
                </p>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: isMobile ? 10 : 14, width: 'auto', flexWrap: 'nowrap', marginBottom: isMobile ? 24 : 36 }}>
                  <button type="button" aria-label="Explore available cars now" onClick={() => navigate('/cars')} className="hero-button hero-button-primary">
                    Explore Now
                  </button>
                  <button type="button" aria-label="Browse full self-drive car catalogue" onClick={() => navigate('/cars')} className="hero-button hero-button-outline">
                    Browse Cars
                  </button>
                </div>

                <div className="hero-stats-grid">
                  {stats.map(({ value, suffix, label, fixed = 0 }) => (
                    <div key={label} className="hero-stat">
                      <div
                        className="hero-stat-value"
                        data-value={value}
                        data-suffix={suffix}
                        data-fixed={fixed}
                        style={{ color: '#ef4444', fontSize: isMobile ? 20 : 26, fontWeight: 900 }}>
                        {fixed ? `0.${'0'.repeat(fixed)}${suffix}` : `0${suffix}`}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: isMobile ? 12 : 13, marginTop: 4, fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Search Widget */}
              <div className="home-reveal" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                {/* Delivery Mode Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 6, width: '100%', maxWidth: '100%', boxSizing: 'border-box', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                  {['Parking', 'Doorstep', 'Airport'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => { setDeliveryMode(mode); setSearch({ ...search, location: '' }) }}
                      style={{
                        padding: '9px 15px',
                        borderRadius: 24,
                        border: `1px solid ${deliveryMode === mode ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                        background: deliveryMode === mode ? 'rgba(239,68,68,0.18)' : 'rgba(17,24,39,0.85)',
                        color: deliveryMode === mode ? '#ef4444' : '#9ca3af',
                        fontSize: isMobile ? 12 : 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(12px)',
                        flexShrink: 0
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {mode === 'Parking' ? <FaParking size={14} /> : mode === 'Doorstep' ? <FaHome size={14} /> : <FaPlane size={14} />}
                        {mode === 'Parking' ? 'SpeedToyzCars Parking' : mode === 'Doorstep' ? 'Doorstep Delivery' : 'Airport Pickup'}
                      </span>
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    background: 'rgba(17, 24, 39, 0.88)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 16,
                    padding: isMobile ? '16px' : '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {deliveryMode !== 'Parking' && (
                    <div>
                      <label htmlFor="home-pickup-location" style={{ display: 'block', color: '#9ca3af', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                        {deliveryMode === 'Doorstep' ? 'Delivery Address' : 'Airport Name / Terminal'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontSize: 14 }}><FiMapPin /></span>
                        <input id="home-pickup-location" name="location" type="text" value={search.location} onChange={e => setSearch(s => ({ ...s, location: e.target.value }))} placeholder={deliveryMode === 'Doorstep' ? 'Enter full address map link' : 'BPIA Bhubaneswar'}
                          style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 10, color: '#fff', padding: isMobile ? '10px 10px 10px 32px' : '12px 14px 12px 38px', fontSize: isMobile ? 13 : 14, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  )}

                  <div className="hero-search-inputs-grid">
                    <div style={{ minWidth: 0 }}>
                      <label htmlFor="home-pickup-date" style={{ display: 'block', color: '#9ca3af', fontSize: isMobile ? 10 : 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Pickup Date</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontSize: 14 }}><FiCalendar /></span>
                        <input id="home-pickup-date" name="pickupDate" type="date" aria-label="Pickup Date" value={search.pickupDate} onChange={e => setSearch(s => ({ ...s, pickupDate: e.target.value }))}
                          style={{ width: '100%', minWidth: 0, background: '#1f2937', border: '1px solid #374151', borderRadius: 10, color: '#fff', padding: isMobile ? '10px 6px 10px 28px' : '12px 14px 12px 38px', fontSize: isMobile ? 12 : 14, outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none' }} />
                      </div>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <label htmlFor="home-pickup-time" style={{ display: 'block', color: '#9ca3af', fontSize: isMobile ? 10 : 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Pickup Time</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#ef4444', fontSize: 14, pointerEvents: 'none', zIndex: 1 }}><FiClock /></span>
                        <select
                          id="home-pickup-time"
                          name="pickupTime"
                          aria-label="Pickup Time"
                          value={search.pickupTime}
                          onChange={e => setSearch(s => ({ ...s, pickupTime: e.target.value }))}
                          style={{
                            width: '100%',
                            minWidth: 0,
                            background: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: 10,
                            color: '#fff',
                            padding: isMobile ? '10px 6px 10px 28px' : '12px 14px 12px 38px',
                            fontSize: isMobile ? 12 : 14,
                            outline: 'none',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            appearance: 'none',
                            WebkitAppearance: 'none'
                          }}
                        >
                          {[
                            '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
                            '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
                            '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
                          ].map(time => (
                            <option key={time} value={time} style={{ background: '#1f2937', color: '#fff' }}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Search available cars"
                    onClick={handleSearch}
                    className="btn-primary"
                    style={{
                      border: 'none',
                      color: '#fff',
                      padding: '14px 28px',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: 4,
                      width: '100%',
                      boxShadow: '0 8px 24px rgba(239,68,68,0.3)'
                    }}
                  >
                    Search Available Cars →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Booking Highlight ─────────────────────────────────────────────── */}
        <section className="home-reveal" style={{ padding: isMobile ? '32px 16px 0' : '56px 80px 0', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, minHeight: isMobile ? 320 : 420, border: '1px solid #1f2937', boxShadow: '0 18px 40px rgba(0,0,0,0.35)' }}>
            <img src="/images/feature-bg.jpg" alt="Luxury car background" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
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
        <section className="home-reveal" style={{ padding: isMobile ? '40px 16px' : '80px 80px 48px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ color: '#ef4444', fontSize: isMobile ? 11 : 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Our Fleet</div>
            <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 34, fontWeight: 800, margin: 0, letterSpacing: -1 }}>Popular Cars</h2>
            <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 15, marginTop: 8 }}>Discover our most sought-after premium vehicles</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 24 }}>
            {loading
              ? Array(6).fill(0).map((_, i) => <CarCardSkeleton key={i} />)
              : cars.slice(0, 6).map((car, i) => <div key={car._id} style={{ width: '100%' }}><CarCard car={car} index={i} /></div>)
            }
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 36 }}>
            <button onClick={() => navigate('/cars')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: '1px solid #374151', color: '#9ca3af', padding: '12px 28px', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.color = '#9ca3af' }}>
              View All Cars <FiArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ── SEO Content Blocks ────────────────────────────────────────────── */}
        <section className="home-reveal" style={{ padding: isMobile ? '40px 16px' : '72px 80px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 18 }}>
            {seoHighlights.map(item => (
              <article key={item.heading} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 18, padding: isMobile ? 18 : 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: isMobile ? 15 : 18, fontWeight: 700, marginBottom: 8 }}>{item.heading}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: isMobile ? 13 : 14, lineHeight: 1.7, margin: '0 0 12px' }}>{item.detail}</p>
                </div>
                {item.link && (
                  <Link to={item.link} style={{ color: '#ef4444', textDecoration: 'none', fontSize: 14, fontWeight: 700, marginTop: 8 }}>
                    {item.linkText}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ── Fleet Scroll ───────────────────────────────────────────────────── */}
        <section className="home-reveal" style={{ padding: isMobile ? '0 16px 40px' : '0 80px 72px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, marginBottom: 18 }}>
            <div>
              <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Fleet</div>
              <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>Choose yours from a fleet of 80+ cars</h2>
            </div>
            <button onClick={() => navigate('/cars')} style={{ border: '1px solid #374151', background: 'transparent', color: '#d1d5db', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Book Now</button>
          </div>
          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div className="marquee-track" style={{ display: 'flex', gap: 18, width: 'max-content', animation: 'marqueeLeft 28s linear infinite' }}>
              {(cars.length ? cars : MOCK_CARS).slice(0, 16).map((car, i) => (
                <div key={`${car._id || car.name}-${i}`} style={{ minWidth: isMobile ? 260 : 320, maxWidth: isMobile ? 260 : 320 }}>
                  <CarCard car={car} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose ─────────────────────────────────────────────────────── */}
        <section className="home-reveal" style={{ background: '#050505', padding: isMobile ? '40px 16px' : '72px 80px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: '#ef4444', fontSize: isMobile ? 11 : 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Why Us</div>
              <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: -1 }}>
                Why Choose <span style={{ color: '#ef4444' }}>SpeedToyzCars</span>?
              </h2>
              <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 16, maxWidth: 480, margin: '0 auto' }}>
                We deliver the finest automotive experiences with unmatched service and care.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 24 }}>
              {features.map((f, i) => (
                <div key={f.title}>
                  <div
                    style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 14, padding: isMobile ? 20 : 36, textAlign: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      {f.icon}
                    </div>
                    <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 10px' }}>{f.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: isMobile ? 13 : 14, lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        <section className="home-reveal" style={{ background: '#050505', padding: isMobile ? '40px 16px' : '72px 80px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, marginBottom: 24 }}>
              <div>
                <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Testimonials</div>
                <h2 style={{ color: '#fff', fontSize: isMobile ? 22 : 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>What travellers say about SpeedToyzCars</h2>
              </div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="marquee-track-reverse" style={{ display: 'flex', gap: 18, width: 'max-content', animation: 'marqueeLeft 110s linear infinite' }}>
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
        <section className="home-reveal" style={{ padding: isMobile ? '40px 16px' : '72px 80px', maxWidth: 1280, margin: '0 auto' }}>
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
        <section className="home-reveal" style={{ padding: isMobile ? '0 16px 40px' : '0 80px 72px', maxWidth: 1080, margin: '0 auto' }}>
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
        <section className="home-reveal" style={{ position: 'relative', overflow: 'hidden', background: '#050505' }}>
          <img src="/images/hero-car-3.jpg" alt="cta" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }} />
          <div style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(to right, rgba(0,0,0,0.92), rgba(0,0,0,0.75))', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '36px 20px' : '48px 120px', gap: 20 }}>
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
    </>
  )
}
