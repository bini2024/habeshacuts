// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const { addToast } = useToast();
  const navigate     = useNavigate();
  const location     = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    addToast('Signed out successfully', 'success');
    navigate('/');
  }

  const dashLink = profile?.role === 'barber' ? '/dashboard' : '/my-bookings';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Habesha<span>Cutz</span>
      </Link>

      <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
        <span /><span /><span />
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/barbers"
          className={`nav-link ${location.pathname === '/barbers' ? 'active' : ''}`}
          onClick={() => setMenuOpen(false)}>
          Browse Barbers
        </Link>

        {!user && (
          <Link to="/join"
            className={`nav-link ${location.pathname === '/join' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}>
            List Your Shop
          </Link>
        )}

        {user ? (
          <>
            <Link to={dashLink} className="nav-link" onClick={() => setMenuOpen(false)}>
              {profile?.role === 'barber' ? 'Dashboard' : 'My Bookings'}
            </Link>
            <button className="btn-outline nav-cta" onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <Link to="/auth" onClick={() => setMenuOpen(false)}>
            <button className="btn-gold nav-cta">Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
