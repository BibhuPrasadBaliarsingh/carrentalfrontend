import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const revealConfigs = {
  'fade-up': { y: 28, x: 0, opacity: 0 },
  'fade-left': { y: 0, x: 32, opacity: 0 },
  'fade-right': { y: 0, x: -32, opacity: 0 },
  'scale-up': { scale: 0.96, opacity: 0 },
  'blur-up': { y: 24, opacity: 0, filter: 'blur(18px)' },
}

export function useRevealAnimations(rootRef) {
  useEffect(() => {
    if (!rootRef?.current) return

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.reveal-on-scroll')
      elements.forEach((element, index) => {
        const animation = element.dataset.reveal || 'fade-up'
        const config = revealConfigs[animation] || revealConfigs['fade-up']

        gsap.from(element, {
          ...config,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
          filter: config.filter || 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [rootRef])
}
