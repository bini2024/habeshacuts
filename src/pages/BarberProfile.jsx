// src/pages/BarberProfile.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

import './BarberProfile.css';
function isValidCalendlyUrl(url) {
  if (!url || url.trim() === '') return false;
  try {
    const u = new URL(url.trim());
    return u.hostname === 'calendly.com' && u.pathname.replace('/', '').length > 0;
  } catch { return false; }
}
export default function BarberProfile() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('book'); // 'book' | 'about'

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'barbers', id));
        if (snap.exists()) {
          setBarber({ id: snap.id, ...snap.data() });
        } else {
          // fallback to demo
          const demo = DEMO_BARBERS.find(b => b.id === id);
          setBarber(demo || null);
        }
      } catch {
        const demo = DEMO_BARBERS.find(b => b.id === id);
        setBarber(demo || null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <span className="spinner dark" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );

  if (!barber) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✂️</div>
      <h2 style={{ fontFamily: 'var(--serif)', marginBottom: 10 }}>Barber not found</h2>
      <Link to="/barbers" className="btn-gold">Browse All Barbers</Link>
    </div>
  );

  const initials = barber.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
  const igHandle = barber.instagramHandle?.replace('@','') || '';

  return (
    <div className="profile-page fade-in">
      {/* ── HEADER ── */}
      <div className="profile-header">
        <div className="profile-header-inner">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="profile-hero-card">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-info">
              <div className="profile-name">{barber.name}</div>
              <div className="profile-shop">{barber.shopName || 'Independent'}</div>
              <div className="profile-loc">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {barber.city || 'Toronto, ON'}
              </div>
              <div className="profile-meta">
                <span className="rating">
                  <span className="stars">★★★★★</span>
                  {barber.rating} <span className="muted">({barber.reviewCount} reviews)</span>
                </span>
                {barber.startingPrice && (
                  <span className="price-badge">From ${barber.startingPrice}</span>
                )}
              </div>
              <div className="profile-tags">
                {barber.specialties?.map(s => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="profile-body section-inner">
        {/* Left column */}
        <div className="profile-left">
          {/* About */}
          {barber.bio && (
            <div className="profile-section-card">
              <h3>About</h3>
              <p>{barber.bio}</p>
            </div>
          )}

          {/* Services */}
          {barber.services?.length > 0 && (
            <div className="profile-section-card">
              <h3>Services & Pricing</h3>
              <div className="services-list">
                {barber.services.map((s, i) => (
                  <div key={i} className="service-item">
                    <span className="service-name">{s.name}</span>
                    <div className="service-right">
                      {s.duration && <span className="service-dur">{s.duration} min</span>}
                      <span className="service-price">${s.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instagram Portfolio */}
          {igHandle && (
            <div className="profile-section-card">
              <h3>Portfolio</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
                See real cuts, real clients. Check {barber.name.split(' ')[0]}'s Instagram for the latest work.
              </p>
              <a
                href={`https://instagram.com/${igHandle}`}
                target="_blank" rel="noopener noreferrer"
                className="ig-full-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                View @{igHandle} on Instagram
              </a>
              <div className="ig-preview-note">
                💡 Tip: Tap the link above to browse their full portfolio before booking.
              </div>
            </div>
          )}
        </div>

        {/* Right column — Calendly */}
        <div className="profile-right">
          <div className="calendly-card">
            <div className="calendly-header">
              <h3>Book an Appointment</h3>
              <p>Select a time that works for you. Confirmation is sent instantly to your email.</p>
            </div>

            {isValidCalendlyUrl(barber.calendlyUrl) ? (
  <div style={{ overflow: 'hidden', borderRadius: '0 0 16px 16px' }}>
    <iframe
      src={`${barber.calendlyUrl.trim()}?embed_type=Inline&hide_gdpr_banner=1&primary_color=D4AF37`}
      width="100%"
      height="660"
      frameBorder="0"
      title={`Book with ${barber.name}`}
    />
  </div>
            ) : (
              <div className="no-calendly">
                <div style={{ fontSize: 40, marginBottom: 16 }}>📅</div>
                <h4>Booking Coming Soon</h4>
                <p>This barber hasn't connected their Calendly yet.</p>
                {igHandle && (
                  <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" className="btn-dark" style={{ marginTop: 16, display: 'inline-flex' }}>
                    Message on Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const DEMO_BARBERS = [
  { id: '1', name: 'Kofi Mensah', shopName: 'The Gold Chair', city: 'Toronto, ON', bio: 'Specializing in crisp fades and clean lineups for 8+ years. Known for attention to detail and creating a premium experience for every client.', specialties: ['Fades', 'Lineups', 'Beard Trims'], rating: '4.9', reviewCount: 127, startingPrice: 30, instagramHandle: 'habeshacuts', calendlyUrl: '', services: [{ name: 'Fade + Lineup', price: 35, duration: 45 }, { name: 'Beard Trim', price: 20, duration: 20 }, { name: 'Full Service', price: 50, duration: 60 }] },
  { id: '2', name: 'Amara Diallo', shopName: 'Amara Cutz', city: 'Mississauga, ON', bio: 'Master of braids, dreads, and textured hair. Certified cosmotologist with 10+ years.', specialties: ['Braids', 'Dreads', 'Natural Hair'], rating: '5.0', reviewCount: 214, startingPrice: 45, instagramHandle: 'habeshacuts', calendlyUrl: '' },
  { id: '3', name: 'Yonas Tesfaye', shopName: 'Prestige Barbershop', city: 'North York, ON', bio: 'From fades to designs — I bring artistry to every cut.', specialties: ['Designs', 'Fades', 'Kids Cuts'], rating: '4.8', reviewCount: 89, startingPrice: 35, instagramHandle: 'habeshacuts', calendlyUrl: '' },
  { id: '4', name: 'Marcus Williams', shopName: 'The Grooming Lounge', city: 'Scarborough, ON', bio: 'Clean cuts, sharp lines, top-tier service.', specialties: ['Fades', 'Hot Towel Shave', 'Beard Trims'], rating: '4.9', reviewCount: 156, startingPrice: 40, instagramHandle: 'habeshacuts', calendlyUrl: '' },
  { id: '5', name: 'Dawit Solomon', shopName: 'Royal Kutz', city: 'Brampton, ON', bio: 'Award-winning barber. Modern and traditional styles.', specialties: ['Afro', 'Fades', 'Lineups'], rating: '5.0', reviewCount: 302, startingPrice: 35, instagramHandle: 'habeshacuts', calendlyUrl: '' },
  { id: '6', name: 'Jamal Pierre', shopName: 'JP Barbershop', city: 'Ottawa, ON', bio: 'Catering to Ottawa\'s finest since 2015.', specialties: ['Fades', 'Braids', 'Beard Trims'], rating: '4.7', reviewCount: 78, startingPrice: 28, instagramHandle: 'habeshacuts', calendlyUrl: '' },
  { id: '7', name: 'Ahmed Hassan', shopName: 'Precision Cuts', city: 'Toronto, ON', bio: 'Precision barber with a love for clean edges and designs.', specialties: ['Lineups', 'Designs', 'Fades'], rating: '4.9', reviewCount: 201, startingPrice: 32, instagramHandle: 'habeshacuts', calendlyUrl: '' },
  { id: '8', name: 'Elijah Brooks', shopName: 'Brooks Barbershop', city: 'Mississauga, ON', bio: 'Family barber. Kids welcome. Saturday walk-ins available.', specialties: ['Kids Cuts', 'Fades', 'Beard Trims'], rating: '4.8', reviewCount: 143, startingPrice: 25, instagramHandle: 'habeshacuts', calendlyUrl: '' },
];
