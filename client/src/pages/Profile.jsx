import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateDeviceProfile } from '../services/api';

const deviceTypes = ['Smartphone', 'Laptop', 'Tablet'];
const brands = { Smartphone: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Other'], Laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Other'], Tablet: ['Apple', 'Samsung', 'Microsoft', 'Other'] };
const usagePatterns = ['General Use', 'Heavy Gaming', 'Travel Photography', 'Remote Work', 'Student Use', 'Creative Work'];

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', padding: '32px 24px' },
  wrap: { maxWidth: '700px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#94a3b8', marginBottom: '36px' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '24px' },
  cardTitle: { fontWeight: 700, fontSize: '1rem', marginBottom: '20px', color: '#cbd5e0', display: 'flex', alignItems: 'center', gap: '8px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.9rem' },
  key: { color: '#94a3b8' },
  val: { fontWeight: 600 },
  roleBadge: { background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.8rem', fontWeight: 700 },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' },
  select: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', marginBottom: '16px', cursor: 'pointer' },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', marginBottom: '16px' },
  btn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer' },
  success: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.9rem' },
  logoutBtn: { background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '8px' },
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
      setMsg('✅ Device profile saved!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to save.');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const availableBrands = brands[device.deviceType] || [];

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title}>👤 My Profile</div>
        <div style={s.subtitle}>Manage your account and device preferences.</div>

        {/* Account Info */}
        <div style={s.card}>
          <div style={s.cardTitle}>🧑 Account Information</div>
          <div style={s.infoRow}><span style={s.key}>Name</span><span style={s.val}>{user?.name}</span></div>
          <div style={s.infoRow}><span style={s.key}>Email</span><span style={s.val}>{user?.email}</span></div>
          <div style={{ ...s.infoRow, border: 'none' }}>
            <span style={s.key}>Role</span>
            <span style={s.roleBadge}>{user?.role?.toUpperCase()}</span>
          </div>
        </div>

        {/* Device Profile */}
        <div style={s.card}>
          <div style={s.cardTitle}>📱 Device Profile</div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
            This helps our AI recommend the best accessories for your device.
          </div>
          {msg && <div style={s.success}>{msg}</div>}
          <form onSubmit={handleSave}>
            <label style={s.label}>Device Type</label>
            <select id="device-type" style={s.select} value={device.deviceType}
              onChange={(e) => setDevice((f) => ({ ...f, deviceType: e.target.value, brand: '' }))}>
              <option value="">Select type…</option>
              {deviceTypes.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <label style={s.label}>Brand</label>
            <select id="device-brand" style={s.select} value={device.brand}
              onChange={(e) => setDevice((f) => ({ ...f, brand: e.target.value }))}>
              <option value="">Select brand…</option>
              {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <label style={s.label}>Model</label>
            <input id="device-model" style={s.input} placeholder="e.g. iPhone 15, Galaxy S23" value={device.model}
              onChange={(e) => setDevice((f) => ({ ...f, model: e.target.value }))} />
            <label style={s.label}>Usage Pattern</label>
            <select id="usage-pattern" style={s.select} value={device.usagePattern}
              onChange={(e) => setDevice((f) => ({ ...f, usagePattern: e.target.value }))}>
              <option value="">Select pattern…</option>
              {usagePatterns.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <button id="save-profile" style={s.btn} type="submit">Save Device Profile</button>
          </form>
        </div>

        <button id="logout-btn" style={s.logoutBtn} onClick={handleLogout}>🚪 Sign Out</button>
      </div>
    </div>
  );
}
