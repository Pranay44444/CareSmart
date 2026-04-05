import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categoryIcon = { smartphone: '📱', laptop: '💻' };
const categoryColor = { smartphone: '#63b3ed', laptop: '#a78bfa' };

const s = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    fontFamily: 'Inter, sans-serif',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  imgBox: {
    height: '190px', position: 'relative',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f3460 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '4rem', overflow: 'hidden',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  body: { padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  badge: (cat) => ({
    display: 'inline-block',
    background: `rgba(${cat === 'smartphone' ? '99,179,237' : '167,139,250'},0.15)`,
    color: categoryColor[cat] || '#94a3b8',
    borderRadius: '6px', padding: '3px 10px',
    fontSize: '0.75rem', fontWeight: 700, width: 'fit-content',
  }),
  name: { color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 },
  subCat: { color: '#64748b', fontSize: '0.78rem' },
  price: { color: '#60a5fa', fontWeight: 800, fontSize: '1.25rem', marginTop: '2px' },
  stars: { color: '#f59e0b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' },
  reviewCount: { color: '#64748b', fontSize: '0.8rem' },
  actions: { display: 'flex', gap: '8px', marginTop: '6px' },
  btnView: {
    flex: 1, background: 'rgba(99,179,237,0.1)', color: '#63b3ed',
    border: '1px solid rgba(99,179,237,0.3)', borderRadius: '8px',
    padding: '9px 0', fontWeight: 700, fontSize: '0.85rem',
    textAlign: 'center', textDecoration: 'none', cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnCart: (loading) => ({
    flex: 1, background: loading
      ? 'rgba(99,102,241,0.4)'
      : 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff', border: 'none', borderRadius: '8px',
    padding: '9px 0', fontWeight: 700, fontSize: '0.85rem',
    cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
  }),
  toast: (ok) => ({
    position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
    background: ok ? 'rgba(74,222,128,0.9)' : 'rgba(239,68,68,0.9)',
    color: '#fff', borderRadius: '8px', padding: '8px 16px',
    fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', zIndex: 10,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  }),
};

const Stars = ({ rating, count }) => {
  const full = Math.round(rating);
  return (
    <div style={s.stars}>
      <span>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
      <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{rating?.toFixed(1)}</span>
      <span style={s.reviewCount}>({count} review{count !== 1 ? 's' : ''})</span>
    </div>
  );
};

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { ok, msg }

  const showToast = (ok, msg) => {
    setToast({ ok, msg });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (product.stock === 0) return;
    setLoading(true);
    try {
      await addToCart(product._id, 1);
      showToast(true, '✅ Added to cart!');
    } catch (err) {
      showToast(false, err.response?.data?.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.card} id={`product-card-${product._id}`}>
      {/* Image */}
      <div style={s.imgBox}>
        {product.image
          ? <img src={product.image} alt={product.name} style={s.img} />
          : <span>{categoryIcon[product.category] || '📦'}</span>
        }
        {toast && <div style={s.toast(toast.ok)}>{toast.msg}</div>}
      </div>

      {/* Body */}
      <div style={s.body}>
        <span style={s.badge(product.category)}>{product.category}</span>
        {product.subCategory && <span style={s.subCat}>{product.subCategory}</span>}
        <div style={s.name}>{product.name}</div>
        <div style={s.price}>₹{((product.price || 0) * 83).toFixed(0)}</div>
        {product.ratings > 0
          ? <Stars rating={product.ratings} count={product.numReviews} />
          : <span style={{ color: '#475569', fontSize: '0.8rem' }}>No reviews yet</span>
        }
        <div style={{ ...s.actions, marginTop: 'auto', paddingTop: '8px' }}>
          <Link to={`/products/${product._id}`} style={s.btnView} id={`view-${product._id}`}>
            View Details
          </Link>
          <button
            id={`cart-${product._id}`}
            style={s.btnCart(loading || product.stock === 0)}
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : loading ? '…' : '🛒 Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
