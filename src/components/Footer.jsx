// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)', color: 'rgba(255,255,255,.45)',
      padding: '40px 5%',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10 }}>
            Habesha<span style={{ color: 'var(--gold)' }}>Cutz</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65 }}>
            Elite barbers. Seamless booking.<br />Your next fresh cut is one tap away.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12, fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase' }}>Explore</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/barbers" style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Browse Barbers</Link>
            <Link to="/join"    style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>List Your Shop</Link>
            <Link to="/auth"    style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: 12, fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase' }}>For Barbers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link to="/join" style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>Join the Platform</Link>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,.45)' }}>Manage Bookings</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,.45)' }}>Calendly Integration</span>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20, textAlign: 'center', fontSize: 13 }}>
        © {new Date().getFullYear()} <span style={{ color: 'var(--gold)' }}>HabeshaCutz</span>. All rights reserved.
      </div>
    </footer>
  );
}
