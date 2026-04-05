import { useState } from 'react';
import { summarizeReviews as summarizeReviewsAPI } from '../services/api';

const s = {
  wrap: { fontFamily: 'Inter, sans-serif' },
  btn: (loading) => ({
    background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #3b82f6)',
    color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px',
    fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s',
  }),
  spinner: {
    width: '14px', height: '14px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite', flexShrink: 0,
  },
  summaryBox: {
    marginTop: '16px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.08))',
    border: '1px solid rgba(99,179,237,0.25)',
    borderRadius: '14px', padding: '20px 24px',
    color: '#cbd5e0', lineHeight: 1.75, fontSize: '0.95rem',
  },
  label: {
    display: 'flex', alignItems: 'center', gap: '8px',
    color: '#63b3ed', fontWeight: 700, fontSize: '0.8rem',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px',
  },
  empty: { color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '12px' },
};

export default function ReviewSummary({ reviews = [] }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (reviews.length === 0) { setSummary('No reviews yet.'); return; }
    setLoading(true); setError(''); setSummary('');
    try {
      const res = await summarizeReviewsAPI(
        reviews.map((r) => ({ rating: r.rating, comment: r.comment }))
      );
      setSummary(res.data.summary || 'No summary available.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.wrap} id="review-summary-widget">
      {/* Inject keyframes once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <button
        id="summarize-btn"
        style={s.btn(loading)}
        onClick={handleSummarize}
        disabled={loading || reviews.length === 0}
        title={reviews.length === 0 ? 'No reviews to summarize' : 'Generate AI summary'}
      >
        {loading
          ? <><div style={s.spinner} /> Summarizing…</>
          : <><span>🤖</span> AI Summary</>
        }
      </button>

      {reviews.length === 0 && !summary && (
        <div style={s.empty}>No reviews available to summarize.</div>
      )}

      {error && (
        <div style={{ ...s.summaryBox, background: 'rgba(239,68,68,0.07)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5', marginTop: '12px' }}>
          ⚠️ {error}
        </div>
      )}

      {summary && !error && (
        <div style={s.summaryBox} id="ai-summary-result">
          <div style={s.label}>
            <span>🤖</span> AI-Generated Summary
          </div>
          {summary}
        </div>
      )}
    </div>
  );
}
