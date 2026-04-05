import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🤖',
    title: 'AI Recommendations',
    desc: 'Get personalised accessory picks based on your exact device model and usage habits.',
  },
  {
    icon: '🔗',
    title: 'Smart Compatibility',
    desc: 'Every product is matched to your brand — no more buying accessories that don\'t fit.',
  },
  {
    icon: '🛡️',
    title: 'Preventive Care',
    desc: 'Protect your investment before damage happens with expert-curated care bundles.',
  },
  {
    icon: '🛒',
    title: 'Easy Shopping',
    desc: 'Streamlined cart, quick checkout, and real-time order tracking in one place.',
  },
];

const styles = {
  page: { fontFamily: 'Inter, sans-serif', background: '#0f0f1a', color: '#e2e8f0', minHeight: '100vh' },
  hero: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '100px 24px 80px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  badge: {
    display: 'inline-block', background: 'rgba(99,179,237,0.15)', color: '#63b3ed',
    border: '1px solid rgba(99,179,237,0.3)', borderRadius: '999px',
    padding: '6px 18px', fontSize: '13px', marginBottom: '24px', letterSpacing: '0.05em',
  },
  h1: { fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px',
    background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)', WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: '1.15rem', color: '#94a3b8', maxWidth: '560px', lineHeight: 1.7, marginBottom: '40px' },
  btnRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' },
  btnPrimary: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff',
    padding: '14px 32px', borderRadius: '12px', textDecoration: 'none',
    fontWeight: 700, fontSize: '1rem', transition: 'opacity 0.2s',
  },
  btnSecondary: {
    background: 'transparent', color: '#63b3ed',
    border: '2px solid rgba(99,179,237,0.5)', padding: '12px 32px',
    borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
  },
  section: { padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' },
  sectionTitle: { textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '12px' },
  sectionSub: { textAlign: 'center', color: '#94a3b8', marginBottom: '48px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  card: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '32px 24px', transition: 'transform 0.2s',
  },
  cardIcon: { fontSize: '2.5rem', marginBottom: '16px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', color: '#e2e8f0' },
  cardDesc: { color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem' },
};

export default function Home() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <span style={styles.badge}>✨ AI-Powered Device Care</span>
        <h1 style={styles.h1}>Protect Your Device,<br />Extend Its Life</h1>
        <p style={styles.subtitle}>
          CareSmart matches the right accessories to your exact device using AI — so you buy smarter, not more.
        </p>
        <div style={styles.btnRow}>
          <Link to="/products" style={styles.btnPrimary}>Shop Accessories</Link>
          <Link to="/register" style={styles.btnSecondary}>Get Started Free</Link>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why CareSmart?</h2>
        <p style={styles.sectionSub}>Everything you need to keep your device running at its best.</p>
        <div style={styles.grid}>
          {features.map((f) => (
            <div key={f.title} style={styles.card}>
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
