// src/components/Toast.jsx
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { toasts } = useToast();
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} className="toast fade-in">
          <span className={`toast-dot ${t.type}`} />
          {t.message}
        </div>
      ))}
    </div>
  );
}
