import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Sparkles,
  ShoppingCart,
  ReceiptText,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

const s = {
  container: {
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    margin: '0 auto',
    maxWidth: '1200px',
  },
  logo: {
    fontSize: '1.4rem',
    fontWeight: 800,
    textDecoration: 'none',
    color: 'var(--gold-primary)',
    letterSpacing: '0.02em',
  },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color 0.2s',
  },
  activeLink: {
    color: 'var(--gold-highlight)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnOutline: {
    color: 'var(--gold-primary)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid var(--glass-border)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  btnPrimary: {
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    border: 'none',
  },
  logoutBtn: {
    background: 'transparent',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '8px',
    padding: '7px 14px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  divider: { width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 4px' },
  adminBadge: {
    background: 'rgba(201,168,76,0.12)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.72rem',
    color: 'var(--gold-highlight)',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
};

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={s.container}>
      <nav style={s.nav} className="glass-panel" id="main-navbar">
        {/* Logo — links to /admin for admin, / for everyone else */}
        <Link
          to={isAdmin ? '/admin' : '/'}
          style={s.logo}
          className="font-playfair"
          id="nav-logo"
        >
          CareSmart
        </Link>

        <div style={s.links}>
          {isAuthenticated ? (
            isAdmin ? (
              /* ── Admin nav ─────────────────────────────── */
              <>
                <Link to="/admin" style={s.activeLink} className="gold-glow" id="nav-dashboard">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link
                  to="/products"
                  style={s.link}
                  className="gold-glow"
                  id="nav-admin-catalog"
                >
                  <Package size={16} /> Catalog
                </Link>
                <Link
                  to="/admin?tab=orders"
                  style={s.link}
                  className="gold-glow"
                  id="nav-admin-orders"
                >
                  <ReceiptText size={16} /> Orders
                </Link>
                <div style={s.divider} />
                <Link to="/profile" style={s.link} className="gold-glow" id="nav-profile">
                  <User size={16} /> {user?.name?.split(' ')[0]}
                </Link>
                <span style={s.adminBadge}>Admin</span>
                <button id="nav-logout" style={s.logoutBtn} onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              /* ── User nav ──────────────────────────────── */
              <>
                <Link to="/products" style={s.link} className="gold-glow" id="nav-products">
                  <Package size={16} /> Products
                </Link>
                <Link to="/ai-advisor" style={s.link} className="gold-glow" id="nav-ai">
                  <Sparkles size={16} /> AI Advisor
                </Link>
                <div style={s.divider} />
                <Link to="/cart" style={s.link} className="gold-glow" id="nav-cart">
                  <ShoppingCart size={16} /> Cart
                </Link>
                <Link to="/orders" style={s.link} className="gold-glow" id="nav-orders">
                  <ReceiptText size={16} /> Orders
                </Link>
                <Link to="/profile" style={s.link} className="gold-glow" id="nav-profile">
                  <User size={16} /> {user?.name?.split(' ')[0]}
                </Link>
                <button id="nav-logout" style={s.logoutBtn} onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            )
          ) : (
            /* ── Guest nav ─────────────────────────────── */
            <>
              <Link to="/products" style={s.link} className="gold-glow" id="nav-products">
                <Package size={16} /> Products
              </Link>
              <Link to="/ai-advisor" style={s.link} className="gold-glow" id="nav-ai">
                <Sparkles size={16} /> AI Advisor
              </Link>
              <div style={s.divider} />
              <Link to="/login" style={s.btnOutline} className="gold-glow" id="nav-login">
                Sign In
              </Link>
              <Link to="/register" style={s.btnPrimary} className="shimmer-cta" id="nav-register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
