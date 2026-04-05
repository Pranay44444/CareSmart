import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, clearCart, placeOrder } from '../services/api';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', padding: '32px 24px' },
  wrap: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '32px', background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  item: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' },
  itemName: { fontWeight: 600, marginBottom: '4px' },
  itemMeta: { color: '#94a3b8', fontSize: '0.85rem' },
  itemPrice: { color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' },
  removeBtn: { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem' },
  summary: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginTop: '24px' },
  total: { fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa', marginBottom: '20px' },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', marginBottom: '12px' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '6px' },
  btn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 28px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: '8px' },
  clearBtn: { background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem', marginTop: '12px', width: '100%' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '80px 0' },
  success: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '10px', padding: '16px', marginBottom: '16px' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '10px', padding: '16px', marginBottom: '16px', fontSize: '0.9rem' },
};

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [ordering, setOrdering] = useState(false);

  const fetchCart = () => getCart().then((r) => setCart(r.data.cart)).catch(() => {});
  useEffect(() => { fetchCart(); }, []);

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
      setError('Please fill in all shipping fields.'); return;
    }
    setOrdering(true); setError(''); setMsg('');
    try {
      await placeOrder({ shippingAddress: shipping });
      setMsg('✅ Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally { setOrdering(false); }
  };

  if (!cart) return <div style={{ ...s.page, textAlign: 'center', paddingTop: '120px', color: '#94a3b8' }}>Loading cart…</div>;

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title}>🛒 Your Cart</div>
        {cart.items?.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
            <div>Your cart is empty.</div>
            <a href="/products" style={{ color: '#63b3ed', textDecoration: 'none', fontWeight: 600, display: 'block', marginTop: '12px' }}>Browse Products →</a>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.product?._id} style={s.item}>
                <div style={{ flex: 1 }}>
                  <div style={s.itemName}>{item.product?.name || 'Product'}</div>
                  <div style={s.itemMeta}>{item.product?.category} · Qty: {item.qty}</div>
                </div>
                <div style={s.itemPrice}>${((item.product?.price || 0) * item.qty).toFixed(2)}</div>
                <button id={`remove-${item.product?._id}`} style={s.removeBtn} onClick={() => handleRemove(item.product?._id)}>Remove</button>
              </div>
            ))}

            <div style={s.summary}>
              <div style={s.total}>Total: ${total.toFixed(2)}</div>
              {msg && <div style={s.success}>{msg}</div>}
              {error && <div style={s.error}>{error}</div>}
              <form onSubmit={handleOrder}>
                <div style={{ marginBottom: '16px', fontWeight: 600, color: '#cbd5e0' }}>📦 Shipping Address</div>
                <label style={s.label}>Street Address</label>
                <input id="shipping-address" style={s.input} placeholder="123 Main St" value={shipping.address}
                  onChange={(e) => setShipping((f) => ({ ...f, address: e.target.value }))} />
                <label style={s.label}>City</label>
                <input id="shipping-city" style={s.input} placeholder="New Delhi" value={shipping.city}
                  onChange={(e) => setShipping((f) => ({ ...f, city: e.target.value }))} />
                <label style={s.label}>Postal Code</label>
                <input id="shipping-postal" style={s.input} placeholder="110001" value={shipping.postalCode}
                  onChange={(e) => setShipping((f) => ({ ...f, postalCode: e.target.value }))} />
                <button id="place-order" style={{ ...s.btn, opacity: ordering ? 0.7 : 1 }} type="submit" disabled={ordering}>
                  {ordering ? 'Placing Order…' : '✅ Place Order'}
                </button>
              </form>
              <button id="clear-cart" style={s.clearBtn} onClick={handleClear}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
