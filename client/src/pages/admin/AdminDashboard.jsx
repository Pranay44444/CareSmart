import { useState, useEffect } from 'react';
import {
  getAllOrders,
  updateOrderStatus,
  getProducts,
  createProduct,
  deleteProduct,
} from '../../services/api';
import { Settings, Package, ReceiptText, PlusCircle, Trash2 } from 'lucide-react';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-dark)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-cream)',
    padding: '32px 24px',
    paddingBottom: '100px',
  },
  wrap: { maxWidth: '1200px', margin: '0 auto' },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '8px',
    color: 'var(--text-cream)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '40px', padding: '6px', width: 'fit-content' },
  tab: (active) => ({
    padding: '12px 28px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    border: active ? '1px solid var(--gold-primary)' : '1px solid transparent',
    background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
    color: active ? 'var(--gold-primary)' : 'var(--text-muted)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
  card: { padding: '32px', marginBottom: '32px', display: 'flex', flexDirection: 'column' },
  cardTitle: {
    fontWeight: 600,
    fontSize: '1.25rem',
    marginBottom: '24px',
    color: 'var(--text-cream)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'Playfair Display, serif',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' },
  th: {
    textAlign: 'left',
    color: 'var(--gold-highlight)',
    fontWeight: 600,
    padding: '14px 16px',
    borderBottom: '1px solid var(--glass-border)',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    verticalAlign: 'middle',
    color: 'var(--text-cream)',
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.1)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  input: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    outline: 'none',
    marginBottom: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  label: {
    display: 'block',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginBottom: '8px',
    fontWeight: 500,
  },
  btn: {
    border: 'none',
    borderRadius: '8px',
    padding: '14px 28px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
    alignSelf: 'flex-start',
  },
  select: {
    background: 'var(--bg-dark)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: 'var(--text-cream)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none',
  },
  success: {
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid var(--gold-primary)',
    color: 'var(--gold-highlight)',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
};

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'smartphone',
  subCategory: '',
  stock: '',
  compatibleBrands: '',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [msg, setMsg] = useState('');

  const fetchProducts = () =>
    getProducts({ limit: 50 })
      .then((r) => setProducts(r.data.products))
      .catch(() => {});
  const fetchOrders = () =>
    getAllOrders()
      .then((r) => setOrders(r.data.orders))
      .catch(() => {});

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const setF = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await createProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        compatibleBrands: form.compatibleBrands
          ? form.compatibleBrands.split(',').map((b) => b.trim())
          : [],
      });
      setMsg('Product added to luxury catalog successfully.');
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create product.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from catalog?`)) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status).catch(() => {});
    fetchOrders();
  };

  const inputStyle = { ...s.input, width: '100%' };
  const gridTwo = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: '16px',
  };

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title} className="font-playfair">
          <Settings size={32} color="var(--gold-primary)" /> Admin Central
        </div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.05rem' }}>
          Manage products and orders to maintain the premium experience.
        </div>

        <div style={s.tabs} className="glass-panel">
          <button
            id="tab-products"
            style={s.tab(tab === 'products')}
            onClick={() => setTab('products')}
          >
            <Package size={18} /> Products
          </button>
          <button id="tab-orders" style={s.tab(tab === 'orders')} onClick={() => setTab('orders')}>
            <ReceiptText size={18} /> Orders
          </button>
        </div>

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <>
            {/* Add Product Form */}
            <div style={s.card} className="glass-panel skeuo-shadow">
              <div style={s.cardTitle}>
                <PlusCircle color="var(--gold-primary)" /> Add New Product
              </div>
              {msg && <div style={s.success}>{msg}</div>}
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={gridTwo}>
                  <div>
                    <label style={s.label}>Article Name</label>
                    <input
                      id="prod-name"
                      style={inputStyle}
                      value={form.name}
                      onChange={setF('name')}
                      required
                    />
                  </div>
                  <div>
                    <label style={s.label}>Price (₹)</label>
                    <input
                      id="prod-price"
                      style={inputStyle}
                      type="number"
                      step="1"
                      value={form.price}
                      onChange={setF('price')}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Description</label>
                  <input
                    id="prod-desc"
                    style={inputStyle}
                    value={form.description}
                    onChange={setF('description')}
                    required
                  />
                </div>
                <div style={gridTwo}>
                  <div>
                    <label style={s.label}>Category</label>
                    <select
                      id="prod-cat"
                      style={{
                        ...s.select,
                        width: '100%',
                        marginBottom: '16px',
                        padding: '12px 14px',
                      }}
                      value={form.category}
                      onChange={setF('category')}
                    >
                      <option value="smartphone">Smartphone Accessory</option>
                      <option value="laptop">Laptop Accessory</option>
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Sub-Category</label>
                    <input
                      id="prod-subcat"
                      style={inputStyle}
                      value={form.subCategory}
                      onChange={setF('subCategory')}
                    />
                  </div>
                </div>
                <div style={gridTwo}>
                  <div>
                    <label style={s.label}>Initial Stock</label>
                    <input
                      id="prod-stock"
                      style={inputStyle}
                      type="number"
                      value={form.stock}
                      onChange={setF('stock')}
                      required
                    />
                  </div>
                  <div>
                    <label style={s.label}>Compatible Brands (comma-separated)</label>
                    <input
                      id="prod-brands"
                      style={inputStyle}
                      value={form.compatibleBrands}
                      onChange={setF('compatibleBrands')}
                    />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Image URL (High-Res Optional)</label>
                  <input
                    id="prod-image"
                    style={inputStyle}
                    value={form.image || ''}
                    onChange={setF('image')}
                  />
                </div>
                <button id="create-product" style={s.btn} type="submit" className="shimmer-cta">
                  Publish to Catalog
                </button>
              </form>
            </div>

            {/* Products Table */}
            <div style={s.card} className="glass-panel skeuo-shadow">
              <div style={s.cardTitle}>
                <Package color="var(--gold-primary)" /> Catalog ({products.length})
              </div>
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
                        <td style={{ ...s.td, fontWeight: 500 }}>{p.name}</td>
                        <td style={s.td}>
                          <span
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.85rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: 'var(--gold-primary)', fontWeight: 600 }}>
                          ₹{((p.price || 0) * 83).toFixed(0)}
                        </td>
                        <td style={s.td}>{p.stock}</td>
                        <td style={{ ...s.td, color: 'var(--gold-highlight)' }}>
                          {p.ratings > 0 ? `★ ${p.ratings}` : '—'}
                        </td>
                        <td style={s.td}>
                          <button
                            id={`delete-${p._id}`}
                            style={s.deleteBtn}
                            onClick={() => handleDelete(p._id, p.name)}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
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
          <div style={s.card} className="glass-panel skeuo-shadow">
            <div style={s.cardTitle}>
              <ReceiptText color="var(--gold-primary)" /> Incoming Orders ({orders.length})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Order Ref</th>
                    <th style={s.th}>Client</th>
                    <th style={s.th}>Items</th>
                    <th style={s.th}>Total</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td
                        style={{ ...s.td, fontFamily: 'monospace', color: 'var(--gold-highlight)' }}
                        title={o._id}
                      >
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 500 }}>{o.user?.name || '—'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {o.user?.email}
                        </div>
                      </td>
                      <td style={s.td}>{o.items?.length} item(s)</td>
                      <td style={{ ...s.td, fontWeight: 700, color: 'var(--gold-primary)' }}>
                        ₹{((o.totalPrice || 0) * 83).toFixed(0)}
                      </td>
                      <td style={s.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={s.td}>
                        <select
                          id={`status-${o._id}`}
                          style={s.select}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        >
                          {['pending', 'processing', 'shipped', 'delivered'].map((st) => (
                            <option key={st} value={st}>
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </option>
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
