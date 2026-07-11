import { API_BASE } from '../config'

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
