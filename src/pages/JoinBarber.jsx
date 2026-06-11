// src/pages/JoinBarber.jsx
import { Link } from 'react-router-dom';
import './JoinBarber.css';

const PERKS = [
  { icon: '📸', title: 'Portfolio-first', body: 'Your Instagram link is front and center on your profile. Clients see your work before they book.' },
  { icon: '📅', title: 'Your Calendly, your rules', body: 'Use your own Calendly to control your schedule, buffer time, and booking policies.' },
  { icon: '🌍', title: 'City-wide reach', body: 'Get discovered by clients in your city who are actively searching for quality cuts.' },
  { icon: '⚡', title: 'Zero commission (MVP)', body: 'We charge nothing. List your services, take bookings, keep 100% of your earnings.' },
  { icon: '🆓', title: 'Free to join', body: 'Creating a barber profile is completely free during our launch phase.' },
  { icon: '🔒', title: 'Professional profile', body: 'A dedicated profile page with your services, bio, and booking widget in one clean URL.' },
];

const STEPS = [
  { n: '1', title: 'Create your account', body: 'Register as a barber in under a minute.' },
  { n: '2', title: 'Build your profile', body: 'Add your bio, specialties, services, and Instagram handle.' },
  { n: '3', title: 'Paste your Calendly link', body: 'Link your existing Calendly booking page — or create a free one at calendly.com.' },
  { n: '4', title: 'Go live', body: 'Your profile goes live instantly. Share the link and start getting bookings.' },
];

export default function JoinBarber() {
  return (
    <div className="join-page">
      {/* Hero */}
      <div className="join-hero">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: 14 }}>For Professionals</div>
          <h1 className="serif" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
            Grow your clientele.<br /><em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>On your terms.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 17, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Join HabeshaCutz to put your portfolio in front of hundreds of clients looking for exactly your craft — with zero commission and seamless Calendly booking.
          </p>
          <Link to="/auth">
            <button className="btn-gold" style={{ fontSize: 16, padding: '14px 36px' }}>
              Join as a Barber — It's Free
            </button>
          </Link>
        </div>
      </div>

      {/* Perks */}
      <div className="section" style={{ background: '#fff' }}>
        <div className="section-inner">
          <div className="section-label">Why HabeshaCutz</div>
          <h2 className="section-title">Everything you need, nothing you don't</h2>
          <div className="perks-grid">
            {PERKS.map((p, i) => (
              <div key={i} className="perk-card">
                <div className="perk-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="section" style={{ background: 'var(--off-white)' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ textAlign: 'center' }}>Simple Setup</div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Live in 5 minutes</h2>
          </div>
          <div className="steps-list">
            {STEPS.map((s, i) => (
              <div key={i} className="step-item-v">
                <div className="step-num">{s.n}</div>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="join-cta">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2 className="serif" style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 14 }}>
            Ready to get started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: 28, fontSize: 16 }}>
            Join barbers already using HabeshaCutz to fill their chairs.
          </p>
          <Link to="/auth"><button className="btn-gold" style={{ fontSize: 16, padding: '14px 36px' }}>Create Your Profile</button></Link>
        </div>
      </div>
    </div>
  );
}
