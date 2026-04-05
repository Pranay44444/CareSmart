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
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
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
          <div style={s.subtitle}>Create your free account</div>
        </div>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input id="reg-name" style={s.input} type="text" value={form.name}
            onChange={set('name')} placeholder="Jane Doe" required />
          <label style={s.label}>Email address</label>
          <input id="reg-email" style={s.input} type="email" value={form.email}
            onChange={set('email')} placeholder="you@example.com" required />
          <label style={s.label}>Password</label>
          <input id="reg-password" style={s.input} type="password" value={form.password}
            onChange={set('password')} placeholder="Min. 6 characters" required />
          <button id="reg-submit" style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>
        <div style={s.footer}>
          Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
