import { useState } from 'react';
import { summarizeReviews as summarizeReviewsAPI } from '../services/api';

const s = {
  wrap: { fontFamily: 'Inter, sans-serif' },
  btn: (loading) => ({
    background: loading ? 'var(--color-action-disabled)' : 'var(--color-action-primary)',
    color: 'var(--color-bg-card)',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
  }),
  spinner: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'var(--color-bg-card)',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
  summaryBox: {
    marginTop: '16px',
    background: 'var(--color-action-tint-bg)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '12px',
    padding: '20px 24px',
    color: 'var(--color-text-heading)',
    lineHeight: 1.75,
    fontSize: '0.95rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--color-action-primary)',
    fontWeight: 700,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '10px',
  },
  empty: { color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '12px' },
};

export default function ReviewSummary({ reviews = [] }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (reviews.length === 0) {
      setSummary('No reviews yet.');
      return;
    }
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const res = await summarizeReviewsAPI(
        reviews.map((r) => ({ rating: r.rating, comment: r.comment }))
      );
      setSummary(res.data.summary || 'No summary available.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap} id="review-summary-widget">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <button
        id="summarize-btn"
        className="shimmer-cta"
        style={s.btn(loading)}
        onClick={handleSummarize}
        disabled={loading || reviews.length === 0}
        title={reviews.length === 0 ? 'No reviews to summarize' : 'Generate AI summary'}
      >
        {loading ? (
          <>
            <div style={s.spinner} /> Summarizing…
          </>
        ) : (
          <>
            <span>🤖</span> AI Summary
          </>
        )}
      </button>

      {reviews.length === 0 && !summary && (
        <div style={s.empty}>No reviews available to summarize.</div>
      )}

      {error && (
        <div
          style={{
            ...s.summaryBox,
            background: 'var(--color-error-bg)',
            borderColor: 'var(--color-error-border)',
            color: 'var(--color-error)',
            marginTop: '12px',
          }}
        >
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
