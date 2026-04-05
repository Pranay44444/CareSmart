import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getReviews, addToCart, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewSummary from '../components/ReviewSummary';

import { Star, StarHalf, ArrowLeft, ShieldCheck, Cpu, MessagesSquare } from 'lucide-react';

const s = {
  page: { minHeight: '100vh', background: 'var(--bg-dark)', fontFamily: 'Inter, sans-serif', color: 'var(--text-cream)', padding: '40px 24px', paddingBottom: '120px' },
  back: { color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', width: 'fit-content', transition: 'color 0.2s' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', maxWidth: '1100px', margin: '0 auto' },
  imgBox: { background: 'radial-gradient(circle at center, rgba(201,168,76,0.08) 0%, var(--bg-dark) 100%)', border: '1px solid var(--glass-border)', borderRadius: '24px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  badge: { display: 'inline-block', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-highlight)', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' },
  name: { fontSize: '2.5rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-cream)', fontFamily: 'Playfair Display, serif', lineHeight: 1.2 },
  price: { fontSize: '2.2rem', fontWeight: 600, color: 'var(--gold-primary)', marginBottom: '24px', fontFamily: 'Playfair Display, serif' },
  desc: { color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '32px', fontSize: '1.05rem' },
  stock: { color: 'var(--gold-highlight)', marginBottom: '32px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 },
  btn: { border: 'none', borderRadius: '12px', padding: '16px 36px', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', marginRight: '16px', marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' },
  section: { maxWidth: '1100px', margin: '80px auto 0' },
  sTitle: { fontSize: '1.6rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', fontFamily: 'Playfair Display, serif', display: 'flex', alignItems: 'center', gap: '10px' },
  reviewCard: { padding: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column' },
  label: { display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 },
  input: { width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 16px', color: 'var(--text-cream)', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', marginBottom: '20px', transition: 'border-color 0.2s' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 16px', color: 'var(--text-cream)', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', minHeight: '120px', resize: 'vertical', marginBottom: '20px', transition: 'border-color 0.2s' },
  success: { background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-primary)', color: 'var(--gold-highlight)', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 500 },
  aiBox: { background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '16px', padding: '24px', marginTop: '24px', color: 'var(--text-cream)', lineHeight: 1.8 },
};

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--gold-highlight)', gap: '2px' }}>
      {[...Array(full)].map((_, i) => <Star key={`f-${i}`} size={16} fill="currentColor" />)}
      {half > 0 && <StarHalf key="h" size={16} fill="currentColor" />}
      {[...Array(empty)].map((_, i) => <Star key={`e-${i}`} size={16} opacity={0.3} />)}
    </div>
  );
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
      setCartMsg('Item reserved');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
      setCartMsg(err.response?.data?.message || 'Failed to request reservation.');
    }
  };

  const handleAISummary = undefined; // handled by ReviewSummary component

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await createReview({ productId: id, rating: parseInt(reviewForm.rating), comment: reviewForm.comment });
      setReviewMsg('Review processed to the luxury network.');
      const r = await getReviews(id);
      setReviews(r.data.reviews);
      setReviewForm({ rating: '5', comment: '' });
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error parsing review.');
    }
  };

  if (!product) return <div style={{ ...s.page, textAlign: 'center', paddingTop: '120px', color: '#94a3b8' }}>Loading…</div>;

  return (
    <div style={s.page}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <a href="/products" style={{ ...s.back, display: 'inline-flex' }} className="gold-glow"><ArrowLeft size={16}/> Back to Catalog</a>
      </div>
      <div style={s.grid}>
        <div style={s.imgBox} className="glass-panel">
          {product.image ? <img src={product.image} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            : <span style={{ opacity: 0.2 }}><Cpu size={120} color="var(--gold-primary)"/></span>}
        </div>
        <div>
          <span style={s.badge}>{product.category}</span>
          {product.subCategory && <span style={{ ...s.badge, marginLeft: '12px', color: 'var(--text-cream)', background: 'var(--glass-border)' }}>{product.subCategory}</span>}
          <div style={s.name}>{product.name}</div>
          <div style={s.price}>₹{((product.price || 0) * 83).toFixed(0)}</div>
          <div style={s.desc}>{product.description}</div>
          <div style={s.stock}>{product.stock > 0 ? <><ShieldCheck size={18}/> {product.stock} units secured in vault</> : 'Waitlist Only'}</div>
          {product.compatibleBrands?.length > 0 && (
            <div style={{ marginBottom: '32px', color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="var(--gold-highlight)"/> Certified compatible: {product.compatibleBrands.join(', ')}
            </div>
          )}
          {cartMsg && <div style={cartMsg.includes('Failed') ? { ...s.success, borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5', background: 'rgba(239,68,68,0.1)' } : s.success}>{cartMsg}</div>}
          <button id="add-to-cart" style={s.btn} className={product.stock > 0 ? "shimmer-cta" : "glass-panel"} onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock > 0 ? 'Reserve Allocation' : 'Currently Unavailable'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={s.section}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div style={s.sTitle}><MessagesSquare size={24} color="var(--gold-primary)"/> Customer Perspectives ({reviews.length})</div>
          <ReviewSummary reviews={reviews} />
        </div>
        {reviews.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No perspectives yet.</div>}
        {reviews.map((r) => (
          <div key={r._id} style={s.reviewCard} className="glass-panel skeuo-shadow">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-cream)' }}>{r.user?.name || 'Exclusive Member'}</span>
              <Stars rating={r.rating} />
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{r.comment}</div>
          </div>
        ))}

        {isAuthenticated && (
          <div style={{ marginTop: '48px', maxWidth: '600px' }} className="glass-panel skeuo-shadow" css={{ padding: '32px' }}>
            <div style={{ ...s.sTitle, borderBottom: 'none' }}>Leave Your Perspective</div>
            {reviewMsg && <div style={reviewMsg.includes('Error') ? { ...s.success, borderColor: 'rgba(239,68,68,0.3)', color: '#fca5a5', background: 'rgba(239,68,68,0.1)' } : s.success}>{reviewMsg}</div>}
            <form onSubmit={handleReview}>
              <label style={s.label}>Rating Tier</label>
              <select id="review-rating" style={{ ...s.input, cursor: 'pointer' }} value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>)}
              </select>
              <label style={s.label}>Perspective</label>
              <textarea id="review-comment" style={s.textarea} value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} placeholder="Share your experience with this luxury good…" />
              <button id="review-submit" style={{...s.btn, display: 'block', width: '100%'}} className="shimmer-cta" type="submit">Submit Perspective</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
