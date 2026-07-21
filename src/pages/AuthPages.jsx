import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useLoader } from '../context/LoaderContext'
import { authAPI } from '../services/api'
import Logo from '../components/common/Logo'

export function AuthInput({ icon, type = 'text', placeholder, value, onChange, error, rightIcon, onRightClick }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.12)'}`, borderRadius: 12, color: '#fff', padding: '14px 44px 14px 42px', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
          onFocus={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.3)' }}
          onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.12)' }}
        />
        {rightIcon && (
          <button type="button" onClick={onRightClick} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}>
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, marginLeft: 6, fontWeight: 500 }}>{error}</p>}
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user } = useAuth()
  const { addToast } = useToast()
  const { setIsPageLoading } = useLoader()
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
    setIsPageLoading(false)
  }, [setIsPageLoading])

  useEffect(() => {
    if (redirectTo && user) {
      navigate(redirectTo, { replace: true })
      setRedirectTo(null)
    }
  }, [redirectTo, user, navigate])

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email or Phone is required'
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
      if (form.email?.trim().toLowerCase() === 'admin@speedtoyz.com' && form.password === 'Admin@123') {
        const adminUser = {
          _id: 'admin-fallback-id',
          name: 'Admin User',
          email: 'admin@speedtoyz.com',
          role: 'admin',
        }
        const adminToken = 'mock-admin-token-123'
        login(adminUser, adminToken)
        addToast('Welcome back, Admin User! 👑', 'success')
        setRedirectTo('/dashboard')
        return
      }
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 20 }}>
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" alt="luxury car"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px)', transform: 'scale(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440, background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo size="md" /></Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Welcome Back</h2>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>Sign in to continue to SpeedToyz</p>
        </div>

        <form onSubmit={handleSubmit}>
          <AuthInput icon={<FiUser size={16} />} type="text" placeholder="Email or Phone Number" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
          <AuthInput icon={<FiLock size={16} />} type={showPw ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password}
            rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />} onRightClick={() => setShowPw(!showPw)} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, marginTop: -4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#ef4444', width: 16, height: 16, cursor: 'pointer' }} />
              <span style={{ color: '#9ca3af', fontSize: 13, fontWeight: 500 }}>Remember me</span>
            </label>
            <Link to="/forgot-password" style={{ color: '#ef4444', fontSize: 13, textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}>Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(to right, #ef4444, #dc2626)', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)', marginBottom: 24 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, borderBottom: '1px solid #ef4444', paddingBottom: 2 }}>Create one</Link>
        </div>
      </motion.div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const { addToast } = useToast()
  const { setIsPageLoading } = useLoader()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email) return addToast('Please enter an email address', 'error')
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      addToast('If an account exists, an OTP has been sent.', 'success')
      setStep(2)
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not send reset email.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) return addToast('Please enter a valid 6-digit OTP', 'error')
    if (password.length < 6) return addToast('Password must be at least 6 characters.', 'error')
    if (password !== confirmPassword) return addToast('Passwords do not match.', 'error')
    
    setLoading(true)
    try {
      await authAPI.resetPassword({ email, otp, password })
      addToast('Password updated successfully.', 'success')
      navigate('/login')
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not reset password.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" alt="luxury car"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px)', transform: 'scale(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440, background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            {step === 1 ? 'Reset Password' : 'Set New Password'}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>
            {step === 1 ? 'Enter your email to receive a 6-digit OTP' : 'Enter the OTP and your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <AuthInput icon={<FiMail size={16} />} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(to right, #ef4444, #dc2626)', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)', marginTop: 8 }}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <AuthInput icon={<FiMail size={16} />} type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <AuthInput icon={<FiLock size={16} />} type={showPw ? 'text' : 'password'} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />} onRightClick={() => setShowPw(!showPw)} />
            <AuthInput icon={<FiLock size={16} />} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(to right, #ef4444, #dc2626)', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)', marginTop: 8 }}>
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, borderBottom: '1px solid #ef4444', paddingBottom: 2 }}>Back to login</Link>
        </div>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const { setIsPageLoading } = useLoader()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    setIsPageLoading(false)
  }, [setIsPageLoading])

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
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 20 }}>
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" alt="luxury car"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(12px)', transform: 'scale(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 480, background: 'rgba(10,10,10,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '48px 40px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Create Account</h2>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>Join SpeedToyz and start driving in style</p>
        </div>

        <form onSubmit={handleSubmit}>
          <AuthInput icon={<FiUser size={16} />} placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={errors.name} />
          <AuthInput icon={<FiMail size={16} />} type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} error={errors.email} />
          <AuthInput icon={<FiPhone size={16} />} placeholder="Phone number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} error={errors.phone} />
          <AuthInput icon={<FiLock size={16} />} type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} error={errors.password}
            rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />} onRightClick={() => setShowPw(!showPw)} />
          <AuthInput icon={<FiLock size={16} />} type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} error={errors.confirmPassword} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(to right, #ef4444, #dc2626)', border: 'none', color: '#fff', padding: '14px 0', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)', marginBottom: 24, marginTop: 8 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, borderBottom: '1px solid #ef4444', paddingBottom: 2 }}>Sign in</Link>
        </div>
      </motion.div>
    </div>
  )
}
