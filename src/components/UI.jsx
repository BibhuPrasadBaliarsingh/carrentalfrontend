// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 40 }) {
  return (
    <div style={{ width: size, height: size, border: `3px solid #374151`, borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  )
}

// ── Page Loader ───────────────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <Spinner />
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ height = 20, width = '100%', className = '' }) {
  return <div className={`skeleton ${className}`} style={{ height, width }} />
}

export function CarCardSkeleton() {
  return (
    <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, overflow: 'hidden' }}>
      <Skeleton height={180} />
      <div style={{ padding: 16 }}>
        <Skeleton height={12} width="40%" className="mb-2" />
        <Skeleton height={18} width="70%" className="mb-4" />
        <Skeleton height={14} width="50%" className="mb-3" />
        <Skeleton height={36} />
      </div>
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ children, color = '#ef4444', textColor = '#fff' }) {
  return (
    <span style={{ background: color, color: textColor, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, letterSpacing: 1, textTransform: 'uppercase', display: 'inline-block' }}>
      {children}
    </span>
  )
}

// ── Status Badge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    Confirmed:  { bg: 'rgba(22,163,74,0.12)',   color: '#16a34a' },
    Pending:    { bg: 'rgba(217,119,6,0.12)',    color: '#d97706' },
    Completed:  { bg: 'rgba(107,114,128,0.12)',  color: '#9ca3af' },
    Cancelled:  { bg: 'rgba(239,68,68,0.12)',    color: '#ef4444' },
    Active:     { bg: 'rgba(22,163,74,0.12)',    color: '#16a34a' },
    Banned:     { bg: 'rgba(239,68,68,0.12)',    color: '#ef4444' },
  }
  const s = map[status] || map.Pending
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, padding: '3px 10px', borderRadius: 4, fontWeight: 700, letterSpacing: 0.5 }}>{status}</span>
  )
}

// ── Star Rating ───────────────────────────────────────────────────────────────
export function StarRating({ rating, showCount = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ color: '#FFD700', fontSize: 13 }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
      {showCount && <span style={{ color: '#6b7280', fontSize: 12 }}>{rating}</span>}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, message, action, onAction }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 24 }}>{message}</p>
      {action && (
        <button onClick={onAction} className="btn-primary" style={{ border: 'none', color: '#fff', padding: '10px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
          {action}
        </button>
      )}
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div>
      {label && <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</label>}
      <input
        style={{ width: '100%', background: '#1f2937', border: `1px solid ${error ? '#ef4444' : '#374151'}`, borderRadius: 8, color: '#fff', padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        {...props}
      />
      {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</label>}
      <select style={{ width: '100%', background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#d1d5db', padding: '10px 14px', fontSize: 14, outline: 'none', cursor: 'pointer' }} {...props}>
        {children}
      </select>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, maxWidth = 560 }) {
  if (!isOpen) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="animate-scaleIn" style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 36, width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, change, color = '#ef4444' }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        {change && (
          <span style={{ background: 'rgba(22,163,74,0.12)', color: '#16a34a', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ color: '#fff', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{value}</div>
      <div style={{ color: '#6b7280', fontSize: 12 }}>{label}</div>
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: '#1f2937', margin: '16px 0' }} />
}
