import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { contactAPI } from '../services/api'

export default function ContactPage() {
  const { addToast } = useToast()
  const shouldReduceMotion = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [settings, setSettings] = useState({ platformName: 'SpeedToyz', supportEmail: 'support@speedtoyz.com' })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings/public`)
        const data = await res.json()
        if (data?.success) setSettings(data.settings || settings)
      } catch {
        // keep defaults
      }
    }
    fetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await contactAPI.send(form)
      setSubmitted(true)
      addToast('Thanks for reaching out. We will get back soon.', 'success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not send your message.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px', background: '#0a0a0a', color: '#fff' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 28 }}>
        <h1 style={{ margin: 0, fontSize: 30 }}>Contact us</h1>
        <p style={{ color: '#9ca3af', marginTop: 8, lineHeight: 1.7 }}>Need help with a booking, fleet options, or delivery details? Send us a note and our team will be in touch.</p>
        <p style={{ color: '#6b7280', marginTop: 8 }}>Prefer email? Reach us at <a href={`mailto:${settings.supportEmail}`} style={{ color: '#ef4444', textDecoration: 'none' }}>{settings.supportEmail}</a>.</p>
        {submitted && (
          <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }} animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} style={{ marginTop: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(22,163,74,0.14)', border: '1px solid rgba(22,163,74,0.3)', color: '#bbf7d0' }}>
            Message sent — our team will get back to you shortly.
          </motion.div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14, marginTop: 20 }}>
          <motion.input whileFocus={shouldReduceMotion ? undefined : { scale: 1.01, boxShadow: '0 0 0 3px rgba(239,68,68,0.16)' }} transition={{ duration: 0.2, ease: 'easeOut' }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: '12px 14px', color: '#fff' }} />
          <motion.input type="email" whileFocus={shouldReduceMotion ? undefined : { scale: 1.01, boxShadow: '0 0 0 3px rgba(239,68,68,0.16)' }} transition={{ duration: 0.2, ease: 'easeOut' }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" required style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: '12px 14px', color: '#fff' }} />
          <motion.textarea whileFocus={shouldReduceMotion ? undefined : { scale: 1.01, boxShadow: '0 0 0 3px rgba(239,68,68,0.16)' }} transition={{ duration: 0.2, ease: 'easeOut' }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={6} required style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, padding: '12px 14px', color: '#fff', resize: 'vertical' }} />
          <button disabled={submitting} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 16px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700 }}>{submitting ? 'Sending...' : 'Send message'}</button>
        </form>
      </div>
    </div>
  )
}
