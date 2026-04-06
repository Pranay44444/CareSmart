import { useState } from 'react';
import { getAIRecommendations } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Lock, Sparkles, AlertTriangle, ShieldCheck, Target, Bot } from 'lucide-react';

const deviceTypes = ['Smartphone', 'Laptop', 'Tablet'];
const brandsByType = {
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
  wrap: { fontFamily: 'Inter, sans-serif', color: 'var(--text-cream)' },
  card: { padding: '32px' },
  title: {
    fontSize: '1.6rem',
    fontWeight: 600,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Playfair Display, serif',
    color: 'var(--text-cream)',
  },
  subtitle: { color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' },
  label: { color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 },
  input: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  select: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  textarea: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.2s',
  },
  btn: (loading) => ({
    marginTop: '24px',
    width: '100%',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '16px',
    fontSize: '1.05rem',
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  }),
  spinner: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  recCard: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  recName: { fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-cream)' },
  recCat: {
    display: 'inline-flex',
    background: 'rgba(201,168,76,0.1)',
    color: 'var(--gold-highlight)',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  riskBox: {
    background: 'rgba(239,68,68,0.05)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  riskLabel: {
    color: '#fca5a5',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  riskText: { color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 },
  reasonBox: {
    background: 'rgba(201,168,76,0.05)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  reasonLabel: {
    color: 'var(--gold-highlight)',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  reasonText: { color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 },
  loginNote: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

export default function AIAdvisor() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    deviceType: '',
    brand: '',
    model: '',
    usagePattern: '',
    issues: '',
  });
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSubmitted(true);
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
    } finally {
      setLoading(false);
    }
  };

  const availableBrands = brandsByType[form.deviceType] || [];

  return (
    <div style={s.wrap}>
      {/* Keyframes injection */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={s.card} className="glass-panel skeuo-shadow">
        <div style={s.title}>
          <Bot size={24} color="var(--gold-primary)" /> Advisor Diagnostics
        </div>
        <div style={s.subtitle}>
          Synthesize personalized protective arrays tailored to your hardware parameters.
        </div>

        {!isAuthenticated && (
          <div style={s.loginNote}>
            <Lock size={16} color="var(--gold-primary)" />{' '}
            <a href="/login" style={{ color: 'var(--gold-highlight)', fontWeight: 600 }}>
              Authenticate
            </a>{' '}
            to unlock identity-based recommendations.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Device Type *</label>
              <select
                id="ai-device-type"
                style={s.select}
                value={form.deviceType}
                onChange={(e) => {
                  set('deviceType')(e);
                  setForm((f) => ({ ...f, deviceType: e.target.value, brand: '' }));
                }}
                required
              >
                <option value="">Select type…</option>
                {deviceTypes.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Brand *</label>
              <select
                id="ai-brand"
                style={s.select}
                value={form.brand}
                onChange={set('brand')}
                required
              >
                <option value="">Select brand…</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Model *</label>
              <input
                id="ai-model"
                style={s.input}
                placeholder="e.g. iPhone 15, Galaxy S23"
                value={form.model}
                onChange={set('model')}
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Usage Pattern</label>
              <select
                id="ai-usage"
                style={s.select}
                value={form.usagePattern}
                onChange={set('usagePattern')}
              >
                <option value="">Select pattern…</option>
                {usagePatterns.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div style={s.fieldFull}>
              <label style={s.label}>Current Issues / Concerns</label>
              <textarea
                id="ai-issues"
                style={s.textarea}
                placeholder="e.g. battery drains fast, screen cracks easily, gets hot during gaming…"
                value={form.issues}
                onChange={set('issues')}
              />
            </div>
          </div>

          <button
            id="ai-submit"
            style={{ ...s.btn(loading), background: loading ? 'rgba(201,168,76,0.3)' : undefined }}
            className={loading ? '' : 'shimmer-cta'}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={s.spinner} /> Synthesizing data points…
              </>
            ) : (
              <>
                <Sparkles size={20} /> Calculate Optimal Arrays
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {submitted && !loading && (
        <>
          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#fca5a5',
                borderRadius: '12px',
                padding: '14px 18px',
                marginTop: '16px',
                fontSize: '0.9rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}
          {recs.length > 0 && (
            <>
              <div
                style={{
                  marginTop: '40px',
                  marginBottom: '8px',
                  fontWeight: 600,
                  color: 'var(--text-cream)',
                  fontSize: '1.25rem',
                  fontFamily: 'Playfair Display, serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Target size={24} color="var(--gold-primary)" /> {recs.length} Precision Alignment
                {recs.length !== 1 ? 's' : ''} for {form.brand} {form.model}
              </div>
              <div style={s.resultGrid}>
                {recs.map((rec, i) => (
                  <div
                    key={i}
                    style={s.recCard}
                    id={`rec-${i}`}
                    className="glass-panel skeuo-shadow"
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={s.recName}>{rec.name}</div>
                      <span style={s.recCat}>{rec.category}</span>
                    </div>
                    <div style={s.riskBox}>
                      <div style={s.riskLabel}>
                        <AlertTriangle size={14} /> DETECTED VULNERABILITY
                      </div>
                      <div style={s.riskText}>{rec.risk}</div>
                    </div>
                    <div style={s.reasonBox}>
                      <div style={s.reasonLabel}>
                        <ShieldCheck size={14} /> PROTECTIVE SYNERGY
                      </div>
                      <div style={s.reasonText}>{rec.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {recs.length === 0 && !error && (
            <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '20px' }}>
              No recommendations returned. Try adjusting your inputs.
            </div>
          )}
        </>
      )}
    </div>
  );
}
