// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 80, fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '16px 0 10px' }}>Page not found</h2>
      <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>This page doesn't exist or was moved.</p>
      <Link to="/" className="btn-gold">Back to Home</Link>
    </div>
  );
}
