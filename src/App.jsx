// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';
import Toast       from './components/Toast';
import { ToastProvider } from './context/ToastContext';

import Home        from './pages/Home';
import Barbers     from './pages/Barbers';
import BarberProfile from './pages/BarberProfile';
import Auth        from './pages/Auth';
import BarberDash  from './pages/BarberDash';
import ClientDash  from './pages/ClientDash';
import JoinBarber  from './pages/JoinBarber';
import NotFound    from './pages/NotFound';

function PrivateRoute({ children, role }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="loading-full"><span className="spinner dark" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (role && profile?.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/barbers"         element={<Barbers />} />
          <Route path="/barbers/:id"     element={<BarberProfile />} />
          <Route path="/auth"            element={<Auth />} />
          <Route path="/join"            element={<JoinBarber />} />
          <Route path="/dashboard"       element={
            <PrivateRoute role="barber"><BarberDash /></PrivateRoute>
          } />
          <Route path="/my-bookings"     element={
            <PrivateRoute role="client"><ClientDash /></PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </ToastProvider>
  );
}
