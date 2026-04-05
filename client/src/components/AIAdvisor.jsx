import { useState } from 'react';
import { getAIRecommendations } from '../services/api';
import { useAuth } from '../context/AuthContext';

const deviceTypes = ['Smartphone', 'Laptop', 'Tablet'];
const brandsByType = {
  Smartphone: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Other'],
  Laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Other'],
  Tablet: ['Apple', 'Samsung', 'Microsoft', 'Other'],
};
const usagePatterns = [
  'General Use', 'Heavy Gaming', 'Travel Photography',
  'Remote Work', 'Student Use', 'Creative Work',
];

const s = {
  wrap: { fontFamily: 'Inter, sans-serif', color: '#e2e8f0' },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '32px',
  },
  title: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' },
  label: { color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 },
  input: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.9rem',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  select: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.9rem',
    outline: 'none', width: '100%', boxSizing: 'border-box', cursor: 'pointer',
  },
  textarea: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.9rem',
    outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px',
  },
  btn: (loading) => ({
    marginTop: '20px', width: '100%',
    background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #3b82f6)',
    color: '#fff', border: 'none', borderRadius: '10px', padding: '14px',
    fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  }),
  spinner: {
    width: '18px', height: '18px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
  },
  resultGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '24px' },
  recCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px',
  },
  recName: { fontWeight: 800, fontSize: '1rem', color: '#e2e8f0' },
  recCat: { display: 'inline-block', background: 'rgba(99,179,237,0.12)', color: '#63b3ed', borderRadius: '6px', padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 },
  riskBox: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px' },
  riskLabel: { color: '#f87171', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' },
  riskText: { color: '#fca5a5', fontSize: '0.85rem', lineHeight: 1.5 },
  reasonBox: { background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', padding: '10px 14px' },
  reasonLabel: { color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' },
  reasonText: { color: '#bbf7d0', fontSize: '0.85rem', lineHeight: 1.5 },
  loginNote: { textAlign: 'center', color: '#94a3b8', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginTop: '16px' },
};

export default function AIAdvisor() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ deviceType: '', brand: '', model: '', usagePattern: '', issues: '' });
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setSubmitted(true);
    try {
      const res = await getAIRecommendations({
        deviceType: form.deviceType,
        brand: form.brand,
        model: form.model,
        usagePattern: form.usagePattern,
        issues: form.issues,
      });
      setRecs(res.data.recommendations || []);
      if (res.data.warning) setError(res.data.warning);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations.');
      setRecs([]);
    } finally { setLoading(false); }
  };

  const availableBrands = brandsByType[form.deviceType] || [];

  return (
    <div style={s.wrap}>
      {/* Keyframes injection */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={s.card}>
        <div style={s.title}><span>🤖</span> AI Accessory Advisor</div>
        <div style={s.subtitle}>Tell us about your device and get personalised accessory recommendations.</div>

        {!isAuthenticated && (
          <div style={s.loginNote}>
            🔒 <a href="/login" style={{ color: '#63b3ed', fontWeight: 600 }}>Sign in</a> to get AI recommendations tailored to your profile.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Device Type *</label>
              <select id="ai-device-type" style={s.select} value={form.deviceType}
                onChange={(e) => { set('deviceType')(e); setForm((f) => ({ ...f, deviceType: e.target.value, brand: '' })); }} required>
                <option value="">Select type…</option>
                {deviceTypes.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Brand *</label>
              <select id="ai-brand" style={s.select} value={form.brand} onChange={set('brand')} required>
                <option value="">Select brand…</option>
                {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Model *</label>
              <input id="ai-model" style={s.input} placeholder="e.g. iPhone 15, Galaxy S23"
                value={form.model} onChange={set('model')} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Usage Pattern</label>
              <select id="ai-usage" style={s.select} value={form.usagePattern} onChange={set('usagePattern')}>
                <option value="">Select pattern…</option>
                {usagePatterns.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div style={s.fieldFull}>
              <label style={s.label}>Current Issues / Concerns</label>
              <textarea id="ai-issues" style={s.textarea}
                placeholder="e.g. battery drains fast, screen cracks easily, gets hot during gaming…"
                value={form.issues} onChange={set('issues')} />
            </div>
          </div>

          <button id="ai-submit" style={s.btn(loading)} type="submit" disabled={loading}>
            {loading ? (
              <><div style={s.spinner} /> Analysing your device…</>
            ) : '✨ Get AI Recommendations'}
          </button>
        </form>
      </div>

      {/* Results */}
      {submitted && !loading && (
        <>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', borderRadius: '12px', padding: '14px 18px', marginTop: '16px', fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}
          {recs.length > 0 && (
            <>
              <div style={{ marginTop: '28px', marginBottom: '4px', fontWeight: 700, color: '#cbd5e0', fontSize: '1rem' }}>
                🎯 {recs.length} Recommendation{recs.length !== 1 ? 's' : ''} for your {form.brand} {form.model}
              </div>
              <div style={s.resultGrid}>
                {recs.map((rec, i) => (
                  <div key={i} style={s.recCard} id={`rec-${i}`}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={s.recName}>{rec.name}</div>
                      <span style={s.recCat}>{rec.category}</span>
                    </div>
                    <div style={s.riskBox}>
                      <div style={s.riskLabel}>⚠️ RISK PREVENTED</div>
                      <div style={s.riskText}>{rec.risk}</div>
                    </div>
                    <div style={s.reasonBox}>
                      <div style={s.reasonLabel}>✅ WHY IT HELPS</div>
                      <div style={s.reasonText}>{rec.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {recs.length === 0 && !error && (
            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>No recommendations returned. Try adjusting your inputs.</div>
          )}
        </>
      )}
    </div>
  );
}
