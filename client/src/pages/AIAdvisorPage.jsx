import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import AIAdvisor from '../components/AIAdvisor';
import ProductCard from '../components/ProductCard';

import { Bot, Fingerprint, Lock, Search, Package } from 'lucide-react';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
  },
  hero: {
    background: 'linear-gradient(160deg, var(--color-bg-surface) 0%, var(--color-bg-base) 60%)',
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '64px 24px 48px',
  },
  heroInner: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '999px',
    padding: '8px 20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    marginBottom: '24px',
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: '20px',
    color: 'var(--color-text-heading)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  subtitle: {
    color: 'var(--color-text-body)',
    fontSize: '1.1rem',
    lineHeight: 1.7,
    maxWidth: '640px',
    margin: '0 auto',
  },
  prefillBanner: {
    marginTop: '32px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'center',
    fontSize: '0.95rem',
    color: 'var(--color-text-heading)',
    width: 'fit-content',
    margin: '32px auto 0',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-subtle)',
  },
  loginBanner: {
    marginTop: '32px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'center',
    fontSize: '0.95rem',
    color: 'var(--color-text-heading)',
    width: 'fit-content',
    margin: '32px auto 0',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-subtle)',
  },
  main: { maxWidth: '900px', margin: '0 auto', padding: '64px 24px' },
  matchSection: { marginTop: '64px' },
  matchHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  matchTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  matchBadge: {
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '999px',
    padding: '5px 14px',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  emptyMatch: {
    textAlign: 'center',
    color: 'var(--color-text-body)',
    padding: '48px',
    fontSize: '1.05rem',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
  },
  loadingMatch: { textAlign: 'center', color: 'var(--color-action-primary)', padding: '24px' },
  loginBtn: {
    display: 'inline-block',
    textDecoration: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontWeight: 600,
    fontSize: '0.9rem',
    marginLeft: '16px',
  },
};

const categoryMap = { Smartphone: 'smartphone', Laptop: 'laptop', Tablet: 'smartphone' };

export default function AIAdvisorPage() {
  const { user, isAuthenticated } = useAuth();

  const savedProfile = user?.deviceProfile || null;
  const hasSavedProfile = !!(
    savedProfile?.deviceType &&
    savedProfile?.brand &&
    savedProfile?.model
  );

  const [recommendations, setRecommendations] = useState([]);
  const [lastDeviceType, setLastDeviceType] = useState('');
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleRecommendations = (recs, deviceType) => {
    setRecommendations(recs);
    setLastDeviceType(deviceType);
  };

  useEffect(() => {
    if (recommendations.length === 0) {
      setMatchedProducts([]);
      return;
    }
    const category = categoryMap[lastDeviceType] || 'smartphone';
    setLoadingProducts(true);
    getProducts({ category, limit: 8 })
      .then((r) => setMatchedProducts(r.data.products || []))
      .catch(() => setMatchedProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [recommendations, lastDeviceType]);

  const initialForm = hasSavedProfile
    ? {
        deviceType: savedProfile.deviceType || '',
        brand: savedProfile.brand || '',
        model: savedProfile.model || '',
        usagePattern: savedProfile.usagePattern || '',
        issues: '',
      }
    : null;

  return (
    <div style={s.page}>
      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>
            <Bot size={16} /> Powered by Google Gemini
          </div>
          <h1 style={s.h1}>AI Accessory Advisor</h1>
          <p style={s.subtitle}>
            Enter your device details and get personalized accessory recommendations
            tailored to your usage and needs.
          </p>

          {isAuthenticated && hasSavedProfile && (
            <div style={s.prefillBanner}>
              <Fingerprint size={24} color="var(--color-action-primary)" />
              <span style={{ textAlign: 'left' }}>
                <strong style={{ color: 'var(--color-action-primary)' }}>Profile Detected</strong>{' '}
                &mdash; using your saved {savedProfile.brand} {savedProfile.model}. <br />
                <a href="/profile" style={{ color: 'var(--color-text-body)', fontWeight: 500 }}>
                  Update preferences →
                </a>
              </span>
            </div>
          )}

          {!isAuthenticated && (
            <div style={s.loginBanner}>
              <Lock size={20} color="var(--color-action-primary)" />
              <span style={{ textAlign: 'left' }}>
                Create an account to save your device profile for faster recommendations.
              </span>
              <a href="/register" style={s.loginBtn} className="shimmer-cta">
                Sign Up Free
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Main — AIAdvisor component ── */}
      <div style={s.main}>
        <AIAdvisor initialForm={initialForm} onRecommendations={handleRecommendations} />

        {/* ── Matched Products ── */}
        {(loadingProducts || matchedProducts.length > 0 || recommendations.length > 0) && (
          <div style={s.matchSection}>
            <div style={s.matchHeader}>
              <div style={s.matchTitle}>
                <Package size={22} color="var(--color-action-primary)" /> Shop Matching Products
              </div>
              {matchedProducts.length > 0 && (
                <span style={s.matchBadge}>{matchedProducts.length} items</span>
              )}
            </div>

            {loadingProducts && (
              <div style={s.loadingMatch}>
                <Search size={24} />
                <br />
                <br />
                Finding matching products…
              </div>
            )}

            {!loadingProducts && matchedProducts.length === 0 && recommendations.length > 0 && (
              <div style={s.emptyMatch}>
                No matching products found in our catalog.{' '}
                <a href="/products" style={{ color: 'var(--color-action-primary)', fontWeight: 600 }}>
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
