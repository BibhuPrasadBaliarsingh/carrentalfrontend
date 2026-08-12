import { useEffect } from 'react'

const DEFAULT_TITLE = 'Car Rental Near Me in Bhubaneswar — SpeedToyz Self Drive & Luxury Cars'
const DEFAULT_DESC = 'Looking for a car rental near me in Bhubaneswar? SpeedToyz offers self-drive SUVs, luxury sedans, & hatchbacks with 24/7 doorstep delivery & airport pickup across Bhubaneswar, Odisha.'
const BASE_URL = 'https://speedtoyzcars.com'

export function useSeoHead({ title, description, path = '' } = {}) {
  useEffect(() => {
    // 1. Update Title
    let finalTitle = DEFAULT_TITLE
    if (title) {
      finalTitle = title.includes('SpeedToyz') ? title : `${title} | SpeedToyz Car Rental Bhubaneswar`
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

    // 3. Update OG Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', finalTitle)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', finalDesc)

    // 4. Update Twitter Title & Description
    let twTitle = document.querySelector('meta[name="twitter:title"]')
    if (twTitle) twTitle.setAttribute('content', finalTitle)

    let twDesc = document.querySelector('meta[name="twitter:description"]')
    if (twDesc) twDesc.setAttribute('content', finalDesc)

    // 5. Update Canonical Tag
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : window.location.pathname
    const canonicalUrl = `${BASE_URL}${cleanPath === '/' ? '/' : cleanPath}`
    
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)
  }, [title, description, path])
}
