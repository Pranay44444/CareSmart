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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoText}>CareSmart</div>
          <div style={s.subtitle}>Create your account — it&apos;s free</div>
        </div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input
            id="reg-name"
            className="input-field"
            style={s.input}
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="Your name"
            required
          />
          <label style={s.label}>Email Address</label>
          <input
            id="reg-email"
            className="input-field"
            style={s.input}
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            required
          />
          <label style={s.label}>Password</label>
          <input
            id="reg-password"
            className="input-field"
            style={s.input}
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="Min. 6 characters"
            required
          />
          <button
            id="reg-submit"
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
            className="shimmer-cta"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={s.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
