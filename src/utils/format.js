import { API_BASE, API_URL } from '../config'

const currencyCache = { value: null, symbol: '₹', locale: 'en-IN' }

export const resolveCurrencySettings = async () => {
  try {
    const res = await fetch(`${API_BASE}/settings/public`)
    const data = await res.json()
    if (data?.success && data?.settings?.currency) {
      const currency = data.settings.currency
      const normalized = currency.toUpperCase()
      const match = normalized.match(/([A-Z]{3})/)
      const code = match ? match[1] : 'INR'
      const symbol = currency.includes('₹') ? '₹' : currency.includes('$') ? '$' : currency.includes('€') ? '€' : currency.includes('£') ? '£' : code
      currencyCache.value = code
      currencyCache.symbol = symbol
      currencyCache.locale = code === 'INR' ? 'en-IN' : 'en-US'
    }
  } catch {
    // keep defaults
  }
}

export const formatPrice = (price) => {
  const amount = Number(price) || 0
  return new Intl.NumberFormat(currencyCache.locale, {
    style: 'currency',
    currency: currencyCache.value || 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const cleanCarName = (name) => {
  if (!name || typeof name !== 'string') return ''
  let text = name.split(' - ')[0].trim()
  text = text.replace(/\s*-\s*.*$/, '').trim()
  text = text.replace(/\s+[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,3}[-\s]?\d{1,4}$/i, '').trim()
  text = text.replace(/\s+(OD|OR|DL|MH|KA|TN|HR|UP|WB|KL|GJ|RJ|MP|PB|TS|AP)\b.*$/i, '').trim()
  return text
}

// ─── Shared constant for car image fallback ────────────────────────────────────
export const CAR_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'

/**
 * Resolves a car's primary image URL, with proper fallback.
 * Handles: array images, single string, relative paths, and missing images.
 */
export const getCarImageSrc = (car, size = 800) => {
  const fallback = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=${size}&q=80`
  if (!car) return fallback

  // car.images array
  const imgArr = Array.isArray(car.images) ? car.images : (typeof car.images === 'string' && car.images.trim() ? [car.images.trim()] : [])
  const first = imgArr.find(src => typeof src === 'string' && src.trim().length)

  if (first) {
    return first.startsWith('http') ? first : `${API_URL}/uploads/${first}`
  }

  // car.fallbackImage (from external API)
  if (car.fallbackImage && typeof car.fallbackImage === 'string' && car.fallbackImage.startsWith('http')) {
    return car.fallbackImage
  }

  return fallback
}

/**
 * Strips non-digit characters and ensures phone numbers are max 10 digits (excluding optional 91 prefix).
 */
export const cleanPhoneDigits = (phone) => {
  if (!phone || typeof phone !== 'string') return ''
  let digits = phone.replace(/\D/g, '')
  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(2)
  }
  return digits.slice(0, 10)
}

/**
 * Formats a phone number in standard Indian format: +91 XXXXXXXXXX
 */
export const formatPhone = (phone) => {
  if (!phone) return ''
  const digits = cleanPhoneDigits(String(phone))
  if (!digits) return String(phone)
  return `+91 ${digits}`
}

/**
 * Validates whether a given phone string represents a valid 10-digit Indian phone number.
 */
export const isValidIndianPhone = (phone) => {
  const digits = cleanPhoneDigits(String(phone))
  return digits.length === 10
}

