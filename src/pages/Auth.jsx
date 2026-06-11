// src/pages/Auth.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate     = useNavigate();

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirmPassword) {
      addToast('Passwords do not match', 'error'); return;
    }
    if (form.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error'); return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        addToast('Welcome back!', 'success');
        // redirect based on role stored in profile
        navigate('/');
      } else {
        await register(form.email, form.password, form.name, role);
        addToast('Account created! Welcome to HabeshaCutz.', 'success');
        navigate(role === 'barber' ? '/dashboard' : '/barbers');
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'   ? 'No account found with this email.'
                : err.code === 'auth/wrong-password'   ? 'Incorrect password.'
                : err.code === 'auth/email-already-in-use' ? 'Email already in use.'
                : err.code === 'auth/invalid-email'    ? 'Invalid email address.'
                : 'Something went wrong. Please try again.';
      addToast(msg, 'error');
    }
    setLoading(false);
  }

  return (
    <div className="auth-bg">
      <div className="auth-box">
        <div className="auth-logo">Habesha<span>Cutz</span></div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Sign in to manage your bookings or barber profile.'
            : 'Join HabeshaCutz to book elite barbers or grow your client base.'}
        </p>

        {/* Mode tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
          <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Register</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              {/* Role selector */}
              <div className="role-select">
                <button
                  type="button"
                  className={`role-btn ${role === 'client' ? 'active' : ''}`}
                  onClick={() => setRole('client')}
                >
                  <span className="role-icon">💈</span>
                  <span className="role-label">I'm a Client</span>
                  <span className="role-desc">Book barbers</span>
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'barber' ? 'active' : ''}`}
                  onClick={() => setRole('barber')}
                >
                  <span className="role-icon">✂️</span>
                  <span className="role-label">I'm a Barber</span>
                  <span className="role-desc">List my services</span>
                </button>
              </div>

              <div className="field">
                <label>Full Name</label>
                <input required placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            </>
          )}

          <div className="field">
            <label>Email</label>
            <input type="email" required placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" required placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>

          {mode === 'register' && (
            <div className="field">
              <label>Confirm Password</label>
              <input type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>

        {mode === 'register' && role === 'barber' && (
          <div className="auth-note">
            <strong>For barbers:</strong> After registering, you'll set up your profile, add your Instagram handle, and paste your Calendly link from your dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
