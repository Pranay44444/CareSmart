import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import AIAdvisor from '../components/AIAdvisor';
import ProductCard from '../components/ProductCard';

const s = {
  page: {
    minHeight: '100vh', background: '#0f0f1a',
    fontFamily: 'Inter, sans-serif', color: '#e2e8f0',
  },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '48px 24px 40px',
  },
  heroInner: { maxWidth: '900px', margin: '0 auto' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
    border: '1px solid rgba(99,102,241,0.3)', borderRadius: '999px',
    padding: '6px 18px', fontSize: '0.82rem', fontWeight: 700,
    letterSpacing: '0.05em', marginBottom: '20px',
  },
  h1: {
    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15,
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #e2e8f0 30%, #a5b4fc)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: { color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, maxWidth: '600px' },
  // Profile prefill banner
  prefillBanner: {
    marginTop: '20px', padding: '14px 18px',
    background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
    fontSize: '0.9rem', color: '#bbf7d0',
  },
  prefillIcon: { fontSize: '1.3rem' },
  // Login nudge
  loginBanner: {
    marginTop: '20px', padding: '14px 18px',
    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
    fontSize: '0.9rem', color: '#c7d2fe',
  },
  // Main content
  main: { maxWidth: '900px', margin: '0 auto', padding: '40px 24px' },
  // Matched products section
  matchSection: { marginTop: '48px' },
  matchHeader: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '24px', paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  matchTitle: { fontSize: '1.3rem', fontWeight: 800, color: '#e2e8f0' },
  matchBadge: {
    background: 'rgba(99,179,237,0.12)', color: '#63b3ed',
    borderRadius: '999px', padding: '4px 14px',
    fontSize: '0.8rem', fontWeight: 700,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  emptyMatch: {
    textAlign: 'center', color: '#94a3b8', padding: '32px',
    background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
    fontSize: '0.95rem',
  },
  loadingMatch: { textAlign: 'center', color: '#94a3b8', padding: '24px' },
  loginBtn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    color: '#fff', textDecoration: 'none', borderRadius: '8px',
    padding: '8px 20px', fontWeight: 700, fontSize: '0.85rem', marginLeft: '12px',
  },
};

// Map device type → product category for the backend query
const categoryMap = { Smartphone: 'smartphone', Laptop: 'laptop', Tablet: 'smartphone' };

export default function AIAdvisorPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Pull saved device profile from the authenticated user
  const savedProfile = user?.deviceProfile || null;
  const hasSavedProfile = !!(
    savedProfile?.deviceType && savedProfile?.brand && savedProfile?.model
  );

  // Lifted state so we can react to recommendations from outside AIAdvisor
  const [recommendations, setRecommendations] = useState([]);
  const [lastDeviceType, setLastDeviceType] = useState('');
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // When recommendations come from AIAdvisor, fetch matching products
  const handleRecommendations = (recs, deviceType) => {
    setRecommendations(recs);
    setLastDeviceType(deviceType);
  };

  useEffect(() => {
    if (recommendations.length === 0) { setMatchedProducts([]); return; }
    const category = categoryMap[lastDeviceType] || 'smartphone';
    setLoadingProducts(true);
    getProducts({ category, limit: 8 })
      .then((r) => setMatchedProducts(r.data.products || []))
      .catch(() => setMatchedProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [recommendations, lastDeviceType]);

  // Initial form values — pre-fill from saved device profile if available
  const initialForm = hasSavedProfile ? {
    deviceType: savedProfile.deviceType || '',
    brand: savedProfile.brand || '',
    model: savedProfile.model || '',
    usagePattern: savedProfile.usagePattern || '',
    issues: '',
  } : null;

  return (
    <div style={s.page}>
      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>🤖 Powered by Google Gemini</div>
          <h1 style={s.h1}>AI Accessory Advisor</h1>
          <p style={s.subtitle}>
            Tell us about your device and get smart, personalised accessory recommendations
            — matched to your usage habits and real risks.
          </p>

          {isAuthenticated && hasSavedProfile && (
            <div style={s.prefillBanner}>
              <span style={s.prefillIcon}>✅</span>
              <span>
                <strong>Form pre-filled</strong> from your saved device profile
                ({savedProfile.brand} {savedProfile.model}).{' '}
                <a href="/profile" style={{ color: '#4ade80', fontWeight: 600 }}>Update profile →</a>
              </span>
            </div>
          )}

          {!isAuthenticated && (
            <div style={s.loginBanner}>
              <span style={s.prefillIcon}>💡</span>
              <span>
                <strong>Tip:</strong> Save your device profile to auto-fill this form every time.
                <a href="/register" style={s.loginBtn}>Create Account</a>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main — AIAdvisor component ── */}
      <div style={s.main}>
        <AIAdvisor
          initialForm={initialForm}
          onRecommendations={handleRecommendations}
        />

        {/* ── Matched Products ── */}
        {(loadingProducts || matchedProducts.length > 0 || recommendations.length > 0) && (
          <div style={s.matchSection}>
            <div style={s.matchHeader}>
              <div style={s.matchTitle}>🛒 Shop These Accessories</div>
              {matchedProducts.length > 0 && (
                <span style={s.matchBadge}>{matchedProducts.length} products</span>
              )}
            </div>

            {loadingProducts && (
              <div style={s.loadingMatch}>⏳ Finding matching products…</div>
            )}

            {!loadingProducts && matchedProducts.length === 0 && recommendations.length > 0 && (
              <div style={s.emptyMatch}>
                😔 No products found for this category yet.{' '}
                <a href="/products" style={{ color: '#63b3ed', fontWeight: 600 }}>
                  Browse all products →
                </a>
              </div>
            )}

            {!loadingProducts && matchedProducts.length > 0 && (
              <div style={s.productGrid}>
                {matchedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
