import { useEffect } from 'react'

const DEFAULT_TITLE = 'SpeedToyzCars | Car Rental in Bhubaneswar'
const DEFAULT_DESC = 'Book self drive car rental in Bhubaneswar with SpeedToyzCars. Hatchbacks, SUVs, automatic cars & airport pickup at low daily rates.'
const BASE_URL = 'https://speedtoyzcars.com'

export function useSeoHead({
  title,
  description,
  keywords,
  path = '',
  breadcrumbs,
  jsonLd,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
} = {}) {
  useEffect(() => {
    // 1. Update Title
    let finalTitle = DEFAULT_TITLE
    if (title) {
      finalTitle = title.includes('SpeedToyzCars') ? title : `${title} | SpeedToyzCars`
    }
    document.title = finalTitle

    // 2. Update Meta Description
    const finalDesc = description || DEFAULT_DESC
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', finalDesc)

    // 3. Update Keywords if provided
    if (keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]')
      if (!metaKw) {
        metaKw = document.createElement('meta')
        metaKw.name = 'keywords'
        document.head.appendChild(metaKw)
      }
      metaKw.setAttribute('content', keywords)
    }

    // 4. Update Robots
    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.name = 'robots'
      document.head.appendChild(metaRobots)
    }
    metaRobots.setAttribute('content', robots)

    // 5. Update OG Meta Tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', finalTitle)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', finalDesc)

    // 6. Update Twitter Meta Tags
    let twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', finalTitle)

    let twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', finalDesc)

    // 7. Update Canonical Tag
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : window.location.pathname
    const canonicalUrl = `${BASE_URL}${cleanPath === '/' ? '/' : cleanPath}`
    
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)

    // 8. Inject Dynamic Page-Level JSON-LD Schemas (BreadcrumbList & Custom JSON-LD)
    const scriptIds = []

    if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': b.name,
          'item': b.item.startsWith('http') ? b.item : `${BASE_URL}${b.item.startsWith('/') ? b.item : `/${b.item}`}`
        }))
      }
      const script = document.createElement('script')
      script.id = 'seo-breadcrumb-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(breadcrumbSchema)
      document.head.appendChild(script)
      scriptIds.push('seo-breadcrumb-jsonld')
    }

    if (jsonLd) {
      const script = document.createElement('script')
      script.id = 'seo-custom-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
      scriptIds.push('seo-custom-jsonld')
    }

    return () => {
      scriptIds.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.remove()
      })
    }
  }, [title, description, keywords, path, breadcrumbs, jsonLd, robots])
}
