import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getReviews, addToCart, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewSummary from '../components/ReviewSummary';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', padding: '32px 24px' },
  back: { color: '#63b3ed', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' },
  imgBox: { background: 'linear-gradient(135deg, #1e293b, #0f3460)', borderRadius: '20px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' },
  badge: { display: 'inline-block', background: 'rgba(99,179,237,0.15)', color: '#63b3ed', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' },
  name: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' },
  price: { fontSize: '2rem', fontWeight: 800, color: '#60a5fa', marginBottom: '16px' },
  desc: { color: '#94a3b8', lineHeight: 1.7, marginBottom: '20px' },
  stock: { color: '#4ade80', marginBottom: '24px', fontSize: '0.9rem' },
  btn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 28px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginRight: '12px', marginBottom: '12px' },
  btnOutline: { background: 'transparent', color: '#63b3ed', border: '2px solid rgba(99,179,237,0.4)', borderRadius: '10px', padding: '12px 24px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' },
  section: { maxWidth: '1000px', margin: '48px auto 0' },
  sTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' },
  reviewCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', marginBottom: '12px' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '8px' },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', marginBottom: '16px' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', minHeight: '100px', resize: 'vertical', marginBottom: '16px' },
  success: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.9rem' },
  aiBox: { background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)', borderRadius: '12px', padding: '20px', marginTop: '16px', color: '#cbd5e0', lineHeight: 1.7 },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cartMsg, setCartMsg] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    getProduct(id).then((r) => setProduct(r.data.product)).catch(() => navigate('/products'));
    getReviews(id).then((r) => setReviews(r.data.reviews)).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addToCart(product._id, 1);
      setCartMsg('✅ Added to cart!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
      setCartMsg(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const handleAISummary = undefined; // handled by ReviewSummary component

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await createReview({ productId: id, rating: parseInt(reviewForm.rating), comment: reviewForm.comment });
      setReviewMsg('✅ Review submitted!');
      const r = await getReviews(id);
      setReviews(r.data.reviews);
      setReviewForm({ rating: '5', comment: '' });
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (!product) return <div style={{ ...s.page, textAlign: 'center', paddingTop: '120px', color: '#94a3b8' }}>Loading…</div>;

  return (
    <div style={s.page}>
      <a href="/products" style={s.back}>← Back to Products</a>
      <div style={s.grid}>
        <div style={s.imgBox}>
          {product.image ? <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
            : <span>{product.category === 'smartphone' ? '📱' : '💻'}</span>}
        </div>
        <div>
          <span style={s.badge}>{product.category}</span>
          {product.subCategory && <span style={{ ...s.badge, marginLeft: '8px', color: '#a78bfa', background: 'rgba(167,139,250,0.1)' }}>{product.subCategory}</span>}
          <div style={s.name}>{product.name}</div>
          <div style={s.price}>${product.price?.toFixed(2)}</div>
          <div style={s.desc}>{product.description}</div>
          <div style={s.stock}>{product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}</div>
          {product.compatibleBrands?.length > 0 && (
            <div style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>
              🔗 Compatible with: {product.compatibleBrands.join(', ')}
            </div>
          )}
          {cartMsg && <div style={cartMsg.startsWith('✅') ? s.success : { ...s.success, borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5', background: 'rgba(239,68,68,0.1)' }}>{cartMsg}</div>}
          <button id="add-to-cart" style={s.btn} onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={s.section}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={s.sTitle}>Reviews ({reviews.length})</div>
          <ReviewSummary reviews={reviews} />
        </div>
        {reviews.length === 0 && <div style={{ color: '#94a3b8' }}>No reviews yet. Be the first!</div>}
        {reviews.map((r) => (
          <div key={r._id} style={s.reviewCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>{r.user?.name || 'User'}</span>
              <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{r.comment}</div>
          </div>
        ))}

        {isAuthenticated && (
          <div style={{ marginTop: '32px' }}>
            <div style={s.sTitle}>Write a Review</div>
            {reviewMsg && <div style={reviewMsg.startsWith('✅') ? s.success : { ...s.success, borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5', background: 'rgba(239,68,68,0.1)' }}>{reviewMsg}</div>}
            <form onSubmit={handleReview}>
              <label style={s.label}>Rating</label>
              <select id="review-rating" style={{ ...s.input, cursor: 'pointer' }} value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>)}
              </select>
              <label style={s.label}>Comment</label>
              <textarea id="review-comment" style={s.textarea} value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} placeholder="Share your experience…" />
              <button id="review-submit" style={s.btn} type="submit">Submit Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
