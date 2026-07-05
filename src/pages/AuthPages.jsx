import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authAPI } from '../services/api'
import Logo from '../components/common/Logo'

export function AuthInput({ icon, type = 'text', placeholder, value, onChange, error, rightIcon, onRightClick }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ width: '100%', background: '#1f2937', border: `1px solid ${error ? '#ef4444' : '#374151'}`, borderRadius: 10, color: '#fff', padding: '13px 44px 13px 42px', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} />
        {rightIcon && (
          <button type="button" onClick={onRightClick} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}>
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5, marginLeft: 4 }}>{error}</p>}
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [redirectTo, setRedirectTo] = useState(null)

  const fromState = location.state?.from
  const fromPath = typeof fromState === 'string' ? fromState : fromState?.pathname || '/'
  const normalizeDestination = (role) => {
    const defaultPath = role === 'admin' ? '/dashboard' : '/'
    if (!fromPath || fromPath === '/' || fromPath === '/login' || fromPath === '/register') {
      return defaultPath
    }
    return fromPath
  }

  useEffect(() => {
    if (redirectTo && user) {
      navigate(redirectTo, { replace: true })
      setRedirectTo(null)
    }
  }, [redirectTo, user, navigate])

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      login(res.data.user, res.data.token)
      addToast(`Welcome back, ${res.data.user.name}! 👋`, 'success')
      setRedirectTo(normalizeDestination(res.data.user.role))
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1000&q=80" alt="luxury car"
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(5,5,5,0.95))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
            <Logo size="md" />
          </Link>
          <h2 style={{ color: '#fff', fontSize: 40, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Drive the cars<br />of your dreams.
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.7, maxWidth: 340 }}>
            Join thousands of car enthusiasts who experience luxury driving with SpeedToyz.
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
            {[['80+', 'Cars'], ['4.9★', 'Rating'], ['20K+', 'Clients']].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: '#ef4444', fontSize: 22, fontWeight: 900 }}>{v}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div style={{ width: 440, background: '#050505', borderLeft: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: '100%' }}>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 32 }}>Sign in to your SPEED TOYZ CARS account</p>

          <form onSubmit={handleSubmit}>
            <AuthInput icon={<FiMail size={16} />} type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
            <AuthInput icon={<FiLock size={16} />} type={showPw ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password}
              rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />} onRightClick={() => setShowPw(!showPw)} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: -8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#ef4444' }} />
                <span style={{ color: '#9ca3af', fontSize: 13 }}>Remember me</span>
              </label>
              <Link to="/forgot-password" style={{ color: '#ef4444', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: '#ef4444', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'all 0.2s', marginBottom: 20 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 700 }}>Create one</Link>
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: 14, fontSize: 12, color: '#6b7280', lineHeight: 1.7 }}>
            💡 <strong style={{ color: '#9ca3af' }}>Demo:</strong> Admin — admin@speedtoyz.com / Admin@123  |  User — john@example.com / User@123
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      addToast('If an account exists, a reset link has been sent.', 'success')
      setEmail('')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not send reset email.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 48, width: '100%', maxWidth: 480 }}>
        <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Reset password</h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24 }}>Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <AuthInput icon={<FiMail size={16} />} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#ef4444', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, marginTop: 6 }}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 700 }}>Back to login</Link>
        </div>
      </motion.div>
    </div>
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = useParams()
  const { addToast } = useToast()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.password || form.password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error')
      return
    }
    if (form.password !== form.confirmPassword) {
      addToast('Passwords do not match.', 'error')
      return
    }
    setLoading(true)
    try {
      await authAPI.resetPassword(token, form.password)
      addToast('Password updated successfully.', 'success')
      navigate('/login')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not reset password.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 48, width: '100%', maxWidth: 480 }}>
        <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Set new password</h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24 }}>Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit}>
          <AuthInput icon={<FiLock size={16} />} type={showPw ? 'text' : 'password'} placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />} onRightClick={() => setShowPw(!showPw)} />
          <AuthInput icon={<FiLock size={16} />} type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#ef4444', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, marginTop: 6 }}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone) e.phone = 'Phone is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data.user, res.data.token)
      addToast('Account created! Welcome to SPEED TOYZ CARS 🎉', 'success')
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create your account. Please try again.'
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 20, padding: 48, width: '100%', maxWidth: 480 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 28 }}>
          <Logo size="sm" />
        </Link>

        <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Create Account</h2>
        <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 28 }}>Join SPEED TOYZ CARS and start driving in style</p>

        <form onSubmit={handleSubmit}>
          <AuthInput icon={<FiUser size={16} />} placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
          <AuthInput icon={<FiMail size={16} />} type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
          <AuthInput icon={<FiPhone size={16} />} placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} error={errors.phone} />
          <AuthInput icon={<FiLock size={16} />} type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password}
            rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />} onRightClick={() => setShowPw(!showPw)} />
          <AuthInput icon={<FiLock size={16} />} type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} error={errors.confirmPassword} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#ef4444', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'all 0.2s', marginBottom: 20, marginTop: 8 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
        </div>
      </motion.div>
    </div>
  )
}
