import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '24px' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '440px' },
  logo: { textAlign: 'center', marginBottom: '32px' },
  logoText: { fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px', color: '#e2e8f0', fontSize: '1rem', marginBottom: '20px', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '4px' },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.9rem' },
  footer: { textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '0.9rem' },
  link: { color: '#63b3ed', textDecoration: 'none', fontWeight: 600 },
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
      await login(email, password);
      navigate('/products');
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
          <div style={s.subtitle}>Sign in to your account</div>
        </div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email address</label>
          <input id="login-email" style={s.input} type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <label style={s.label}>Password</label>
          <input id="login-password" style={s.input} type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          <button id="login-submit" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div style={s.footer}>
          Don't have an account? <Link to="/register" style={s.link}>Create one</Link>
        </div>
      </div>
    </div>
  );
}
