import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation(ref, options = {}) {
  const {
    scrub = true,
    staggerChildren = true,
    animationType = 'fadeSlideUp',
  } = options

  useEffect(() => {
    if (!ref?.current) return

    let ctx = null
    const timer = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const elements = Array.from(ref.current.querySelectorAll('[data-scroll-animate]'))

        if (!elements.length) return

        elements.forEach((el, index) => {
          let fromProps = {}
          let toProps = {}

          switch (animationType) {
            case 'fadeSlideUp':
              fromProps = { opacity: 0, y: 60 }
              toProps = { opacity: 1, y: 0 }
              break
            case 'scale':
              fromProps = { opacity: 0, scale: 0.85 }
              toProps = { opacity: 1, scale: 1 }
              break
            case 'slideIn':
              fromProps = { opacity: 0, x: -60 }
              toProps = { opacity: 1, x: 0 }
              break
            default:
              fromProps = { opacity: 0 }
              toProps = { opacity: 1 }
          }

          gsap.set(el, fromProps)

          const tl = gsap.timeline()
          tl.to(el, toProps, 0)

          const staggerDelay = staggerChildren ? index * 0.06 : 0

          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            end: 'top 20%',
            scrub: scrub ? 0.5 : false,
            onUpdate(self) {
              const progress = Math.max(0, self.progress - staggerDelay)
              const clampedProgress = staggerChildren ? Math.min(1, progress / 0.94) : self.progress
              tl.progress(clampedProgress)
            },
          })
        })
      }, ref)
    })

    return () => {
      cancelAnimationFrame(timer)
      if (ctx) ctx.revert()
    }
  }, [ref, animationType, scrub, staggerChildren])
}
