// src/pages/BarberDash.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

const SIDEBAR_ITEMS = [
  { key: 'overview',  icon: '⬡', label: 'Overview' },
  { key: 'profile',   icon: '✎', label: 'My Profile' },
  { key: 'services',  icon: '✂', label: 'Services' },
  { key: 'settings',  icon: '⚙', label: 'Settings' },
];

export default function BarberDash() {
  const { user, profile } = useAuth();
  const { addToast } = useToast();
  const [tab, setTab]       = useState('overview');
  const [barber, setBarber] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    shopName: '', city: '', bio: '', instagramHandle: '',
    calendlyUrl: '', startingPrice: '', specialties: '',
    phone: '', address: '',
  });
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'barbers', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setBarber(data);
          setForm({
            shopName:        data.shopName || '',
            city:            data.city || '',
            bio:             data.bio || '',
            instagramHandle: data.instagramHandle || '',
            calendlyUrl:     data.calendlyUrl || '',
            startingPrice:   data.startingPrice || '',
            specialties:     (data.specialties || []).join(', '),
            phone:           data.phone || '',
            address:         data.address || '',
          });
          if (data.services?.length) setServices(data.services);
        }
      } catch (e) { /* Firebase not configured */ }
    }
    load();
  }, [user]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function saveProfile() {
    setSaving(true);
    try {
      const data = {
        ...form,
        uid: user.uid,
        name: profile?.name || user.displayName,
        email: user.email,
        specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
        startingPrice: Number(form.startingPrice) || 0,
        services,
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, 'barbers', user.uid), data, { merge: true });
      setBarber(data);
      addToast('Profile saved!', 'success');
    } catch (e) {
      addToast('Saved locally (Firebase not configured)', 'success');
      setBarber({ ...form });
    }
    setSaving(false);
  }

  function addService() {
    setServices(s => [...s, { name: '', price: 0, duration: 30 }]);
  }
  function updateService(i, k, v) {
    setServices(s => s.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  }
  function removeService(i) {
    setServices(s => s.filter((_, idx) => idx !== i));
  }

  const initials = (profile?.name || 'B').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <div className="dash-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-name">{profile?.name || 'Barber'}</div>
          <div className="sidebar-role">Barber Profile</div>
        </div>
        {SIDEBAR_ITEMS.map(item => (
          <button
            key={item.key}
            className={`sidebar-item ${tab === item.key ? 'active' : ''}`}
            onClick={() => setTab(item.key)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="dash-main">

        {tab === 'overview' && (
          <div className="fade-in">
            <div className="dash-title">Welcome back, {profile?.name?.split(' ')[0] || 'Barber'} ✦</div>
            <p className="dash-sub">Here's your profile status at a glance.</p>

            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-label">Profile Status</div>
                <div className="stat-num" style={{ fontSize: 18, fontWeight: 700 }}>
                  {barber?.calendlyUrl ? <span style={{ color: 'var(--green)' }}>✓ Live</span> : <span style={{ color: '#f59e0b' }}>Incomplete</span>}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Calendly</div>
                <div className="stat-num" style={{ fontSize: 18, fontWeight: 700 }}>
                  {barber?.calendlyUrl ? <span style={{ color: 'var(--green)' }}>Connected</span> : <span style={{ color: 'var(--red)' }}>Not Set</span>}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Instagram</div>
                <div className="stat-num" style={{ fontSize: 18, fontWeight: 700 }}>
                  {barber?.instagramHandle ? <span style={{ color: 'var(--green)' }}>@{barber.instagramHandle}</span> : <span style={{ color: 'var(--red)' }}>Not Set</span>}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Services</div>
                <div className="stat-num">{services.length}</div>
              </div>
            </div>

            {/* Setup checklist */}
            <div className="setup-checklist">
              <h3>Setup Checklist</h3>
              {[
                { done: !!barber?.bio,             label: 'Write a bio',             action: () => setTab('profile') },
                { done: !!barber?.instagramHandle, label: 'Add Instagram handle',    action: () => setTab('profile') },
                { done: !!barber?.calendlyUrl,     label: 'Connect Calendly URL',    action: () => setTab('profile') },
                { done: services.length > 0,       label: 'Add at least one service', action: () => setTab('services') },
                { done: !!barber?.city,            label: 'Set your city',           action: () => setTab('profile') },
              ].map((item, i) => (
                <div key={i} className={`checklist-item ${item.done ? 'done' : ''}`} onClick={!item.done ? item.action : undefined}>
                  <span className="check-icon">{item.done ? '✓' : '○'}</span>
                  <span>{item.label}</span>
                  {!item.done && <span className="check-cta">Set up →</span>}
                </div>
              ))}
            </div>

            {/* Calendly guide */}
            <div className="info-banner">
              <div className="info-banner-icon">📅</div>
              <div>
                <strong>How to get your Calendly link</strong>
                <p>Log in at <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">calendly.com</a>, create a new event type for your haircut service, then copy your booking page URL (e.g. <code>https://calendly.com/yourname/haircut</code>) and paste it in your profile.</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div className="fade-in">
            <div className="dash-title">My Profile</div>
            <p className="dash-sub">This information is displayed publicly to clients.</p>

            <div className="form-card">
              <h3>Basic Info</h3>
              <div className="row2">
                <div className="field">
                  <label>Shop / Studio Name</label>
                  <input placeholder="e.g. The Gold Chair" value={form.shopName} onChange={e => set('shopName', e.target.value)} />
                </div>
                <div className="field">
                  <label>City</label>
                  <input placeholder="e.g. Toronto, ON" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Bio (shown on your profile page)</label>
                <textarea placeholder="Tell clients about your style, experience, and what makes you stand out..." value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} />
              </div>
              <div className="row2">
                <div className="field">
                  <label>Starting Price ($)</label>
                  <input type="number" placeholder="30" value={form.startingPrice} onChange={e => set('startingPrice', e.target.value)} />
                </div>
                <div className="field">
                  <label>Phone (optional)</label>
                  <input placeholder="+1 416..." value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label>Specialties (comma-separated)</label>
                <input placeholder="Fades, Lineups, Beard Trims" value={form.specialties} onChange={e => set('specialties', e.target.value)} />
              </div>
            </div>

            <div className="form-card">
              <h3>Booking & Portfolio Links</h3>
              <div className="field">
                <label>📅 Calendly Booking URL</label>
                <input
                  placeholder="https://calendly.com/yourname/haircut"
                  value={form.calendlyUrl}
                  onChange={e => set('calendlyUrl', e.target.value)}
                />
                <div className="field-hint">
                  Clients will book directly through this link on your profile page.
                  <a href="https://calendly.com" target="_blank" rel="noopener noreferrer"> Get your link →</a>
                </div>
              </div>
              <div className="field">
                <label>📸 Instagram Handle</label>
                <input
                  placeholder="yourhandle (without @)"
                  value={form.instagramHandle}
                  onChange={e => set('instagramHandle', e.target.value.replace('@',''))}
                />
                <div className="field-hint">Clients tap this to view your portfolio. Make sure your account is public.</div>
              </div>
              {form.instagramHandle && (
                <a
                  href={`https://instagram.com/${form.instagramHandle}`}
                  target="_blank" rel="noopener noreferrer"
                  className="preview-link"
                >
                  Preview Instagram: @{form.instagramHandle} →
                </a>
              )}
            </div>

            <button className="btn-gold" style={{ padding: '14px 36px', borderRadius: 12, fontSize: 15 }} onClick={saveProfile} disabled={saving}>
              {saving && <span className="spinner" />}
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        )}

        {tab === 'services' && (
          <div className="fade-in">
            <div className="dash-title">Services</div>
            <p className="dash-sub">List the services you offer. These appear on your public profile.</p>

            <div className="form-card">
              <h3>Your Services</h3>
              {services.map((s, i) => (
                <div key={i} className="service-row">
                  <div className="field" style={{ flex: 2 }}>
                    {i === 0 && <label>Service Name</label>}
                    <input placeholder="e.g. Fade + Lineup" value={s.name} onChange={e => updateService(i, 'name', e.target.value)} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    {i === 0 && <label>Price ($)</label>}
                    <input type="number" placeholder="30" value={s.price} onChange={e => updateService(i, 'price', Number(e.target.value))} />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    {i === 0 && <label>Duration (min)</label>}
                    <input type="number" placeholder="45" value={s.duration} onChange={e => updateService(i, 'duration', Number(e.target.value))} />
                  </div>
                  <button className="remove-btn" onClick={() => removeService(i)}>✕</button>
                </div>
              ))}
              <button className="btn-outline" onClick={addService} style={{ marginTop: 8 }}>+ Add Service</button>
            </div>

            <button className="btn-gold" style={{ padding: '14px 36px', borderRadius: 12, fontSize: 15 }} onClick={saveProfile} disabled={saving}>
              {saving && <span className="spinner" />}
              {saving ? 'Saving…' : 'Save Services'}
            </button>
          </div>
        )}

        {tab === 'settings' && (
          <div className="fade-in">
            <div className="dash-title">Settings</div>
            <p className="dash-sub">Manage your account preferences.</p>
            <div className="form-card">
              <h3>Account</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>Email: <strong>{user?.email}</strong></p>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Role: <strong>Barber</strong></p>
            </div>
            <div className="info-banner" style={{ background: '#fff8e1', borderColor: '#f5e9b8' }}>
              <div className="info-banner-icon">ℹ️</div>
              <div>
                <strong>Payment integration</strong>
                <p>Payment processing (Stripe) will be available in the next version. For now, handle payments in-person.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
