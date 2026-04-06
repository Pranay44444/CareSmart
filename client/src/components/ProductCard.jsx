import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  StarHalf,
  ShoppingBag,
  Info,
  Package,
  Smartphone,
  Laptop,
  Pencil,
  Trash2,
} from 'lucide-react';

const categoryIcon = {
  smartphone: <Smartphone size={48} color="rgba(201,168,76,0.3)" />,
  laptop: <Laptop size={48} color="rgba(201,168,76,0.3)" />,
};

const s = {
  imgBox: {
    height: '220px',
    position: 'relative',
    background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, var(--bg-dark) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottom: '1px solid var(--glass-border)',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  body: { padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  badge: {
    display: 'inline-block',
    background: 'rgba(201,168,76,0.1)',
    color: 'var(--gold-highlight)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '6px',
    padding: '4px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    width: 'fit-content',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  name: { color: 'var(--text-cream)', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.4 },
  subCat: { color: 'var(--text-muted)', fontSize: '0.85rem' },
  price: {
    color: 'var(--gold-primary)',
    fontWeight: 700,
    fontSize: '1.4rem',
    marginTop: '4px',
    fontFamily: 'Playfair Display, serif',
  },
  stars: {
    color: 'var(--gold-highlight)',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  reviewCount: { color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '6px' },
  actions: { display: 'flex', gap: '12px', marginTop: '12px' },
  btnView: {
    flex: 1,
    color: 'var(--text-cream)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '10px 0',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
  },
  btnCart: (loading) => ({
    flex: 1,
    border: 'none',
    borderRadius: '8px',
    padding: '10px 0',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.2s',
    opacity: loading ? 0.7 : 1,
  }),
  toast: (ok) => ({
    position: 'absolute',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: ok ? 'rgba(201,168,76,0.9)' : 'rgba(239,68,68,0.9)',
    color: ok ? '#000' : '#fff',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    zIndex: 10,
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  }),
};

const Stars = ({ rating, count }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <div style={s.stars}>
      {[...Array(full)].map((_, i) => (
        <Star key={`f-${i}`} size={14} fill="currentColor" />
      ))}
      {half > 0 && <StarHalf key="h" size={14} fill="currentColor" />}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e-${i}`} size={14} opacity={0.3} />
      ))}
      <span style={{ color: 'var(--text-cream)', fontWeight: 600, marginLeft: '4px' }}>
        {rating?.toFixed(1)}
      </span>
      <span style={s.reviewCount}>({count} reviews)</span>
    </div>
  );
};

export default function ProductCard({ product, onEdit, onDelete }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (ok, msg) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (product.stock === 0) return;
    setLoading(true);
    try {
      await addToCart(product._id, 1);
      showToast(true, 'Added to reserve');
    } catch (err) {
      showToast(false, err.response?.data?.message || 'Failed to request');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm(`Remove "${product.name}" from catalog?`)) {
      onDelete?.(product._id, product.name);
    }
  };

  return (
    <div
      className="glass-panel skeuo-shadow gold-glow"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}
      id={`product-card-${product._id}`}
    >
      {/* Image */}
      <div style={s.imgBox}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={s.img} />
        ) : (
          <span>
            {categoryIcon[product.category] || <Package size={48} color="rgba(201,168,76,0.3)" />}
          </span>
        )}
        {toast && <div style={s.toast(toast.ok)}>{toast.msg}</div>}
        {isAdmin && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--gold-highlight)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Admin View
          </div>
        )}
      </div>

      {/* Body */}
      <div style={s.body}>
        <span style={s.badge}>{product.category}</span>
        {product.subCategory && <span style={s.subCat}>{product.subCategory}</span>}
        <div style={s.name}>{product.name}</div>
        <div style={s.price}>₹{((product.price || 0) * 83).toFixed(0)}</div>
        {product.ratings > 0 ? (
          <Stars rating={product.ratings} count={product.numReviews} />
        ) : (
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Star size={14} opacity={0.3} /> No reviews yet
          </span>
        )}
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Stock:{' '}
          {product.stock > 0 ? (
            product.stock
          ) : (
            <span style={{ color: '#fca5a5' }}>Out of stock</span>
          )}
        </div>

        <div style={{ ...s.actions, marginTop: 'auto', paddingTop: '12px' }}>
          <Link
            to={`/products/${product._id}`}
            style={s.btnView}
            className="gold-glow"
            id={`view-${product._id}`}
          >
            <Info size={16} /> Details
          </Link>

          {isAdmin ? (
            /* ── Admin actions ── */
            <>
              <button
                id={`edit-${product._id}`}
                style={{
                  ...s.btnCart(false),
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: 'var(--gold-highlight)',
                }}
                onClick={() => onEdit?.(product)}
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                id={`delete-${product._id}`}
                style={{
                  ...s.btnCart(false),
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#fca5a5',
                  flex: 'none',
                  padding: '10px 14px',
                }}
                onClick={handleDelete}
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            /* ── User action ── */
            <button
              id={`cart-${product._id}`}
              style={s.btnCart(loading || product.stock === 0)}
              className={loading || product.stock === 0 ? 'glass-panel' : 'shimmer-cta'}
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
            >
              {product.stock === 0 ? (
                'Out of Stock'
              ) : loading ? (
                'Reserve...'
              ) : (
                <>
                  <ShoppingBag size={16} /> Reserve
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
