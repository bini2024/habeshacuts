// src/pages/Barbers.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import BarberCard from '../components/BarberCard';
import './Barbers.css';

const CITIES       = ['All Cities', 'Toronto', 'Mississauga', 'Brampton', 'Scarborough', 'North York', 'Ottawa'];
const SPECIALTIES  = ['All Styles', 'Fades', 'Lineups', 'Dreads', 'Braids', 'Beard Trims', 'Kids Cuts', 'Designs', 'Natural Hair'];

export default function Barbers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [barbers, setBarbers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [city, setCity]         = useState(searchParams.get('city') || 'All Cities');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'All Styles');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const q    = query(collection(db, 'barbers'));
        const snap = await getDocs(q);
        setBarbers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        setBarbers(DEMO_BARBERS);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const filtered = barbers.filter(b => {
    const matchCity = city === 'All Cities' || (b.city || '').toLowerCase().includes(city.toLowerCase());
    const matchSpec = specialty === 'All Styles' || b.specialties?.some(s => s.toLowerCase().includes(specialty.toLowerCase()));
    const matchSearch = !search ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      b.bio?.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSpec && matchSearch;
  });

  function updateFilter(key, val) {
    if (key === 'city') setCity(val);
    if (key === 'specialty') setSpecialty(val);
    const p = new URLSearchParams(searchParams);
    if (val && val !== 'All Cities' && val !== 'All Styles') p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  }

  return (
    <div>
      <div className="barbers-hero">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ color: 'var(--gold)', textAlign: 'center' }}>Discover</div>
          <h1 className="serif" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>
            Find your perfect barber
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Every barber on HabeshaCutz is verified. Browse real portfolios, read reviews, and book instantly.
          </p>
        </div>
      </div>

      <div className="barbers-filters">
        <div className="section-inner">
          <div className="filter-row">
            <div className="search-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                placeholder="Search by name, shop…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select value={city} onChange={e => updateFilter('city', e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={specialty} onChange={e => updateFilter('specialty', e.target.value)}>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="results-meta">
            {loading ? 'Loading barbers…' : `${filtered.length} barber${filtered.length !== 1 ? 's' : ''} found`}
          </div>
        </div>
      </div>

      <div className="section" style={{ background: '#fff', paddingTop: 36 }}>
        <div className="section-inner">
          {loading ? (
            <div className="grid-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 340 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 48, marginBottom: 16 }}>✂️</div>
              <h3>No barbers found</h3>
              <p>Try adjusting your filters or check back soon as we add more barbers daily.</p>
              <button className="btn-gold" style={{ marginTop: 20 }} onClick={() => { setCity('All Cities'); setSpecialty('All Styles'); setSearch(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(b => <BarberCard key={b.id} barber={b} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Demo data (same as Home.jsx — in production, Firebase returns real data)
const DEMO_BARBERS = [
  { id: '1', name: 'Kofi Mensah', shopName: 'The Gold Chair', city: 'Toronto, ON', bio: 'Specializing in crisp fades and clean lineups for 8+ years.', specialties: ['Fades', 'Lineups', 'Beard Trims'], rating: '4.9', reviewCount: 127, startingPrice: 30, instagramHandle: 'habeshacuts' },
  { id: '2', name: 'Amara Diallo', shopName: 'Amara Cutz', city: 'Mississauga, ON', bio: 'Master of braids, dreads, and textured hair. 10+ years certified.', specialties: ['Braids', 'Dreads', 'Natural Hair'], rating: '5.0', reviewCount: 214, startingPrice: 45, instagramHandle: 'habeshacuts' },
  { id: '3', name: 'Yonas Tesfaye', shopName: 'Prestige Barbershop', city: 'North York, ON', bio: 'From fades to designs — artistry on every cut.', specialties: ['Designs', 'Fades', 'Kids Cuts'], rating: '4.8', reviewCount: 89, startingPrice: 35, instagramHandle: 'habeshacuts' },
  { id: '4', name: 'Marcus Williams', shopName: 'The Grooming Lounge', city: 'Scarborough, ON', bio: 'Clean cuts, sharp lines, top-tier service.', specialties: ['Fades', 'Hot Towel Shave', 'Beard Trims'], rating: '4.9', reviewCount: 156, startingPrice: 40, instagramHandle: 'habeshacuts' },
  { id: '5', name: 'Dawit Solomon', shopName: 'Royal Kutz', city: 'Brampton, ON', bio: 'Award-winning barber, modern & traditional styles.', specialties: ['Afro', 'Fades', 'Lineups'], rating: '5.0', reviewCount: 302, startingPrice: 35, instagramHandle: 'habeshacuts' },
  { id: '6', name: 'Jamal Pierre', shopName: 'JP Barbershop', city: 'Ottawa, ON', bio: 'Catering to Ottawa\'s finest since 2015.', specialties: ['Fades', 'Braids', 'Beard Trims'], rating: '4.7', reviewCount: 78, startingPrice: 28, instagramHandle: 'habeshacuts' },
  { id: '7', name: 'Ahmed Hassan', shopName: 'Precision Cuts', city: 'Toronto, ON', bio: 'Precision barber with a love for clean edges and designs.', specialties: ['Lineups', 'Designs', 'Fades'], rating: '4.9', reviewCount: 201, startingPrice: 32, instagramHandle: 'habeshacuts' },
  { id: '8', name: 'Elijah Brooks', shopName: 'Brooks Barbershop', city: 'Mississauga, ON', bio: 'Family barber. Kids welcome. Saturday walk-ins available.', specialties: ['Kids Cuts', 'Fades', 'Beard Trims'], rating: '4.8', reviewCount: 143, startingPrice: 25, instagramHandle: 'habeshacuts' },
];
