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
  smartphone: <Smartphone size={48} color="var(--color-action-tint-border)" />,
  laptop: <Laptop size={48} color="var(--color-action-tint-border)" />,
};

const s = {
  imgBox: {
    height: '200px',
    position: 'relative',
    background: 'var(--color-bg-base)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  body: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  badge: {
    display: 'inline-block',
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '6px',
    padding: '3px 10px',
    fontSize: '0.72rem',
    fontWeight: 600,
    width: 'fit-content',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  name: { color: 'var(--color-text-heading)', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 },
  subCat: { color: 'var(--color-text-muted)', fontSize: '0.82rem' },
  price: {
    color: 'var(--color-action-primary)',
    fontWeight: 700,
    fontSize: '1.3rem',
    marginTop: '2px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  stars: {
    color: 'var(--color-star)',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  reviewCount: { color: 'var(--color-text-muted)', fontSize: '0.78rem', marginLeft: '6px' },
  actions: { display: 'flex', gap: '8px', marginTop: '8px' },
  btnView: {
    flex: 1,
    color: 'var(--color-text-body)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '9px 0',
    fontWeight: 600,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
    backgroundColor: 'var(--color-bg-card)',
  },
  btnCart: (loading) => ({
    flex: 1,
    border: 'none',
    borderRadius: '8px',
    padding: '9px 0',
    fontWeight: 600,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    opacity: loading ? 0.6 : 1,
  }),
  toast: (ok) => ({
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: ok ? 'var(--color-success)' : 'var(--color-error)',
    color: 'var(--color-bg-card)',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '0.82rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    zIndex: 10,
    boxShadow: 'var(--shadow-medium)',
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
      <span style={{ color: 'var(--color-text-heading)', fontWeight: 600, marginLeft: '4px' }}>
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
            {categoryIcon[product.category] || <Package size={48} color="var(--color-action-tint-border)" />}
          </span>
        )}
        {toast && <div style={s.toast(toast.ok)}>{toast.msg}</div>}
        {isAdmin && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'var(--color-action-tint-bg)',
              border: '1px solid var(--color-action-tint-border)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--color-action-primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Admin
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
              color: 'var(--color-text-muted)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Star size={14} opacity={0.3} /> No reviews yet
          </span>
        )}
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
          Stock:{' '}
          {product.stock > 0 ? (
            product.stock
          ) : (
            <span style={{ color: 'var(--color-error)', fontWeight: 600 }}>Out of stock</span>
          )}
        </div>

        <div style={{ ...s.actions, marginTop: 'auto', paddingTop: '12px' }}>
          <Link
            to={`/products/${product._id}`}
            style={s.btnView}
            className="btn-outline"
            id={`view-${product._id}`}
          >
            <Info size={16} /> Details
          </Link>

          {isAdmin ? (
            /* ── Admin actions ── */
            <>
              <button
                id={`edit-${product._id}`}
                className="btn-outline"
                style={{
                  ...s.btnCart(false),
                  background: 'var(--color-action-tint-bg)',
                  border: '1px solid var(--color-action-tint-border)',
                  color: 'var(--color-action-primary)',
                }}
                onClick={() => onEdit?.(product)}
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                id={`delete-${product._id}`}
                className="btn-danger"
                style={{
                  ...s.btnCart(false),
                  background: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  color: 'var(--color-error)',
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
