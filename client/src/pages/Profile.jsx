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
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
    padding: '48px 24px',
  },
  wrap: { maxWidth: '660px', margin: '0 auto' },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '6px',
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  subtitle: { color: 'var(--color-text-body)', marginBottom: '32px', fontSize: '0.95rem' },
  card: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '20px',
    boxShadow: 'var(--shadow-subtle)',
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    marginBottom: '20px',
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--color-border-subtle)',
    fontSize: '0.9rem',
  },
  key: { color: 'var(--color-text-body)' },
  val: { fontWeight: 500, color: 'var(--color-text-heading)' },
  roleBadge: {
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  label: { display: 'block', color: 'var(--color-text-label)', fontSize: '0.875rem', marginBottom: '6px', fontWeight: 500 },
  select: {
    width: '100%',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '11px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '18px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '11px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '18px',
  },
  btn: {
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  success: {
    background: 'var(--color-success-bg)',
    border: '1px solid var(--color-success-border)',
    color: 'var(--color-success)',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '20px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  logoutBtn: {
    background: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error-border)',
    borderRadius: '8px',
    padding: '11px 20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 500,
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
        <div style={s.title}>
          <UserCircle size={28} color="var(--color-action-primary)" /> My Profile
        </div>
        <div style={s.subtitle}>Manage your account and hardware preferences.</div>

        {/* Account Info */}
        <div style={s.card}>
          <div style={s.cardTitle}>
            <UserCircle size={18} color="var(--color-action-primary)" /> Account Info
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
        <div style={s.card}>
          <div style={s.cardTitle}>
            <Smartphone size={18} color="var(--color-action-primary)" /> Device Profile
          </div>
          <div
            style={{
              color: 'var(--color-text-body)',
              fontSize: '0.875rem',
              marginBottom: '20px',
              lineHeight: 1.6,
            }}
          >
            This helps our AI advisor recommend the right accessories for your device.
          </div>
          {msg && <div style={s.success}>{msg}</div>}
          <form onSubmit={handleSave}>
            <label style={s.label}>Device Type</label>
            <select
              id="device-type"
              className="input-field"
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
            <label style={s.label}>Brand</label>
            <select
              id="device-brand"
              className="input-field"
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
            <label style={s.label}>Device Model</label>
            <input
              id="device-model"
              className="input-field"
              style={s.input}
              placeholder="e.g. iPhone 15 Pro Max, Galaxy S24 Ultra"
              value={device.model}
              onChange={(e) => setDevice((f) => ({ ...f, model: e.target.value }))}
            />
            <label style={s.label}>Usage Pattern</label>
            <select
              id="usage-pattern"
              className="input-field"
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
              <CheckCircle2 size={17} /> Save Profile
            </button>
          </form>
        </div>

        <button id="logout-btn" className="btn-danger" style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}
