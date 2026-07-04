import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

export function useHeroAnimation(heroRef, enabled = true) {
  useEffect(() => {
    if (!enabled || !heroRef?.current) return

    let split = null
    const ctx = gsap.context(() => {
      const badge = heroRef.current.querySelector('.hero-badge')
      const headline = heroRef.current.querySelector('.hero-headline')
      const subtitle = heroRef.current.querySelector('.hero-subtitle')
      const buttons = heroRef.current.querySelectorAll('.hero-button')
      const stats = heroRef.current.querySelectorAll('.hero-stat')
      const image = heroRef.current.querySelector('.hero-image')
      const overlay = heroRef.current.querySelector('.hero-overlay')

      const heroIntro = gsap.timeline({ defaults: { ease: 'power4.out' } })

      heroIntro.from(badge, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
      })

      if (headline) {
        split = new SplitType(headline, { types: ['words'], tagName: 'span' })
        const words = split.words || []
        heroIntro.from(words, {
          autoAlpha: 0,
          y: 36,
          filter: 'blur(20px)',
          stagger: 0.08,
          duration: 0.9,
        }, '-=0.35')
      }

      heroIntro.from(subtitle, {
        autoAlpha: 0,
        y: 24,
        duration: 0.75,
      }, '-=0.55')

      heroIntro.from(buttons, {
        autoAlpha: 0,
        y: 18,
        scale: 0.96,
        duration: 0.68,
        stagger: 0.08,
      }, '-=0.45')

      heroIntro.from(stats, {
        autoAlpha: 0,
        y: 26,
        duration: 0.75,
        stagger: 0.08,
      }, '-=0.55')

      heroIntro.add(() => {
        const statElements = heroRef.current.querySelectorAll('.hero-stat-value')
        statElements.forEach(el => {
          const target = Number(el.dataset.value || 0)
          const suffix = el.dataset.suffix || ''
          const fixed = Number(el.dataset.fixed || 0)
          const counter = { value: fixed ? 0 : 0 }

          gsap.to(counter, {
            value: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => {
              const display = fixed
                ? counter.value.toFixed(fixed)
                : Math.round(counter.value)
              el.textContent = `${display}${suffix}`
            },
          })
        })
      }, '-=0.4')

      if (image) {
        gsap.to(image, {
          scale: 1.04,
          duration: 22,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        })

        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate(self) {
            gsap.to(image, {
              x: (self.progress - 0.5) * 16,
              y: (self.progress - 0.5) * 10,
              duration: 0.4,
              ease: 'power1.out',
            })

            gsap.to(overlay, {
              background: `linear-gradient(180deg, rgba(15,23,42,${0.10 + self.progress * 0.28}) 0%, rgba(15,23,42,${0.42 + self.progress * 0.32}) 40%, rgba(0,0,0,${0.84 + self.progress * 0.16}) 100%)`,
              duration: 0.4,
              ease: 'power1.out',
            })
          },
        })
      }
    }, heroRef)

    return () => {
      ctx.revert()
      if (split) split.revert()
    }
  }, [enabled, heroRef])
}
