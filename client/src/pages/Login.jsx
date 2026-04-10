import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    padding: '24px',
  },
  card: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-medium)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: { textAlign: 'center', marginBottom: '32px' },
  logoText: {
    fontSize: '2rem',
    fontWeight: 800,
    color: 'var(--color-action-primary)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  subtitle: { color: 'var(--color-text-body)', fontSize: '0.95rem', marginTop: '6px' },
  label: {
    display: 'block',
    color: 'var(--color-text-label)',
    fontSize: '0.875rem',
    marginBottom: '6px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '12px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    marginBottom: '20px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  btn: {
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    padding: '13px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  },
  error: {
    background: 'var(--color-error-bg)',
    border: '1px solid var(--color-error-border)',
    color: 'var(--color-error)',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '20px',
    fontSize: '0.875rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '28px',
    color: 'var(--color-text-body)',
    fontSize: '0.9rem',
  },
  link: { color: 'var(--color-action-primary)', textDecoration: 'none', fontWeight: 600 },
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
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoText}>CareSmart</div>
          <div style={s.subtitle}>Welcome back — sign in to your account</div>
        </div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email Address</label>
          <input
            id="login-email"
            className="input-field"
            style={s.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label style={s.label}>Password</label>
          <input
            id="login-password"
            className="input-field"
            style={s.input}
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div style={s.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={s.link}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
