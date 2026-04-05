import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Sparkles, ShoppingCart, ReceiptText, User, Settings, LogOut } from 'lucide-react';

const s = {
  container: {
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px',
    margin: '0 auto',
    maxWidth: '1200px',
  },
  logo: {
    fontSize: '1.4rem', fontWeight: 800, textDecoration: 'none',
    color: 'var(--gold-primary)',
    letterSpacing: '0.02em',
  },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: {
    color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500,
    fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'color 0.2s',
  },
  btnOutline: {
    color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 600,
    fontSize: '0.9rem', padding: '8px 18px', borderRadius: '8px',
    border: '1px solid var(--glass-border)', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center',
  },
  btnPrimary: {
    padding: '8px 20px', borderRadius: '8px',
    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', border: 'none',
  },
  logoutBtn: {
    background: 'transparent', color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px',
    padding: '7px 14px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.2s',
  },
  divider: { width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 4px' },
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={s.container}>
      <nav style={s.nav} className="glass-panel" id="main-navbar">
        {/* Logo */}
        <Link to="/" style={s.logo} className="font-playfair" id="nav-logo">CareSmart</Link>

        {/* Right-side links */}
        <div style={s.links}>
          <Link to="/products" style={s.link} className="gold-glow" id="nav-products">
            <Package size={16} /> Products
          </Link>
          <Link to="/ai-advisor" style={s.link} className="gold-glow" id="nav-ai">
            <Sparkles size={16} /> AI Advisor
          </Link>

          <div style={s.divider} />

          {isAuthenticated ? (
            <>
              <Link to="/cart" style={s.link} className="gold-glow" id="nav-cart" title="Cart">
                <ShoppingCart size={16} /> Cart
              </Link>
              <Link to="/orders" style={s.link} className="gold-glow" id="nav-orders">
                <ReceiptText size={16} /> Orders
              </Link>
              <Link to="/profile" style={s.link} className="gold-glow" id="nav-profile">
                <User size={16} /> {user?.name?.split(' ')[0]}
              </Link>
              {isAdmin && (
                <Link to="/admin" style={{ ...s.link, color: 'var(--gold-highlight)' }} className="gold-glow" id="nav-admin">
                  <Settings size={16} /> Admin
                </Link>
              )}
              <button id="nav-logout" style={s.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.btnOutline} className="gold-glow" id="nav-login">Sign In</Link>
              <Link to="/register" style={s.btnPrimary} className="shimmer-cta" id="nav-register">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
