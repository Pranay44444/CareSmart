import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateDeviceProfile } from '../services/api';

import { UserCircle, Smartphone, LogOut, CheckCircle2 } from 'lucide-react';

const deviceTypes = ['Smartphone', 'Laptop', 'Tablet'];
const brands = {
  Smartphone: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Other'],
  Laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Other'],
  Tablet: ['Apple', 'Samsung', 'Microsoft', 'Other'],
};
const usagePatterns = [
  'General Use',
  'Heavy Gaming',
  'Travel Photography',
  'Remote Work',
  'Student Use',
  'Creative Work',
];

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-dark)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-cream)',
    padding: '64px 24px',
  },
  wrap: { maxWidth: '700px', margin: '0 auto' },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--text-cream)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: { color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.05rem' },
  card: { padding: '32px', marginBottom: '24px' },
  cardTitle: {
    fontWeight: 600,
    fontSize: '1.25rem',
    marginBottom: '24px',
    color: 'var(--text-cream)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'Playfair Display, serif',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid var(--glass-border)',
    fontSize: '0.95rem',
  },
  key: { color: 'var(--text-muted)' },
  val: { fontWeight: 500, color: 'var(--text-cream)' },
  roleBadge: {
    background: 'rgba(201,168,76,0.1)',
    color: 'var(--gold-primary)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
  label: {
    display: 'block',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '8px',
    fontWeight: 500,
  },
  select: {
    width: '100%',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '14px 16px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '14px 16px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '20px',
    transition: 'border-color 0.2s',
  },
  btn: {
    border: 'none',
    borderRadius: '10px',
    padding: '14px 28px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  success: {
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid var(--gold-primary)',
    color: 'var(--gold-highlight)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '24px',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'rgba(239,68,68,0.1)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '10px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [device, setDevice] = useState({
    deviceType: user?.deviceProfile?.deviceType || '',
    brand: user?.deviceProfile?.brand || '',
    model: user?.deviceProfile?.model || '',
    usagePattern: user?.deviceProfile?.usagePattern || '',
  });
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await updateDeviceProfile(device);
      setMsg('Profile accurately synchronized.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const availableBrands = brands[device.deviceType] || [];

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title} className="font-playfair">
          <UserCircle size={32} color="var(--gold-primary)" /> My Profile
        </div>
        <div style={s.subtitle}>Manage your account and hardware preferences.</div>

        {/* Account Info */}
        <div style={s.card} className="glass-panel skeuo-shadow">
          <div style={s.cardTitle}>
            <UserCircle size={20} color="var(--gold-primary)" /> Account Identity
          </div>
          <div style={s.infoRow}>
            <span style={s.key}>Name</span>
            <span style={s.val}>{user?.name}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.key}>Email</span>
            <span style={s.val}>{user?.email}</span>
          </div>
          <div style={{ ...s.infoRow, border: 'none' }}>
            <span style={s.key}>Role</span>
            <span style={s.roleBadge}>{user?.role?.toUpperCase()}</span>
          </div>
        </div>

        {/* Device Profile */}
        <div style={s.card} className="glass-panel skeuo-shadow">
          <div style={s.cardTitle}>
            <Smartphone size={20} color="var(--gold-primary)" /> Hardware Signature
          </div>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}
          >
            This helps our AI advisor curate the exact structural and aesthetic accessories for your
            device fleet.
          </div>
          {msg && <div style={s.success}>{msg}</div>}
          <form onSubmit={handleSave}>
            <label style={s.label}>Hardware Classification</label>
            <select
              id="device-type"
              style={s.select}
              value={device.deviceType}
              onChange={(e) => setDevice((f) => ({ ...f, deviceType: e.target.value, brand: '' }))}
            >
              <option value="">Select classification…</option>
              {deviceTypes.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <label style={s.label}>Manufacturer</label>
            <select
              id="device-brand"
              style={s.select}
              value={device.brand}
              onChange={(e) => setDevice((f) => ({ ...f, brand: e.target.value }))}
            >
              <option value="">Select manufacturer…</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <label style={s.label}>Exact Model ID</label>
            <input
              id="device-model"
              style={s.input}
              placeholder="e.g. iPhone 15 Pro Max, Galaxy S24 Ultra"
              value={device.model}
              onChange={(e) => setDevice((f) => ({ ...f, model: e.target.value }))}
            />
            <label style={s.label}>Primary Use Case</label>
            <select
              id="usage-pattern"
              style={s.select}
              value={device.usagePattern}
              onChange={(e) => setDevice((f) => ({ ...f, usagePattern: e.target.value }))}
            >
              <option value="">Select use case…</option>
              {usagePatterns.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <button id="save-profile" style={s.btn} className="shimmer-cta" type="submit">
              <CheckCircle2 size={18} /> Synchronize Profile
            </button>
          </form>
        </div>

        <button id="logout-btn" style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Terminate Session
        </button>
      </div>
    </div>
  );
}
