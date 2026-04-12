import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
    paddingBottom: '64px',
  },
  header: {
    padding: '32px 24px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  select: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-label)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    width: '200px',
    height: '44px',
    boxSizing: 'border-box',
  },
  input: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-strong)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-heading)',
    fontSize: '0.9rem',
    outline: 'none',
    width: '240px',
    height: '44px',
    boxSizing: 'border-box',
  },
  main: { padding: '0 24px', maxWidth: '1200px', margin: '0 auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--color-text-body)',
    padding: '100px 24px',
    fontSize: '1.1rem',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--color-action-primary)',
    padding: '100px 24px',
    fontSize: '1.05rem',
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

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { limit: 20 };
    if (category) params.category = category;
    if (search) params.search = search;
    getProducts(params)
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
            background: 'var(--color-action-tint-bg)',
            borderBottom: '1px solid var(--color-action-tint-border)',
            padding: '10px 24px',
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
            <span style={{ color: 'var(--color-action-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
              Admin Catalog View — edit or remove products directly from cards below.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate('/admin?tab=products')}
                className="shimmer-cta"
                style={{
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <PlusCircle size={15} /> Add Product
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="btn-outline"
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'var(--color-text-label)',
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
          <div style={{ color: 'var(--color-text-body)', fontSize: '0.9rem', marginTop: '4px' }}>
            {isAdmin
              ? `${products.length} products in catalog — edit or remove as needed.`
              : `${products.length} exclusive items tailored to you.`}
          </div>
        </div>
        <div style={s.filters}>
          <select
            id="filter-category"
            style={s.select}
            className="input-field"
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
                className="input-field"
                placeholder="Search accessories…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              style={{ ...s.select, width: 'auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
