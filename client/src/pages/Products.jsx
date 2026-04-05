import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const s = {
  page: { minHeight: '100vh', background: 'var(--bg-dark)', fontFamily: 'Inter, sans-serif', color: 'var(--text-cream)', paddingBottom: '64px' },
  header: { padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: 600, color: 'var(--text-cream)' },
  filters: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  select: { background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 16px', color: 'var(--text-cream)', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' },
  input: { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px 16px', color: 'var(--text-cream)', fontSize: '0.95rem', outline: 'none', width: '260px', transition: 'border-color 0.2s' },
  main: { padding: '0 24px', maxWidth: '1200px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' },
  loading: { textAlign: 'center', color: 'var(--text-muted)', padding: '100px 24px', fontSize: '1.2rem' },
  empty: { textAlign: 'center', color: 'var(--gold-highlight)', padding: '100px 24px', fontSize: '1.1rem' },
};

import { Search } from 'lucide-react';
export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { limit: 20 };
    if (category) params.category = category;
    if (search) params.search = search;
    getProducts(params)
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title} className="font-playfair">Luxury Catalog</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>{products.length} exclusive items tailored to you.</div>
        </div>
        <div style={s.filters}>
          <select id="filter-category" style={s.select} className="gold-glow" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="smartphone">Smartphone Cases & Wraps</option>
            <option value="laptop">Laptop Sleeves & Docks</option>
          </select>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <input id="search-input" style={s.input} className="gold-glow" placeholder="Search accessories…" value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            <button type="submit" style={{ ...s.select, padding: '12px 20px', display: 'flex', alignItems: 'center' }} className="shimmer-cta"><Search size={16}/></button>
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
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
