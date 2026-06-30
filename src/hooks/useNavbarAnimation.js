import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useNavbarAnimation(navRef, logoRef) {
  useEffect(() => {
    if (!navRef?.current) return

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, { opacity: 0, y: -24, duration: 0.8, ease: 'power3.out' })

      if (logoRef?.current) {
        gsap.from(logoRef.current, { opacity: 0, y: -16, duration: 0.8, ease: 'power3.out', delay: 0.1 })
      }

      const links = gsap.utils.toArray('.nav-link')
      if (links.length) {
        gsap.from(links, { opacity: 0, y: -10, duration: 0.65, stagger: 0.08, delay: 0.14, ease: 'power3.out' })
      }

      const state = { progress: 0 }
      const tween = gsap.to(state, {
        progress: 1,
        ease: 'none',
        immediateRender: false,
        paused: true,
      })

      const reveal = gsap.to(navRef.current, {
        scale: 0.995,
        backdropFilter: 'blur(14px)',
        backgroundColor: 'rgba(10, 10, 10, 0.92)',
        borderBottomColor: 'rgba(31,41,55,0.9)',
        duration: 0.35,
        ease: 'power2.out',
        paused: true,
      })

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: '+=160',
        onUpdate(self) {
          if (self.progress > 0.08) {
            reveal.play()
          } else {
            reveal.reverse()
          }
        },
      })
    }, navRef)

    return () => ctx.revert()
  }, [navRef, logoRef])
}
