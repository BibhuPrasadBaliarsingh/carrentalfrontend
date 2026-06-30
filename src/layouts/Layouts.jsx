import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SmoothScroll from '../components/SmoothScroll'
import { usePageLoadAnimation } from '../hooks/usePageLoadAnimation'
import { useRevealAnimations } from '../hooks/useRevealAnimations'

export function MainLayout() {
  const { pathname, search } = useLocation()
  const pageRef = useRef(null)

  usePageLoadAnimation(pageRef)
  useRevealAnimations(pageRef)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0a' }}>
      <SmoothScroll />
      <Navbar />
      <main ref={pageRef} style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export function DashboardLayout() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Outlet />
    </div>
  )
}
