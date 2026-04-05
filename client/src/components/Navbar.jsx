import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    padding: '0 24px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', height: '64px',
    fontFamily: 'Inter, sans-serif',
  },
  logo: {
    fontSize: '1.4rem', fontWeight: 800, textDecoration: 'none',
    background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  links: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: {
    color: '#94a3b8', textDecoration: 'none', fontWeight: 500,
    fontSize: '0.9rem', padding: '8px 14px', borderRadius: '8px',
    transition: 'color 0.2s, background 0.2s',
  },
  linkHover: { color: '#e2e8f0', background: 'rgba(255,255,255,0.06)' },
  btnOutline: {
    color: '#63b3ed', textDecoration: 'none', fontWeight: 600,
    fontSize: '0.9rem', padding: '7px 16px', borderRadius: '8px',
    border: '1px solid rgba(99,179,237,0.35)', transition: 'all 0.2s',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff',
    border: 'none', borderRadius: '8px', padding: '8px 18px',
    fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
    textDecoration: 'none',
  },
  logoutBtn: {
    background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px',
    padding: '7px 14px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
  },
  divider: { width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' },
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={s.nav} id="main-navbar">
      {/* Logo */}
      <Link to="/" style={s.logo} id="nav-logo">CareSmart</Link>

      {/* Right-side links */}
      <div style={s.links}>
        {/* Always visible */}
        <Link to="/products" style={s.link} id="nav-products">📦 Products</Link>
        <Link to="/ai-advisor" style={s.link} id="nav-ai">🤖 AI Advisor</Link>

        <div style={s.divider} />

        {isAuthenticated ? (
          <>
            <Link to="/cart" style={s.link} id="nav-cart" title="Cart">🛒 Cart</Link>
            <Link to="/orders" style={s.link} id="nav-orders">Orders</Link>
            <Link to="/profile" style={s.link} id="nav-profile">
              👤 {user?.name?.split(' ')[0]}
            </Link>
            {isAdmin && (
              <Link to="/admin" style={{ ...s.link, color: '#a78bfa' }} id="nav-admin">⚙️ Admin</Link>
            )}
            <button id="nav-logout" style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.btnOutline} id="nav-login">Sign In</Link>
            <Link to="/register" style={s.btnPrimary} id="nav-register">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
