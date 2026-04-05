import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/api';
import AIAdvisor from '../components/AIAdvisor';
import ProductCard from '../components/ProductCard';

import { Bot, Fingerprint, Lock, Lightbulb, Search, Package } from 'lucide-react';

const s = {
  page: { minHeight: '100vh', background: 'var(--bg-dark)', fontFamily: 'Inter, sans-serif', color: 'var(--text-cream)' },
  hero: {
    background: 'radial-gradient(ellipse at bottom, rgba(201,168,76,0.15) 0%, var(--bg-dark) 80%)',
    borderBottom: '1px solid var(--glass-border)',
    padding: '64px 24px 48px',
  },
  heroInner: { maxWidth: '900px', margin: '0 auto', textAlign: 'center' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: 'rgba(201,168,76,0.1)', color: 'var(--gold-highlight)',
    border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px',
    padding: '8px 20px', fontSize: '0.85rem', fontWeight: 600,
    letterSpacing: '0.08em', marginBottom: '24px', textTransform: 'uppercase'
  },
  h1: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, lineHeight: 1.15,
    marginBottom: '20px', color: 'var(--text-cream)', fontFamily: 'Playfair Display, serif'
  },
  subtitle: { color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto' },
  // Profile prefill banner
  prefillBanner: {
    marginTop: '32px', padding: '16px 24px',
    display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center',
    fontSize: '0.95rem', color: 'var(--text-cream)', width: 'fit-content', margin: '32px auto 0'
  },
  // Login nudge
  loginBanner: {
    marginTop: '32px', padding: '16px 24px',
    display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center',
    fontSize: '0.95rem', color: 'var(--text-cream)', width: 'fit-content', margin: '32px auto 0'
  },
  // Main content
  main: { maxWidth: '900px', margin: '0 auto', padding: '64px 24px' },
  // Matched products section
  matchSection: { marginTop: '64px' },
  matchHeader: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '32px', paddingBottom: '16px',
    borderBottom: '1px solid var(--glass-border)',
  },
  matchTitle: { fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-cream)', fontFamily: 'Playfair Display, serif', display: 'flex', alignItems: 'center', gap: '12px' },
  matchBadge: {
    background: 'rgba(201,168,76,0.1)', color: 'var(--gold-primary)',
    borderRadius: '999px', padding: '6px 14px',
    fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em'
  },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  emptyMatch: { textAlign: 'center', color: 'var(--text-muted)', padding: '48px', fontSize: '1.05rem' },
  loadingMatch: { textAlign: 'center', color: 'var(--gold-highlight)', padding: '24px' },
  loginBtn: {
    display: 'inline-block',
    textDecoration: 'none', borderRadius: '8px',
    padding: '10px 24px', fontWeight: 600, fontSize: '0.9rem', marginLeft: '16px',
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
          <div style={s.badge}><Bot size={16}/> Powered by Google Gemini</div>
          <h1 style={s.h1}>AI Luxury Configurator</h1>
          <p style={s.subtitle}>
            Input your exact hardware specifications and discover a bespoke collection of protective arrays and aesthetic enhancements.
          </p>

          {isAuthenticated && hasSavedProfile && (
            <div style={s.prefillBanner} className="glass-panel skeuo-shadow">
              <Fingerprint size={24} color="var(--gold-highlight)" />
              <span style={{ textAlign: 'left' }}>
                <strong style={{ color: 'var(--gold-primary)' }}>Identity Synchronized</strong> &mdash; parameters adapted from 
                ({savedProfile.brand} {savedProfile.model}).{' '}
                <br/><a href="/profile" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Calibrate preferences →</a>
              </span>
            </div>
          )}

          {!isAuthenticated && (
            <div style={s.loginBanner} className="glass-panel skeuo-shadow">
              <Lock size={20} color="var(--gold-highlight)" />
              <span style={{ textAlign: 'left' }}>
                Create a member profile to seamlessly synchronize your hardware specifications.
              </span>
              <a href="/register" style={s.loginBtn} className="shimmer-cta">Enroll Now</a>
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
              <div style={s.matchTitle}><Package size={24} color="var(--gold-primary)"/> Curated Allocations</div>
              {matchedProducts.length > 0 && (
                <span style={s.matchBadge}>{matchedProducts.length} exclusive items</span>
              )}
            </div>

            {loadingProducts && (
              <div style={s.loadingMatch}><Search size={24} className="gold-glow" style={{ animation: 'pulse-glow 2s infinite' }}/> <br/><br/>Synthesizing matching products…</div>
            )}

            {!loadingProducts && matchedProducts.length === 0 && recommendations.length > 0 && (
              <div style={s.emptyMatch} className="glass-panel">
                We currently lack inventory matching this exact specification.{' '}
                <a href="/products" style={{ color: 'var(--gold-highlight)', fontWeight: 600 }}>
                  Review global catalog →
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
