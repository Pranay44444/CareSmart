import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, getProducts, createProduct, deleteProduct } from '../../services/api';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', padding: '32px 24px' },
  wrap: { maxWidth: '1100px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '32px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', width: 'fit-content' },
  tab: (active) => ({ padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', border: 'none', background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent', color: active ? '#fff' : '#94a3b8', transition: 'all 0.2s' }),
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '24px' },
  cardTitle: { fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px', color: '#cbd5e0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: { textAlign: 'left', color: '#94a3b8', fontWeight: 600, padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  td: { padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' },
  deleteBtn: { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' },
  label: { display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' },
  btn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  select: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '6px 10px', color: '#e2e8f0', fontSize: '0.85rem', cursor: 'pointer' },
  success: { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem' },
  badge: (status) => {
    const map = { pending: '#fbbf24', processing: '#63b3ed', shipped: '#a78bfa', delivered: '#4ade80' };
    const c = map[status] || '#94a3b8';
    return { color: c, fontWeight: 700, fontSize: '0.8rem' };
  },
};

const EMPTY_FORM = { name: '', description: '', price: '', category: 'smartphone', subCategory: '', stock: '', compatibleBrands: '' };

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState('');

  const fetchProducts = () => getProducts({ limit: 50 }).then((r) => setProducts(r.data.products)).catch(() => {});
  const fetchOrders = () => getAllOrders().then((r) => setOrders(r.data.orders)).catch(() => {});

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const setF = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        compatibleBrands: form.compatibleBrands ? form.compatibleBrands.split(',').map((b) => b.trim()) : [],
      });
      setMsg('✅ Product created!');
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (err) { setMsg(err.response?.data?.message || 'Failed to create product.'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status).catch(() => {});
    fetchOrders();
  };

  const inputStyle = { ...s.input, width: '100%' };
  const gridTwo = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title}>⚙️ Admin Dashboard</div>
        <div style={{ color: '#94a3b8', marginBottom: '28px' }}>Manage products and orders.</div>

        <div style={s.tabs}>
          <button id="tab-products" style={s.tab(tab === 'products')} onClick={() => setTab('products')}>📦 Products</button>
          <button id="tab-orders" style={s.tab(tab === 'orders')} onClick={() => setTab('orders')}>🧾 Orders</button>
        </div>

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <>
            {/* Add Product Form */}
            <div style={s.card}>
              <div style={s.cardTitle}>➕ Add New Product</div>
              {msg && <div style={s.success}>{msg}</div>}
              <form onSubmit={handleCreate}>
                <div style={gridTwo}>
                  <div><label style={s.label}>Name *</label><input id="prod-name" style={inputStyle} value={form.name} onChange={setF('name')} required /></div>
                  <div><label style={s.label}>Price *</label><input id="prod-price" style={inputStyle} type="number" step="0.01" value={form.price} onChange={setF('price')} required /></div>
                </div>
                <div><label style={s.label}>Description *</label><input id="prod-desc" style={inputStyle} value={form.description} onChange={setF('description')} required /></div>
                <div style={gridTwo}>
                  <div>
                    <label style={s.label}>Category *</label>
                    <select id="prod-cat" style={{ ...s.select, width: '100%', marginBottom: '12px', padding: '10px 14px' }} value={form.category} onChange={setF('category')}>
                      <option value="smartphone">Smartphone</option>
                      <option value="laptop">Laptop</option>
                    </select>
                  </div>
                  <div><label style={s.label}>Sub-Category</label><input id="prod-subcat" style={inputStyle} value={form.subCategory} onChange={setF('subCategory')} /></div>
                </div>
                <div style={gridTwo}>
                  <div><label style={s.label}>Stock *</label><input id="prod-stock" style={inputStyle} type="number" value={form.stock} onChange={setF('stock')} required /></div>
                  <div><label style={s.label}>Compatible Brands (comma-separated)</label><input id="prod-brands" style={inputStyle} value={form.compatibleBrands} onChange={setF('compatibleBrands')} /></div>
                </div>
                <div><label style={s.label}>Image URL</label><input id="prod-image" style={inputStyle} value={form.image || ''} onChange={setF('image')} /></div>
                <button id="create-product" style={s.btn} type="submit">Create Product</button>
              </form>
            </div>

            {/* Products Table */}
            <div style={s.card}>
              <div style={s.cardTitle}>All Products ({products.length})</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Name</th>
                      <th style={s.th}>Category</th>
                      <th style={s.th}>Price</th>
                      <th style={s.th}>Stock</th>
                      <th style={s.th}>Rating</th>
                      <th style={s.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td style={s.td}>{p.name}</td>
                        <td style={s.td}><span style={{ color: '#63b3ed', fontSize: '0.8rem' }}>{p.category}</span></td>
                        <td style={s.td}>${p.price?.toFixed(2)}</td>
                        <td style={s.td}>{p.stock}</td>
                        <td style={s.td}>{p.ratings > 0 ? `★ ${p.ratings}` : '—'}</td>
                        <td style={s.td}>
                          <button id={`delete-${p._id}`} style={s.deleteBtn} onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Orders Tab ── */}
        {tab === 'orders' && (
          <div style={s.card}>
            <div style={s.cardTitle}>All Orders ({orders.length})</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Order ID</th>
                    <th style={s.th}>Customer</th>
                    <th style={s.th}>Items</th>
                    <th style={s.th}>Total</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td style={s.td} title={o._id}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td style={s.td}><div>{o.user?.name || '—'}</div><div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{o.user?.email}</div></td>
                      <td style={s.td}>{o.items?.length} item(s)</td>
                      <td style={{ ...s.td, fontWeight: 700, color: '#60a5fa' }}>${o.totalPrice?.toFixed(2)}</td>
                      <td style={s.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={s.td}>
                        <select id={`status-${o._id}`} style={s.select} value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                          {['pending', 'processing', 'shipped', 'delivered'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
