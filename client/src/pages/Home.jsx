import { Link } from 'react-router-dom';
import { Bot, Link2, ShieldCheck, ShoppingCart } from 'lucide-react';

const features = [
  {
    icon: <Bot size={36} color="var(--color-action-primary)" />,
    title: 'AI Recommendations',
    desc: 'Get personalised accessory picks based on your exact device model and usage habits.',
  },
  {
    icon: <Link2 size={36} color="var(--color-action-primary)" />,
    title: 'Smart Compatibility',
    desc: "Every product is matched to your brand — no more buying accessories that don't fit.",
  },
  {
    icon: <ShieldCheck size={36} color="var(--color-action-primary)" />,
    title: 'Preventive Care',
    desc: 'Protect your investment before damage happens with expert-curated care bundles.',
  },
  {
    icon: <ShoppingCart size={36} color="var(--color-action-primary)" />,
    title: 'Easy Shopping',
    desc: 'Streamlined cart, quick checkout, and real-time order tracking in one place.',
  },
];

const styles = {
  page: {
    background: 'var(--color-bg-base)',
    color: 'var(--color-text-heading)',
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '100px 24px 140px',
    background: 'linear-gradient(160deg, var(--color-bg-surface) 0%, var(--color-bg-base) 60%)',
    position: 'relative',
  },
  badge: {
    display: 'inline-flex',
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '999px',
    padding: '6px 18px',
    fontSize: '12px',
    marginBottom: '24px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  h1: {
    fontSize: 'clamp(2.4rem, 6vw, 4rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '20px',
    color: 'var(--color-text-heading)',
    maxWidth: '820px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  accent: { color: 'var(--color-action-primary)' },
  subtitle: {
    fontSize: '1.15rem',
    color: 'var(--color-text-body)',
    maxWidth: '560px',
    lineHeight: 1.7,
    marginBottom: '40px',
  },
  btnRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' },
  btnPrimary: {
    padding: '14px 32px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1rem',
  },
  btnSecondary: {
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-label)',
    border: '1px solid var(--color-border-subtle)',
    padding: '14px 32px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: 'var(--shadow-subtle)',
  },
  section: { padding: '72px 24px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: '12px',
    color: 'var(--color-text-heading)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  sectionSub: {
    textAlign: 'center',
    color: 'var(--color-text-body)',
    marginBottom: '48px',
    fontSize: '1.05rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '32px 28px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-subtle)',
    transition: 'box-shadow var(--dur-normal) var(--ease-out), transform var(--dur-normal) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
  },
  cardIcon: {
    marginBottom: '20px',
    width: '56px',
    height: '56px',
    background: 'var(--color-action-tint-bg)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-text-heading)' },
  cardDesc: { color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.95rem' },
};

export default function Home() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.badge}>AI-Powered Accessories</span>
        <h1 style={styles.h1}>
          The Smarter Way to
          <br />
          <span style={styles.accent}>Care for Your Device</span>
        </h1>
        <p style={styles.subtitle}>
          CareSmart matches the right accessories to your exact device using AI — so you buy
          smarter, not more.
        </p>
        <div style={styles.btnRow}>
          <Link to="/products" style={styles.btnPrimary} className="shimmer-cta">
            Shop Accessories
          </Link>
          <Link to="/register" style={styles.btnSecondary} className="btn-outline">
            Create Account
          </Link>
        </div>

        <div
          className="wave-container"
          style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 10 }}
        >
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
              style={{ fill: 'var(--color-bg-base)' }}
            />
            <path
              d="M1200,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C1638.64,32.43,1712.34,53.67,1783,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C2189.49,25,2313-14.29,2400,52.47V120H1200Z"
              style={{ fill: 'var(--color-bg-base)' }}
            />
          </svg>
        </div>
      </section>

      <section style={{ ...styles.section, marginTop: '-20px', position: 'relative', zIndex: 20 }}>
        <h2 style={styles.sectionTitle}>Why CareSmart?</h2>
        <p style={styles.sectionSub}>Everything you need to protect and extend your device&apos;s life.</p>
        <div style={styles.grid}>
          {features.map((f) => (
            <div key={f.title} style={styles.card} className="gold-glow">
              <div style={styles.cardIcon}>{f.icon}</div>
              <div style={styles.cardTitle}>{f.title}</div>
              <div style={styles.cardDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
