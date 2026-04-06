import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    padding: '24px',
  },
  card: {
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: { textAlign: 'center', marginBottom: '32px' },
  logoText: {
    fontSize: '2.2rem',
    fontWeight: 600,
    color: 'var(--gold-primary)',
    fontFamily: 'Playfair Display, serif',
  },
  subtitle: { color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' },
  label: {
    display: 'block',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '8px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
    padding: '14px 16px',
    color: 'var(--text-cream)',
    fontSize: '1rem',
    marginBottom: '24px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%',
    border: 'none',
    borderRadius: '10px',
    padding: '16px',
    fontSize: '1.05rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#fca5a5',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '24px',
    fontSize: '0.9rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  link: { color: 'var(--gold-highlight)', textDecoration: 'none', fontWeight: 600 },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      navigate(userData.role === 'admin' ? '/admin' : '/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card} className="glass-panel skeuo-shadow">
        <div style={s.logo}>
          <div style={s.logoText}>CareSmart&trade;</div>
          <div style={s.subtitle}>Authenticate your session</div>
        </div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Security Clearance (Email)</label>
          <input
            id="login-email"
            style={s.input}
            className="gold-glow"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alias@domain.com"
            required
          />
          <label style={s.label}>Access Code (Password)</label>
          <input
            id="login-password"
            style={s.input}
            className="gold-glow"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            id="login-submit"
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            className="shimmer-cta"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Secure Login'}
          </button>
        </form>
        <div style={s.footer}>
          Unregistered personnel?{' '}
          <Link to="/register" style={s.link}>
            Enroll here
          </Link>
        </div>
      </div>
    </div>
  );
}
