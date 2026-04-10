import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  Sparkles,
  ShoppingCart,
  ReceiptText,
  User,
  LogOut,
} from 'lucide-react';

const s = {
  container: {
    background: 'var(--color-bg-card)',
    borderBottom: '1px solid var(--color-border-subtle)',
    boxShadow: 'var(--shadow-subtle)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 32px',
    margin: '0 auto',
    maxWidth: '1200px',
  },
  logo: {
    fontSize: '1.35rem',
    fontWeight: 800,
    textDecoration: 'none',
    color: 'var(--color-action-primary)',
    letterSpacing: '-0.01em',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  links: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: {
    color: 'var(--color-text-body)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    borderRadius: '8px',
    transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
  },
  activeLink: {
    color: 'var(--color-action-primary)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    borderRadius: '8px',
    background: 'var(--color-action-tint-bg)',
  },
  btnOutline: {
    color: 'var(--color-action-primary)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid var(--color-action-tint-border)',
    display: 'flex',
    alignItems: 'center',
    background: 'var(--color-bg-card)',
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
    color: 'var(--color-error)',
    border: '1px solid var(--color-error-border)',
    borderRadius: '8px',
    padding: '7px 14px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  divider: { width: '1px', height: '20px', background: 'var(--color-border-subtle)', margin: '0 4px' },
  adminBadge: {
    background: 'var(--color-action-tint-bg)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.72rem',
    color: 'var(--color-action-primary)',
    fontWeight: 700,
    letterSpacing: '0.08em',
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
      <nav style={s.nav} id="main-navbar">
        {/* Logo — links to /admin for admin, / for everyone else */}
        <Link to={isAdmin ? '/admin' : '/'} style={s.logo} className="font-playfair" id="nav-logo">
          CareSmart
        </Link>

        <div style={s.links}>
          {isAuthenticated ? (
            isAdmin ? (
              /* ── Admin nav ─────────────────────────────── */
              <>
                <span style={{ color: 'var(--color-text-body)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> {user?.name?.split(' ')[0]}
                </span>
                <span style={s.adminBadge}>Admin</span>
                <div style={s.divider} />
                <button id="nav-logout" style={s.logoutBtn} className="btn-danger" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              /* ── User nav ──────────────────────────────── */
              <>
                <Link to="/products" style={s.link} className="gold-glow nav-link" id="nav-products">
                  <Package size={16} /> Products
                </Link>
                <Link to="/ai-advisor" style={s.link} className="gold-glow nav-link" id="nav-ai">
                  <Sparkles size={16} /> AI Advisor
                </Link>
                <div style={s.divider} />
                <Link to="/cart" style={s.link} className="gold-glow nav-link" id="nav-cart">
                  <ShoppingCart size={16} /> Cart
                </Link>
                <Link to="/orders" style={s.link} className="gold-glow nav-link" id="nav-orders">
                  <ReceiptText size={16} /> Orders
                </Link>
                <Link to="/profile" style={s.link} className="gold-glow nav-link" id="nav-profile">
                  <User size={16} /> {user?.name?.split(' ')[0]}
                </Link>
                <button id="nav-logout" style={s.logoutBtn} className="btn-danger" onClick={handleLogout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            )
          ) : (
            /* ── Guest nav ─────────────────────────────── */
            <>
              <Link to="/products" style={s.link} className="gold-glow nav-link" id="nav-products">
                <Package size={16} /> Products
              </Link>
              <Link to="/ai-advisor" style={s.link} className="gold-glow nav-link" id="nav-ai">
                <Sparkles size={16} /> AI Advisor
              </Link>
              <div style={s.divider} />
              <Link to="/login" style={s.btnOutline} className="btn-outline" id="nav-login">
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
