import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, clearCart, placeOrder } from '../services/api';

import { ShoppingCart, Trash2, PackageCheck, Box } from 'lucide-react';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
    padding: '48px 24px',
    paddingBottom: '100px',
  },
  wrap: { maxWidth: '760px', margin: '0 auto' },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '32px',
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  item: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '18px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
    boxShadow: 'var(--shadow-subtle)',
  },
  itemName: { fontWeight: 600, marginBottom: '4px', fontSize: '1rem', color: 'var(--color-text-heading)' },
  itemMeta: { color: 'var(--color-text-body)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em' },
  itemPrice: { color: 'var(--color-action-primary)', fontWeight: 700, fontSize: '1.15rem', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  removeBtn: {
    background: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error-border)',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 500,
  },
  summary: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '28px',
    marginTop: '32px',
    boxShadow: 'var(--shadow-subtle)',
  },
  total: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    marginBottom: '24px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  input: {
    width: '100%',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '11px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    marginBottom: '14px',
  },
  label: { display: 'block', color: 'var(--color-text-label)', fontSize: '0.875rem', marginBottom: '6px', fontWeight: 500 },
  btn: {
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  clearBtn: {
    background: 'transparent',
    color: 'var(--color-text-body)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '11px 20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '12px',
    width: '100%',
  },
  empty: { textAlign: 'center', color: 'var(--color-text-body)', padding: '80px 0' },
  success: {
    background: 'var(--color-success-bg)',
    border: '1px solid var(--color-success-border)',
    color: 'var(--color-success)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '20px',
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  error: {
    background: 'var(--color-error-bg)',
    border: '1px solid var(--color-error-border)',
    color: 'var(--color-error)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '20px',
    fontSize: '0.875rem',
  },
};

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [ordering, setOrdering] = useState(false);

  const fetchCart = () =>
    getCart()
      .then((r) => setCart(r.data.cart))
      .catch(() => {});
  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const handleClear = async () => {
    await clearCart();
    fetchCart();
  };

  const total = cart?.items?.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0) || 0;

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!shipping.address || !shipping.city || !shipping.postalCode) {
      setError('Please fill in all shipping fields.');
      return;
    }
    setOrdering(true);
    setError('');
    setMsg('');
    try {
      await placeOrder({ shippingAddress: shipping });
      setMsg('✅ Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setOrdering(false);
    }
  };

  if (!cart)
    return (
      <div
        style={{ ...s.page, textAlign: 'center', paddingTop: '120px', color: 'var(--color-text-body)' }}
      >
        Loading cart…
      </div>
    );

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title}>
          <ShoppingCart size={28} color="var(--color-action-primary)" /> Your Cart
        </div>
        {cart.items?.length === 0 ? (
          <div style={s.empty}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <ShoppingCart size={56} color="var(--color-border-subtle)" />
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-label)' }}>Your cart is empty.</div>
            <a
              href="/products"
              style={{
                color: 'var(--color-action-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'block',
                marginTop: '14px',
              }}
            >
              Browse Products →
            </a>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.product?._id} style={s.item}>
                <div style={{ flex: 1 }}>
                  <div style={s.itemName}>{item.product?.name || 'Product'}</div>
                  <div style={s.itemMeta}>
                    {item.product?.category} · Qty: {item.qty}
                  </div>
                </div>
                <div style={s.itemPrice}>
                  ₹{((item.product?.price || 0) * 83 * item.qty).toFixed(0)}
                </div>
                <button
                  id={`remove-${item.product?._id}`}
                  className="btn-danger"
                  style={s.removeBtn}
                  onClick={() => handleRemove(item.product?._id)}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}

            <div style={s.summary}>
              <div style={s.total}>Total: ₹{(total * 83).toFixed(0)}</div>
              {msg && <div style={s.success}>{msg}</div>}
              {error && <div style={s.error}>{error}</div>}
              <form onSubmit={handleOrder}>
                <div
                  style={{
                    marginBottom: '20px',
                    fontWeight: 700,
                    color: 'var(--color-text-heading)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                  }}
                >
                  <Box size={18} color="var(--color-action-primary)" /> Shipping Details
                </div>
                <label style={s.label}>Street Address</label>
                <input
                  id="shipping-address"
                  className="input-field"
                  style={s.input}
                  placeholder="123 Main St"
                  value={shipping.address}
                  onChange={(e) => setShipping((f) => ({ ...f, address: e.target.value }))}
                />
                <label style={s.label}>City</label>
                <input
                  id="shipping-city"
                  className="input-field"
                  style={s.input}
                  placeholder="New Delhi"
                  value={shipping.city}
                  onChange={(e) => setShipping((f) => ({ ...f, city: e.target.value }))}
                />
                <label style={s.label}>Postal Code</label>
                <input
                  id="shipping-postal"
                  className="input-field"
                  style={s.input}
                  placeholder="110001"
                  value={shipping.postalCode}
                  onChange={(e) => setShipping((f) => ({ ...f, postalCode: e.target.value }))}
                />
                <button
                  id="place-order"
                  style={{ ...s.btn, opacity: ordering ? 0.7 : 1 }}
                  className="shimmer-cta"
                  type="submit"
                  disabled={ordering}
                >
                  {ordering ? (
                    'Placing Order…'
                  ) : (
                    <>
                      <PackageCheck size={20} /> Confirm Order
                    </>
                  )}
                </button>
              </form>
              <button
                id="clear-cart"
                style={s.clearBtn}
                className="btn-outline"
                onClick={handleClear}
              >
                Clear List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
