import { Link } from 'react-router-dom';
import { Bot, Link2, ShieldCheck, ShoppingCart } from 'lucide-react';

const features = [
  {
    icon: <Bot size={40} color="var(--gold-primary)" />,
    title: 'AI Recommendations',
    desc: 'Get personalised accessory picks based on your exact device model and usage habits.',
  },
  {
    icon: <Link2 size={40} color="var(--gold-primary)" />,
    title: 'Smart Compatibility',
    desc: 'Every product is matched to your brand — no more buying accessories that don\'t fit.',
  },
  {
    icon: <ShieldCheck size={40} color="var(--gold-primary)" />,
    title: 'Preventive Care',
    desc: 'Protect your investment before damage happens with expert-curated care bundles.',
  },
  {
    icon: <ShoppingCart size={40} color="var(--gold-primary)" />,
    title: 'Easy Shopping',
    desc: 'Streamlined cart, quick checkout, and real-time order tracking in one place.',
  },
];

const styles = {
  page: { background: 'var(--bg-dark)', color: 'var(--text-cream)', minHeight: '100vh', paddingBottom: '80px', position: 'relative' },
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '140px 24px 180px',
    background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.18) 0%, var(--bg-dark) 80%)',
    position: 'relative',
  },
  badge: {
    display: 'inline-flex', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-highlight)',
    border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px',
    padding: '8px 20px', fontSize: '13px', marginBottom: '28px', letterSpacing: '0.08em',
    textTransform: 'uppercase', fontWeight: 600,
  },
  h1: { 
    fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 600, lineHeight: 1.1, marginBottom: '24px',
    color: 'var(--text-cream)', maxWidth: '900px', textShadow: '0 4px 20px rgba(0,0,0,0.5)'
  },
  subtitle: { fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.7, marginBottom: '48px' },
  btnRow: { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' },
  btnPrimary: {
    padding: '16px 36px', borderRadius: '12px', textDecoration: 'none',
    fontWeight: 600, fontSize: '1.05rem', 
  },
  btnSecondary: {
    background: 'var(--glass-bg)', color: 'var(--text-cream)',
    border: '1px solid var(--glass-border)', padding: '16px 36px',
    borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem',
  },
  section: { padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { textAlign: 'center', fontSize: '2.5rem', fontWeight: 500, marginBottom: '16px', color: 'var(--gold-highlight)' },
  sectionSub: { textAlign: 'center', color: 'var(--text-muted)', marginBottom: '56px', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' },
  card: {
    padding: '40px 32px', textAlign: 'left', display: 'flex', flexDirection: 'column',
  },
  cardIcon: { marginBottom: '24px' },
  cardTitle: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-cream)' },
  cardDesc: { color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' },
};

export default function Home() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.badge} className="gold-glow">Premium Care</span>
        <h1 style={styles.h1} className="font-playfair">Protect Your Device,<br />Extend Its Legacy</h1>
        <p style={styles.subtitle}>
          CareSmart matches the right accessories to your exact device using AI — so you buy smarter, not more.
        </p>
        <div style={styles.btnRow}>
          <Link to="/products" style={styles.btnPrimary} className="shimmer-cta">Shop Luxury Accessories</Link>
          <Link to="/register" style={styles.btnSecondary} className="gold-glow">Join the Waitlist</Link>
        </div>
        
        {/* Animated Wave Divider */}
        <div className="wave-container" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 10 }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z" fill="var(--bg-dark)" />
            <path d="M1200,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C1638.64,32.43,1712.34,53.67,1783,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C2189.49,25,2313-14.29,2400,52.47V120H1200Z" fill="var(--bg-dark)" />
          </svg>
        </div>
      </section>

      <section style={{ ...styles.section, marginTop: '-40px', position: 'relative', zIndex: 20 }}>
        <h2 style={styles.sectionTitle} className="font-playfair">The CareSmart Difference</h2>
        <p style={styles.sectionSub}>Everything you need to keep your device running at its pinnacle.</p>
        <div style={styles.grid}>
          {features.map((f, i) => (
            <div key={f.title} style={{ ...styles.card, animationDelay: `${i * 0.2}s` }} className="glass-panel skeuo-shadow gold-glow float-anim">
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
