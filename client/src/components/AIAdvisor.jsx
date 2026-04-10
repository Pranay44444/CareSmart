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
  wrap: { fontFamily: 'Inter, sans-serif', color: 'var(--color-text-heading)' },
  card: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: 'var(--shadow-subtle)',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: 'var(--color-text-heading)',
  },
  subtitle: { color: 'var(--color-text-body)', fontSize: '0.95rem', marginBottom: '32px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldFull: { display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' },
  label: { color: 'var(--color-text-label)', fontSize: '0.85rem', fontWeight: 600 },
  input: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  textarea: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '100px',
  },
  btn: (loading) => ({
    marginTop: '24px',
    width: '100%',
    color: 'var(--color-bg-card)',
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
    opacity: loading ? 0.7 : 1,
  }),
  spinner: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'var(--color-bg-card)',
    animation: 'spin 0.8s linear infinite',
  },
  resultGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginTop: '32px',
  },
  recCard: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: 'var(--shadow-subtle)',
  },
  recName: { fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  recCat: {
    display: 'inline-flex',
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  riskBox: {
    background: 'var(--color-error-bg)',
    border: '1px solid var(--color-error-border)',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  riskLabel: {
    color: 'var(--color-error)',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  riskText: { color: 'var(--color-text-body)', fontSize: '0.85rem', lineHeight: 1.6 },
  reasonBox: {
    background: 'var(--color-success-bg)',
    border: '1px solid var(--color-success-border)',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  reasonLabel: {
    color: 'var(--color-success)',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  reasonText: { color: 'var(--color-text-body)', fontSize: '0.85rem', lineHeight: 1.6 },
  loginNote: {
    textAlign: 'center',
    color: 'var(--color-text-body)',
    padding: '16px',
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '10px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.9rem',
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={s.card}>
        <div style={s.title}>
          <Bot size={24} color="var(--color-action-primary)" /> AI Advisor
        </div>
        <div style={s.subtitle}>
          Get personalized accessory recommendations tailored to your device and usage.
        </div>

        {!isAuthenticated && (
          <div style={s.loginNote}>
            <Lock size={16} color="var(--color-action-primary)" />{' '}
            <a href="/login" style={{ color: 'var(--color-action-primary)', fontWeight: 600 }}>
              Sign in
            </a>{' '}
            to get identity-based recommendations.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={s.grid}>
            <div style={s.field}>
              <label style={s.label}>Device Type *</label>
              <select
                id="ai-device-type"
                className="input-field"
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
                className="input-field"
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
                className="input-field"
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
                className="input-field"
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
                className="input-field"
                style={s.textarea}
                placeholder="e.g. battery drains fast, screen cracks easily, gets hot during gaming…"
                value={form.issues}
                onChange={set('issues')}
              />
            </div>
          </div>

          <button
            id="ai-submit"
            style={s.btn(loading)}
            className={loading ? '' : 'shimmer-cta'}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={s.spinner} /> Finding recommendations…
              </>
            ) : (
              <>
                <Sparkles size={20} /> Get Recommendations
              </>
            )}
          </button>
        </form>
      </div>

      {submitted && !loading && (
        <>
          {error && (
            <div
              style={{
                background: 'var(--color-error-bg)',
                border: '1px solid var(--color-error-border)',
                color: 'var(--color-error)',
                borderRadius: '10px',
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
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  fontSize: '1.25rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Target size={24} color="var(--color-action-primary)" /> {recs.length} Recommendation
                {recs.length !== 1 ? 's' : ''} for {form.brand} {form.model}
              </div>
              <div style={s.resultGrid}>
                {recs.map((rec, i) => (
                  <div key={i} style={s.recCard} id={`rec-${i}`}>
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
                        <AlertTriangle size={14} /> WHY YOU NEED IT
                      </div>
                      <div style={s.riskText}>{rec.risk}</div>
                    </div>
                    <div style={s.reasonBox}>
                      <div style={s.reasonLabel}>
                        <ShieldCheck size={14} /> HOW IT HELPS
                      </div>
                      <div style={s.reasonText}>{rec.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {recs.length === 0 && !error && (
            <div style={{ color: 'var(--color-text-body)', textAlign: 'center', marginTop: '20px' }}>
              No recommendations returned. Try adjusting your inputs.
            </div>
          )}
        </>
      )}
    </div>
  );
}
