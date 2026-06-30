import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export function useHeroAnimation(heroRef) {
  useEffect(() => {
    if (!heroRef?.current) return

    const ctx = gsap.context(() => {
      const headline = heroRef.current.querySelector('.hero-headline')
      const subtitle = heroRef.current.querySelector('.hero-subtitle')
      const buttons = heroRef.current.querySelectorAll('.hero-button')
      const image = heroRef.current.querySelector('.hero-image')

      if (headline) {
        const split = new SplitType(headline, { types: ['words', 'chars'], tagName: 'span' })

        if (split.words?.length) {
          gsap.fromTo(
            split.words,
            { opacity: 0, y: 40, filter: 'blur(18px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.95,
              ease: 'power4.out',
              stagger: 0.08,
            },
          )
        }
      }

      if (subtitle) {
        gsap.from(subtitle, {
          opacity: 0,
          y: 20,
          duration: 0.75,
          delay: 0.18,
          ease: 'power3.out',
        })
      }

      if (buttons.length) {
        gsap.from(buttons, {
          opacity: 0,
          y: 18,
          scale: 0.96,
          duration: 0.65,
          delay: 0.3,
          ease: 'power3.out',
          stagger: 0.08,
        })
      }

      if (image) {
        gsap.to(image, {
          scale: 1.03,
          duration: 16,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        })

        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate(self) {
            gsap.to(image, {
              x: (self.progress - 0.5) * 14,
              y: (self.progress - 0.5) * 10,
              duration: 0.5,
              ease: 'power1.out',
            })
          },
        })
      }
    }, heroRef)

    return () => {
      ctx.revert()
    }
  }, [heroRef])
}
