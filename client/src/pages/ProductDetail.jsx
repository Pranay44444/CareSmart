import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getReviews, addToCart, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewSummary from '../components/ReviewSummary';

import { Star, StarHalf, ArrowLeft, ShieldCheck, Cpu, MessagesSquare } from 'lucide-react';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
    padding: '40px 24px',
    paddingBottom: '120px',
  },
  back: {
    color: 'var(--color-text-body)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '40px',
    width: 'fit-content',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '48px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  imgBox: {
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '16px',
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    display: 'inline-block',
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '0.78rem',
    fontWeight: 600,
    marginBottom: '16px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: '16px',
    color: 'var(--color-text-heading)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    lineHeight: 1.2,
  },
  price: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--color-action-primary)',
    marginBottom: '24px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  desc: { color: 'var(--color-text-body)', lineHeight: 1.8, marginBottom: '32px', fontSize: '1.05rem' },
  stock: {
    color: 'var(--color-success)',
    marginBottom: '32px',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 500,
  },
  btn: {
    border: 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginRight: '16px',
    marginBottom: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  section: { maxWidth: '1100px', margin: '80px auto 0' },
  sTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border-subtle)',
    paddingBottom: '16px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--color-text-heading)',
  },
  reviewCard: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-subtle)',
  },
  label: {
    display: 'block',
    color: 'var(--color-text-label)',
    fontSize: '0.875rem',
    marginBottom: '8px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '120px',
    resize: 'vertical',
    marginBottom: '20px',
  },
  success: {
    background: 'var(--color-success-bg)',
    border: '1px solid var(--color-success-border)',
    color: 'var(--color-success)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '20px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  error: {
    background: 'var(--color-error-bg)',
    border: '1px solid var(--color-error-border)',
    color: 'var(--color-error)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '20px',
    fontSize: '0.9rem',
  },
};

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-star)', gap: '2px' }}>
      {[...Array(full)].map((_, i) => (
        <Star key={`f-${i}`} size={16} fill="currentColor" />
      ))}
      {half > 0 && <StarHalf key="h" size={16} fill="currentColor" />}
      {[...Array(empty)].map((_, i) => (
        <Star key={`e-${i}`} size={16} opacity={0.3} />
      ))}
    </div>
  );
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [cartMsg, setCartMsg] = useState('');
  const [cartOk, setCartOk] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewOk, setReviewOk] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((r) => setProduct(r.data.product))
      .catch(() => navigate('/products'));
    getReviews(id)
      .then((r) => setReviews(r.data.reviews))
      .catch(() => {});
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, 1);
      setCartOk(true);
      setCartMsg('Added to cart!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err) {
      setCartOk(false);
      setCartMsg(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await createReview({
        productId: id,
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewOk(true);
      setReviewMsg('Review submitted successfully!');
      const r = await getReviews(id);
      setReviews(r.data.reviews);
      setReviewForm({ rating: '5', comment: '' });
    } catch (err) {
      setReviewOk(false);
      setReviewMsg(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (!product)
    return (
      <div style={{ ...s.page, textAlign: 'center', paddingTop: '120px', color: 'var(--color-text-body)' }}>
        Loading…
      </div>
    );

  return (
    <div style={s.page}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <a href="/products" className="text-link" style={{ ...s.back, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </a>
      </div>
      <div style={s.grid}>
        <div style={s.imgBox}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ opacity: 0.2 }}>
              <Cpu size={120} color="var(--color-action-primary)" />
            </span>
          )}
        </div>
        <div>
          <span style={s.badge}>{product.category}</span>
          {product.subCategory && (
            <span
              style={{
                ...s.badge,
                marginLeft: '10px',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-body)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              {product.subCategory}
            </span>
          )}
          <div style={s.name}>{product.name}</div>
          <div style={s.price}>₹{((product.price || 0) * 83).toFixed(0)}</div>
          <div style={s.desc}>{product.description}</div>
          <div style={{ ...s.stock, color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {product.stock > 0 ? (
              <>
                <ShieldCheck size={18} /> {product.stock} in stock
              </>
            ) : (
              'Out of stock'
            )}
          </div>
          {product.compatibleBrands?.length > 0 && (
            <div
              style={{
                marginBottom: '32px',
                color: 'var(--color-text-body)',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Cpu size={16} color="var(--color-action-primary)" /> Compatible with:{' '}
              {product.compatibleBrands.join(', ')}
            </div>
          )}
          {cartMsg && (
            <div style={cartOk ? s.success : s.error}>{cartMsg}</div>
          )}
          <button
            id="add-to-cart"
            style={s.btn}
            className={product.stock > 0 ? 'shimmer-cta' : ''}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={s.section}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={s.sTitle}>
            <MessagesSquare size={22} color="var(--color-action-primary)" /> Customer Reviews ({reviews.length})
          </div>
          <ReviewSummary reviews={reviews} />
        </div>
        {reviews.length === 0 && (
          <div style={{ color: 'var(--color-text-body)', fontSize: '0.95rem' }}>No reviews yet. Be the first!</div>
        )}
        {reviews.map((r) => (
          <div key={r._id} style={s.reviewCard}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                {r.user?.name || 'Customer'}
              </span>
              <Stars rating={r.rating} />
            </div>
            <div style={{ color: 'var(--color-text-body)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {r.comment}
            </div>
          </div>
        ))}

        {isAuthenticated && (
          <div
            style={{
              marginTop: '48px',
              maxWidth: '600px',
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: '12px',
              padding: '28px 32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ ...s.sTitle, borderBottom: 'none', marginBottom: '20px' }}>
              Write a Review
            </div>
            {reviewMsg && (
              <div style={reviewOk ? s.success : s.error}>{reviewMsg}</div>
            )}
            <form onSubmit={handleReview}>
              <label style={s.label}>Rating</label>
              <select
                id="review-rating"
                className="input-field"
                style={{ ...s.input, cursor: 'pointer' }}
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <label style={s.label}>Your Review</label>
              <textarea
                id="review-comment"
                className="input-field"
                style={s.textarea}
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience with this product…"
              />
              <button
                id="review-submit"
                style={{ ...s.btn, display: 'block', width: '100%', marginRight: 0 }}
                className="shimmer-cta"
                type="submit"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
