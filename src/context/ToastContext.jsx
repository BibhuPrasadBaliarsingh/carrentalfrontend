import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }
  const colors = {
    success: { bg: '#16a34a', border: '#15803d' },
    error:   { bg: '#dc2626', border: '#b91c1c' },
    info:    { bg: '#2563eb', border: '#1d4ed8' },
    warning: { bg: '#d97706', border: '#b45309' },
  }

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none' }}>
      {toasts.map(t => {
        const c = colors[t.type] || colors.info
        return (
          <div key={t.id} className="toast-enter" style={{ background: c.bg, border: `1px solid ${c.border}`, color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 280, maxWidth: 380, display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{icons[t.type]}</span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
          </div>
        )
      })}
    </div>
  )
}
