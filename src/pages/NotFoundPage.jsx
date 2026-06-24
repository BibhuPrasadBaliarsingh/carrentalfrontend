export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '70vh', padding: '40px 24px', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <h1 style={{ fontSize: 56, margin: 0, color: '#ef4444' }}>404</h1>
        <h2 style={{ margin: '8px 0 10px' }}>Page not found</h2>
        <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>The page you requested does not exist or may have been moved.</p>
      </div>
    </div>
  )
}
