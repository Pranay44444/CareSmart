import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-dark)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-cream)',
    paddingBottom: '64px',
  },
  header: {
    padding: '32px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: { fontSize: '2rem', fontWeight: 600, color: 'var(--text-cream)' },
  filters: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  select: {
    background: 'var(--bg-dark)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  input: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-cream)',
    fontSize: '0.95rem',
    outline: 'none',
    width: '260px',
    transition: 'border-color 0.2s',
  },
  main: { padding: '0 24px', maxWidth: '1200px', margin: '0 auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '32px',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '100px 24px',
    fontSize: '1.2rem',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--gold-highlight)',
    padding: '100px 24px',
    fontSize: '1.1rem',
  },
};

import { Search, PlusCircle } from 'lucide-react';
export default function Products() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    const params = { limit: 20 };
    if (category) params.category = category;
    if (search) params.search = search;
    getProducts(params)
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleAdminDelete = async (id, name) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch {
      alert(`Failed to delete "${name}".`);
    }
  };

  const handleAdminEdit = (product) => {
    navigate('/admin?tab=products', { state: { editProduct: product } });
  };

  return (
    <div style={s.page}>
      {/* Admin banner */}
      {isAdmin && (
        <div
          style={{
            background: 'rgba(201,168,76,0.06)',
            borderBottom: '1px solid rgba(201,168,76,0.15)',
            padding: '12px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span style={{ color: 'var(--gold-highlight)', fontWeight: 600, fontSize: '0.9rem' }}>
              Admin Catalog View — edit or remove products directly from cards below.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate('/admin?tab=products')}
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'var(--gold-highlight)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <PlusCircle size={15} /> Add New Product
              </button>
              <button
                onClick={() => navigate('/admin')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={s.header}>
        <div>
          <div style={s.title} className="font-playfair">
            {isAdmin ? 'Catalog Management' : 'Luxury Catalog'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            {isAdmin
              ? `${products.length} products in catalog — edit or remove as needed.`
              : `${products.length} exclusive items tailored to you.`}
          </div>
        </div>
        <div style={s.filters}>
          <select
            id="filter-category"
            style={s.select}
            className="gold-glow"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="smartphone">Smartphone Cases & Wraps</option>
            <option value="laptop">Laptop Sleeves & Docks</option>
          </select>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <input
                id="search-input"
                style={s.input}
                className="gold-glow"
                placeholder="Search accessories…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              style={{ ...s.select, padding: '12px 20px', display: 'flex', alignItems: 'center' }}
              className="shimmer-cta"
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      <div style={s.main}>
        {loading ? (
          <div style={s.loading}>⏳ Loading products…</div>
        ) : products.length === 0 ? (
          <div style={s.empty}>😔 No products found. Try a different filter.</div>
        ) : (
          <div style={s.grid}>
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onDelete={handleAdminDelete}
                onEdit={handleAdminEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
