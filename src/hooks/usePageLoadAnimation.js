import { useEffect } from 'react'
import { gsap } from 'gsap'

export function usePageLoadAnimation(pageRef, logoRef) {
  useEffect(() => {
    if (!pageRef?.current) return

    const ctx = gsap.context(() => {
      gsap.set(pageRef.current, { autoAlpha: 0 })
      const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } })
      timeline.to(pageRef.current, { autoAlpha: 1, duration: 0.9 })

      if (logoRef?.current) {
        timeline.fromTo(
          logoRef.current,
          { autoAlpha: 0, y: -12 },
          { autoAlpha: 1, y: 0, duration: 0.75 },
          0.08,
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [pageRef, logoRef])
}
