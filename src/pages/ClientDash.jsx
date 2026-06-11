// src/pages/ClientDash.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function ClientDash() {
  const { profile } = useAuth();
  const initials = (profile?.name || 'C').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="dash-layout">
      <div className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-name">{profile?.name || 'Client'}</div>
          <div className="sidebar-role">Client Account</div>
        </div>
        <button className="sidebar-item active">
          <span>📅</span> My Bookings
        </button>
        <button className="sidebar-item">
          <span>🔍</span> Browse Barbers
        </button>
      </div>

      <div className="dash-main">
        <div className="dash-title">My Bookings</div>
        <p className="dash-sub">Your upcoming and past appointments.</p>

        <div className="info-banner">
          <div className="info-banner-icon">📅</div>
          <div>
            <strong>Manage bookings via Calendly</strong>
            <p>All your appointments are managed through each barber's Calendly calendar. You'll receive confirmation emails directly from Calendly when you book. To reschedule or cancel, use the link in your confirmation email.</p>
          </div>
        </div>

        <div className="form-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✂️</div>
          <h3 style={{ fontFamily: 'var(--serif)', marginBottom: 10 }}>No bookings yet</h3>
          <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 380, margin: '0 auto 24px' }}>
            Ready for a fresh cut? Browse our verified barbers and book your first appointment in seconds.
          </p>
          <Link to="/barbers" className="btn-gold">Find a Barber →</Link>
        </div>
      </div>
    </div>
  );
}
