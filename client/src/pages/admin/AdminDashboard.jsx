import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {
  getAllOrders,
  updateOrderStatus,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/api';
import {
  Settings,
  Package,
  ReceiptText,
  PlusCircle,
  Trash2,
  Pencil,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Clock,
} from 'lucide-react';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
    padding: '32px 24px',
    paddingBottom: '100px',
  },
  wrap: { maxWidth: '1200px', margin: '0 auto' },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '6px',
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '32px',
    background: 'var(--color-bg-surface)',
    padding: '4px',
    borderRadius: '10px',
    width: 'fit-content',
  },
  tab: (active) => ({
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    border: 'none',
    background: active ? 'var(--color-bg-card)' : 'transparent',
    color: active ? 'var(--color-action-primary)' : 'var(--color-text-body)',
    transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    boxShadow: active ? 'var(--shadow-subtle)' : 'none',
  }),
  card: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '28px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-subtle)',
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: '1.1rem',
    marginBottom: '20px',
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: {
    textAlign: 'left',
    color: 'var(--color-text-body)',
    fontWeight: 600,
    padding: '12px 14px',
    borderBottom: '1px solid var(--color-border-subtle)',
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid var(--color-border-subtle)',
    verticalAlign: 'middle',
    color: 'var(--color-text-heading)',
  },
  deleteBtn: {
    background: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1px solid var(--color-error-border)',
    borderRadius: '7px',
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 500,
  },
  editBtn: {
    background: 'var(--color-action-tint-bg)',
    color: 'var(--color-action-primary)',
    border: '1px solid var(--color-action-tint-border)',
    borderRadius: '7px',
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 500,
  },
  input: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '14px',
    boxSizing: 'border-box',
  },
  label: { display: 'block', color: 'var(--color-text-label)', fontSize: '0.82rem', marginBottom: '6px', fontWeight: 500 },
  btn: {
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
    alignSelf: 'flex-start',
  },
  select: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '7px',
    padding: '7px 11px',
    color: 'var(--color-text-label)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none',
  },
  success: {
    background: 'var(--color-success-bg)',
    border: '1px solid var(--color-success-border)',
    color: 'var(--color-success)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '20px',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    padding: '22px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: 'var(--shadow-subtle)',
  },
  statLabel: { color: 'var(--color-text-body)', fontSize: '0.82rem', fontWeight: 500 },
  statValue: { color: 'var(--color-action-primary)', fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  statSub: { color: 'var(--color-text-muted)', fontSize: '0.78rem' },
};

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'smartphone',
  subCategory: '',
  stock: '',
  compatibleBrands: '',
  image: '',
};

const statusColors = {
  pending:    'var(--color-status-pending-bg)',
  processing: 'var(--color-status-processing-bg)',
  shipped:    'var(--color-status-shipped-bg)',
  delivered:  'var(--color-status-delivered-bg)',
};
const statusBorderColors = {
  pending:    'var(--color-status-pending-border)',
  processing: 'var(--color-status-processing-border)',
  shipped:    'var(--color-status-shipped-border)',
  delivered:  'var(--color-status-delivered-border)',
};
const statusTextColors = {
  pending:    'var(--color-status-pending-text)',
  processing: 'var(--color-status-processing-text)',
  shipped:    'var(--color-status-shipped-text)',
  delivered:  'var(--color-status-delivered-text)',
};

const VALID_TABS = ['overview', 'products', 'orders'];

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab is driven by ?tab= URL param; defaults to 'overview'
  const rawTab = searchParams.get('tab');
  const tab = VALID_TABS.includes(rawTab) ? rawTab : 'overview';
  const setTab = (t) => setSearchParams(t === 'overview' ? {} : { tab: t });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgOk, setMsgOk] = useState(true);

  const fetchProducts = () =>
    getProducts({ limit: 50 })
      .then((r) => setProducts(r.data.products))
      .catch(() => {});
  const fetchOrders = () =>
    getAllOrders()
      .then((r) => {
        setOrders(r.data.orders);
        setOrdersError(false);
      })
      .catch(() => setOrdersError(true));

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // If navigated from Products page with an edit target
  useEffect(() => {
    const ep = location.state?.editProduct;
    if (ep) {
      startEdit(ep);
      // Clear state without wiping the URL (?tab=products stays intact)
      navigate(location.pathname + location.search, { replace: true, state: null });
    }
  }, [location.state, location.pathname, location.search, navigate]);

  const setF = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? String(Math.round(product.price * 83)) : '',
      category: product.category || 'smartphone',
      subCategory: product.subCategory || '',
      stock: product.stock !== undefined ? String(product.stock) : '',
      compatibleBrands: (product.compatibleBrands || []).join(', '),
      image: product.image || '',
    });
    setMsg('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMsg('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    const priceInUSD = parseFloat(form.price) / 83;
    try {
      if (editingId) {
        await updateProduct(editingId, {
          ...form,
          price: priceInUSD,
          stock: parseInt(form.stock, 10),
          compatibleBrands: form.compatibleBrands
            ? form.compatibleBrands.split(',').map((b) => b.trim())
            : [],
        });
        setMsgOk(true);
        setMsg('Product updated successfully.');
        setEditingId(null);
      } else {
        await createProduct({
          ...form,
          price: priceInUSD,
          stock: parseInt(form.stock, 10),
          compatibleBrands: form.compatibleBrands
            ? form.compatibleBrands.split(',').map((b) => b.trim())
            : [],
        });
        setMsgOk(true);
        setMsg('Product added to catalog successfully.');
      }
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (err) {
      setMsgOk(false);
      setMsg(err.response?.data?.message || 'Operation failed.');
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

  // Stats derived from loaded data
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0) * 83, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title} className="font-playfair">
          <Settings size={32} color="var(--color-action-primary)" /> Admin Central
        </div>
        <div style={{ color: 'var(--color-text-body)', marginBottom: '32px', fontSize: '1.05rem' }}>
          Manage products and orders from one place.
        </div>

        <div style={s.tabs}>
          <button style={s.tab(tab === 'overview')} onClick={() => setTab('overview')}>
            <BarChart3 size={18} /> Overview
          </button>
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

        {/* ── Overview Tab ── */}
        {tab === 'overview' && (
          <>
            <div style={s.statGrid}>
              <div style={s.statCard}>
                <TrendingUp size={22} color="var(--color-action-primary)" />
                <div style={s.statLabel}>Total Revenue</div>
                <div style={s.statValue}>₹{totalRevenue.toFixed(0)}</div>
                <div style={s.statSub}>from {orders.length} orders</div>
              </div>
              <div style={s.statCard}>
                <Package size={22} color="var(--color-action-primary)" />
                <div style={s.statLabel}>Products in Catalog</div>
                <div style={s.statValue}>{products.length}</div>
                <div style={s.statSub}>
                  {outOfStock > 0 ? (
                    <span style={{ color: 'var(--color-error)' }}>{outOfStock} out of stock</span>
                  ) : (
                    'all in stock'
                  )}
                </div>
              </div>
              <div style={s.statCard}>
                <ShoppingBag size={22} color="var(--color-action-primary)" />
                <div style={s.statLabel}>Total Orders</div>
                <div style={s.statValue}>{orders.length}</div>
                <div style={s.statSub}>all time</div>
              </div>
              <div style={s.statCard}>
                <Clock size={22} color="var(--color-action-primary)" />
                <div style={s.statLabel}>Pending Orders</div>
                <div
                  style={{
                    ...s.statValue,
                    color: pendingOrders > 0 ? 'var(--color-warning)' : 'var(--color-action-primary)',
                  }}
                >
                  {pendingOrders}
                </div>
                <div style={s.statSub}>awaiting fulfillment</div>
              </div>
            </div>

            {/* Recent Orders preview */}
            <div style={s.card}>
              <div style={s.cardTitle}>
                <ReceiptText color="var(--color-action-primary)" /> Recent Orders
              </div>
              {ordersError && (
                <div
                  style={{
                    background: 'var(--color-error-bg)',
                    border: '1px solid var(--color-error-border)',
                    color: 'var(--color-error)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '0.9rem',
                  }}
                >
                  Failed to load orders. Check your connection or re-login.
                </div>
              )}
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Order Ref</th>
                      <th style={s.th}>Client</th>
                      <th style={s.th}>Total</th>
                      <th style={s.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o._id}>
                        <td
                          style={{
                            ...s.td,
                            fontFamily: 'monospace',
                            color: 'var(--color-action-primary)',
                          }}
                        >
                          #{o._id.slice(-8).toUpperCase()}
                        </td>
                        <td style={s.td}>{o.user?.name || '—'}</td>
                        <td style={{ ...s.td, fontWeight: 700, color: 'var(--color-action-primary)' }}>
                          ₹{((o.totalPrice || 0) * 83).toFixed(0)}
                        </td>
                        <td style={s.td}>
                          <span
                            style={{
                              background: statusColors[o.status] || 'var(--color-bg-surface)',
                              color: statusTextColors[o.status] || 'var(--color-text-body)',
                              border: `1px solid ${statusBorderColors[o.status] || 'var(--color-border-subtle)'}`,
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orders.length > 5 && (
                <button
                  className="btn-outline"
                  style={{ ...s.editBtn, marginTop: '16px', alignSelf: 'flex-start' }}
                  onClick={() => setTab('orders')}
                >
                  View all {orders.length} orders →
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <>
            {/* Add / Edit Product Form */}
            <div style={s.card}>
              <div style={s.cardTitle}>
                {editingId ? (
                  <>
                    <Pencil color="var(--color-action-primary)" /> Edit Product
                  </>
                ) : (
                  <>
                    <PlusCircle color="var(--color-action-primary)" /> Add New Product
                  </>
                )}
              </div>
              {msg && (
                <div
                  style={{
                    ...s.success,
                    background: msgOk ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                    border: `1px solid ${msgOk ? 'var(--color-success-border)' : 'var(--color-error-border)'}`,
                    color: msgOk ? 'var(--color-success)' : 'var(--color-error)',
                  }}
                >
                  {msg}
                </div>
              )}
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={gridTwo}>
                  <div>
                    <label style={s.label}>Article Name</label>
                    <input
                      id="prod-name"
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field"
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
                      className="input-field"
                      style={inputStyle}
                      value={form.subCategory}
                      onChange={setF('subCategory')}
                    />
                  </div>
                </div>
                <div style={gridTwo}>
                  <div>
                    <label style={s.label}>Stock</label>
                    <input
                      id="prod-stock"
                      className="input-field"
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
                      className="input-field"
                      style={inputStyle}
                      value={form.compatibleBrands}
                      onChange={setF('compatibleBrands')}
                    />
                  </div>
                </div>
                <div>
                  <label style={s.label}>Image URL (Optional)</label>
                  <input
                    id="prod-image"
                    style={inputStyle}
                    value={form.image}
                    onChange={setF('image')}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button id="create-product" style={s.btn} type="submit" className="shimmer-cta">
                    {editingId ? 'Save Changes' : 'Publish to Catalog'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn-outline"
                      style={{
                        ...s.btn,
                        background: 'transparent',
                        border: '1px solid var(--color-border-subtle)',
                        color: 'var(--color-text-body)',
                      }}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products Table */}
            <div style={s.card}>
              <div style={s.cardTitle}>
                <Package color="var(--color-action-primary)" /> Catalog ({products.length})
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
                      <th style={s.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr
                        key={p._id}
                        style={{
                          background: editingId === p._id ? 'var(--color-action-tint-bg)' : 'transparent',
                        }}
                      >
                        <td style={{ ...s.td, fontWeight: 500 }}>{p.name}</td>
                        <td style={s.td}>
                          <span
                            style={{
                              color: 'var(--color-text-body)',
                              fontSize: '0.85rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: 'var(--color-action-primary)', fontWeight: 600 }}>
                          ₹{((p.price || 0) * 83).toFixed(0)}
                        </td>
                        <td style={s.td}>
                          <span style={{ color: p.stock === 0 ? 'var(--color-error)' : 'var(--color-text-heading)' }}>
                            {p.stock === 0 ? 'Out of stock' : p.stock}
                          </span>
                        </td>
                        <td style={{ ...s.td, color: 'var(--color-star)' }}>
                          {p.ratings > 0 ? `★ ${p.ratings}` : '—'}
                        </td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-outline"
                              style={s.editBtn}
                              onClick={() => {
                                startEdit(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              id={`delete-${p._id}`}
                              className="btn-danger"
                              style={s.deleteBtn}
                              onClick={() => handleDelete(p._id, p.name)}
                            >
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
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
            <div style={s.cardTitle}>
              <ReceiptText color="var(--color-action-primary)" /> All Orders ({orders.length})
            </div>
            {ordersError && (
              <div
                style={{
                  background: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  color: 'var(--color-error)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  fontSize: '0.9rem',
                }}
              >
                Failed to load orders. Check your connection or re-login.
              </div>
            )}
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
                        style={{ ...s.td, fontFamily: 'monospace', color: 'var(--color-action-primary)' }}
                        title={o._id}
                      >
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 500 }}>{o.user?.name || '—'}</div>
                        <div style={{ color: 'var(--color-text-body)', fontSize: '0.85rem' }}>
                          {o.user?.email}
                        </div>
                      </td>
                      <td style={s.td}>{o.items?.length} item(s)</td>
                      <td style={{ ...s.td, fontWeight: 700, color: 'var(--color-action-primary)' }}>
                        ₹{((o.totalPrice || 0) * 83).toFixed(0)}
                      </td>
                      <td style={s.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={s.td}>
                        <select
                          id={`status-${o._id}`}
                          className="input-field"
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
