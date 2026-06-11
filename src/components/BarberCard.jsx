// src/components/BarberCard.jsx
import { useNavigate } from 'react-router-dom';
import './BarberCard.css';

export default function BarberCard({ barber }) {
  const navigate = useNavigate();
  const initials = barber.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';

  return (
    <div className="bcard card" onClick={() => navigate(`/barbers/${barber.id}`)}>
      <div className="bcard-top">
        <div className="bcard-avatar">{initials}</div>
        <div>
          <div className="bcard-name">{barber.name}</div>
          <div className="bcard-shop">{barber.shopName || 'Independent'}</div>
          {barber.specialties?.length > 0 && (
            <div className="bcard-spec">{barber.specialties[0]}</div>
          )}
        </div>
      </div>
      <div className="bcard-body">
        <div className="bcard-loc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {barber.city || 'Toronto, ON'}
        </div>

        {barber.bio && <p className="bcard-bio">{barber.bio}</p>}

        <div className="bcard-tags">
          {barber.specialties?.slice(0,3).map(s => (
            <span key={s} className="tag">{s}</span>
          ))}
        </div>

        <div className="bcard-footer">
          <div className="rating">
            <span className="stars">★★★★★</span>
            <span>{barber.rating || '5.0'}</span>
            <span className="muted" style={{fontWeight:400}}>({barber.reviewCount || 0})</span>
          </div>
          {barber.startingPrice && (
            <span className="price-badge">From ${barber.startingPrice}</span>
          )}
        </div>

        <div className="bcard-actions">
          {barber.instagramHandle && (
            <a
              href={`https://instagram.com/${barber.instagramHandle.replace('@','')}`}
              target="_blank" rel="noopener noreferrer"
              className="ig-btn"
              onClick={e => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Portfolio
            </a>
          )}
          <button className="book-btn">Book Now →</button>
        </div>
      </div>
    </div>
  );
}
