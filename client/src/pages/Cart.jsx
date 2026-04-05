import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, clearCart, placeOrder } from '../services/api';

import { ShoppingCart, Trash2, PackageCheck, Box } from 'lucide-react';

const s = {
  page: { minHeight: '100vh', background: 'var(--bg-dark)', fontFamily: 'Inter, sans-serif', color: 'var(--text-cream)', padding: '64px 24px', paddingBottom: '120px' },
  wrap: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 600, marginBottom: '40px', color: 'var(--text-cream)', display: 'flex', alignItems: 'center', gap: '12px' },
  item: { padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
  itemName: { fontWeight: 600, marginBottom: '6px', fontSize: '1.05rem', color: 'var(--text-cream)' },
  itemMeta: { color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  itemPrice: { color: 'var(--gold-primary)', fontWeight: 700, fontSize: '1.25rem', fontFamily: 'Playfair Display, serif' },
  removeBtn: { background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' },
  summary: { padding: '32px', marginTop: '40px' },
  total: { fontSize: '1.8rem', fontWeight: 600, color: 'var(--gold-primary)', marginBottom: '24px', fontFamily: 'Playfair Display, serif' },
  input: { width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '14px 16px', color: 'var(--text-cream)', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', marginBottom: '16px', transition: 'border-color 0.2s' },
  label: { display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 },
  btn: { border: 'none', borderRadius: '10px', padding: '16px 28px', fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  clearBtn: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontSize: '0.95rem', marginTop: '16px', width: '100%', transition: 'all 0.2s' },
  empty: { textAlign: 'center', color: 'var(--text-muted)', padding: '100px 0' },
  success: { background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-primary)', color: 'var(--gold-highlight)', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontWeight: 500 },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontSize: '0.95rem' },
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

  if (!cart) return <div style={{ ...s.page, textAlign: 'center', paddingTop: '120px', color: 'var(--text-muted)' }}>Loading reserve details…</div>;

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title} className="font-playfair"><ShoppingCart size={32} color="var(--gold-primary)"/> Your Reserve</div>
        {cart.items?.length === 0 ? (
          <div style={s.empty}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <ShoppingCart size={64} color="var(--glass-border)" />
            </div>
            <div style={{ fontSize: '1.25rem' }}>Your reserve list is empty.</div>
            <a href="/products" style={{ color: 'var(--gold-highlight)', textDecoration: 'none', fontWeight: 600, display: 'block', marginTop: '16px' }}>Browse Luxury Catalog →</a>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.product?._id} style={s.item} className="glass-panel skeuo-shadow">
                <div style={{ flex: 1 }}>
                  <div style={s.itemName}>{item.product?.name || 'Product'}</div>
                  <div style={s.itemMeta}>{item.product?.category} · Qty: {item.qty}</div>
                </div>
                <div style={s.itemPrice}>₹{(((item.product?.price || 0) * 83) * item.qty).toFixed(0)}</div>
                <button id={`remove-${item.product?._id}`} style={s.removeBtn} onClick={() => handleRemove(item.product?._id)}><Trash2 size={16}/> Remove</button>
              </div>
            ))}

            <div style={s.summary} className="glass-panel skeuo-shadow">
              <div style={s.total}>Total: ₹{(total * 83).toFixed(0)}</div>
              {msg && <div style={s.success}>{msg}</div>}
              {error && <div style={s.error}>{error}</div>}
              <form onSubmit={handleOrder}>
                <div style={{ marginBottom: '24px', fontWeight: 600, color: 'var(--text-cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Box size={20} color="var(--gold-primary)"/> Shipping Details
                </div>
                <label style={s.label}>Street Address</label>
                <input id="shipping-address" style={s.input} placeholder="123 Main St" value={shipping.address}
                  onChange={(e) => setShipping((f) => ({ ...f, address: e.target.value }))} />
                <label style={s.label}>City</label>
                <input id="shipping-city" style={s.input} placeholder="New Delhi" value={shipping.city}
                  onChange={(e) => setShipping((f) => ({ ...f, city: e.target.value }))} />
                <label style={s.label}>Postal Code</label>
                <input id="shipping-postal" style={s.input} placeholder="110001" value={shipping.postalCode}
                  onChange={(e) => setShipping((f) => ({ ...f, postalCode: e.target.value }))} />
                <button id="place-order" style={{ ...s.btn, opacity: ordering ? 0.7 : 1 }} className="shimmer-cta" type="submit" disabled={ordering}>
                  {ordering ? 'Placing Order…' : <><PackageCheck size={20}/> Confirm Order</>}
                </button>
              </form>
              <button id="clear-cart" style={s.clearBtn} className="gold-glow" onClick={handleClear}>Clear List</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
