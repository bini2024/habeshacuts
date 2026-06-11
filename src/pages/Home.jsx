// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import BarberCard from '../components/BarberCard';
import './Home.css';

const CITIES = ['All Cities', 'Toronto', 'Mississauga', 'Brampton', 'Scarborough', 'North York', 'Ottawa'];
const SPECIALTIES = ['All Styles', 'Fades', 'Lineups', 'Dreads', 'Braids', 'Beard Trims', 'Kids Cuts'];

export default function Home() {
  const [barbers, setBarbers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [city, setCity]         = useState('All Cities');
  const [specialty, setSpecialty] = useState('All Styles');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const q   = query(collection(db, 'barbers'), limit(6));
        const snap = await getDocs(q);
        setBarbers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        // Firebase not configured yet — use demo data
        setBarbers(DEMO_BARBERS);
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (city !== 'All Cities')     params.set('city', city);
    if (specialty !== 'All Styles') params.set('specialty', specialty);
    navigate(`/barbers?${params.toString()}`);
  }

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span>✦</span> Elite Barbers. Seamless Booking.
          </div>
          <h1 className="serif">
            Book the cut<br />you <em>deserve</em>
          </h1>
          <p>Find top barbers in your city, browse their portfolios, and lock in your appointment — all in under 60 seconds.</p>

          <div className="hero-search">
            <select value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={specialty} onChange={e => setSpecialty(e.target.value)}>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn-gold search-cta" onClick={handleSearch}>Find Barbers</button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat"><span>200+</span><span>Verified Barbers</span></div>
            <div className="hero-stat"><span>15k+</span><span>Happy Clients</span></div>
            <div className="hero-stat"><span>4.9★</span><span>Average Rating</span></div>
            <div className="hero-stat"><span>Free</span><span>To Book</span></div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-section">
        <div className="section-inner">
          <div className="section-label">Simple Process</div>
          <h2 className="section-title">How HabeshaCutz works</h2>
          <p className="section-sub">From search to fresh cut in three steps.</p>
          <div className="how-grid">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="how-card">
                <div className="how-num">{i + 1}</div>
                <div className="how-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED BARBERS ── */}
      <section className="section featured-section">
        <div className="section-inner">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
            <div>
              <div className="section-label">Top Rated</div>
              <h2 className="section-title">Featured barbers</h2>
            </div>
            <Link to="/barbers" className="btn-outline">View All →</Link>
          </div>

          {loading ? (
            <div className="grid-3">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320 }} />)}
            </div>
          ) : (
            <div className="grid-3">
              {barbers.map(b => <BarberCard key={b.id} barber={b} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── FOR BARBERS ── */}
      <section className="for-barbers-section">
        <div className="section-inner">
          <div className="section-label" style={{ color: 'var(--gold)' }}>For Professionals</div>
          <h2 className="section-title" style={{ color: '#fff' }}>Grow your clientele</h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,.6)', marginBottom: 40 }}>
            Join HabeshaCutz to showcase your work, manage bookings through Calendly, and reach hundreds of clients looking for your craft.
          </p>
          <div className="feat-grid">
            {BARBER_FEATURES.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/join"><button className="btn-gold">Join as a Barber</button></Link>
            <Link to="/barbers"><button className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}>See Examples</button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Static data ── */
const HOW_STEPS = [
  { icon: '🔍', title: 'Find your barber', body: 'Browse verified barbers by city, specialty, or style. Filter to find exactly who you need.' },
  { icon: '📸', title: 'Check the portfolio', body: 'Every barber links their Instagram portfolio so you can see real work before committing.' },
  { icon: '📅', title: 'Book in seconds', body: 'Click Book Now to open the barber Calendly — pick your time and confirm instantly.' },
];

const BARBER_FEATURES = [
  { icon: '📸', title: 'Show your portfolio', body: 'Link your Instagram directly. Let your cuts speak before the client even arrives.' },
  { icon: '📅', title: 'Calendly booking', body: 'Your existing Calendly calendar handles all scheduling. No new tools to learn.' },
  { icon: '🌍', title: 'Reach more clients', body: 'Get discovered by clients in your city actively looking for quality work.' },
  { icon: '⚡', title: 'Zero commission', body: 'We don\'t take a cut. Your earnings are 100% yours, every time.' },
];

const DEMO_BARBERS = [
  { id: '1', name: 'Kofi Mensah', shopName: 'The Gold Chair', city: 'Toronto, ON', bio: 'Specializing in crisp fades and clean lineups for 8+ years. Known for attention to detail.', specialties: ['Fades', 'Lineups', 'Beard Trims'], rating: '4.9', reviewCount: 127, startingPrice: 30, instagramHandle: 'habeshacuts' },
  { id: '2', name: 'Amara Diallo', shopName: 'Amara Cutz', city: 'Mississauga, ON', bio: 'Master of braids, dreads, and textured hair. Certified cosmotologist with 10+ years.', specialties: ['Braids', 'Dreads', 'Natural Hair'], rating: '5.0', reviewCount: 214, startingPrice: 45, instagramHandle: 'habeshacuts' },
  { id: '3', name: 'Yonas Tesfaye', shopName: 'Prestige Barbershop', city: 'North York, ON', bio: 'From fades to designs — I bring artistry to every cut. Walk-ins welcome on Saturdays.', specialties: ['Designs', 'Fades', 'Kids Cuts'], rating: '4.8', reviewCount: 89, startingPrice: 35, instagramHandle: 'habeshacuts' },
  { id: '4', name: 'Marcus Williams', shopName: 'The Grooming Lounge', city: 'Scarborough, ON', bio: 'Clean cuts, sharp lines, top-tier service. Book in advance — slots go fast.', specialties: ['Fades', 'Hot Towel Shave', 'Beard Trims'], rating: '4.9', reviewCount: 156, startingPrice: 40, instagramHandle: 'habeshacuts' },
  { id: '5', name: 'Dawit Solomon', shopName: 'Royal Kutz', city: 'Brampton, ON', bio: 'Award-winning barber. Specializing in modern and traditional Ethiopian hair styles.', specialties: ['Afro', 'Fades', 'Lineups'], rating: '5.0', reviewCount: 302, startingPrice: 35, instagramHandle: 'habeshacuts' },
  { id: '6', name: 'Jamal Pierre', shopName: 'JP Barbershop', city: 'Ottawa, ON', bio: 'Catering to Ottawa\'s finest since 2015. Relaxed atmosphere, premium cuts.', specialties: ['Fades', 'Braids', 'Beard Trims'], rating: '4.7', reviewCount: 78, startingPrice: 28, instagramHandle: 'habeshacuts' },
];
