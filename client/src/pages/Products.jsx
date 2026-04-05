import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', color: '#e2e8f0' },
  header: { background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  filters: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  select: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none', width: '220px' },
  main: { padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', color: '#e2e8f0', display: 'block', transition: 'transform 0.2s, border-color 0.2s' },
  imgBox: { height: '180px', background: 'linear-gradient(135deg, #1e293b, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' },
  cardBody: { padding: '20px' },
  cardName: { fontWeight: 700, fontSize: '1rem', marginBottom: '8px' },
  badge: { display: 'inline-block', background: 'rgba(99,179,237,0.15)', color: '#63b3ed', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '10px' },
  price: { fontSize: '1.3rem', fontWeight: 800, color: '#60a5fa' },
  stock: { fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' },
  loading: { textAlign: 'center', color: '#94a3b8', padding: '80px', fontSize: '1.1rem' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '80px' },
  navLink: { color: '#63b3ed', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
};

const categoryIcon = { smartphone: '📱', laptop: '💻' };

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
          <div style={s.title}>CareSmart</div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{products.length} products found</div>
        </div>
        <div style={s.filters}>
          <select id="filter-category" style={s.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="smartphone">📱 Smartphone</option>
            <option value="laptop">💻 Laptop</option>
          </select>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input id="search-input" style={s.input} placeholder="Search accessories…" value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)} />
            <button type="submit" style={{ ...s.select, cursor: 'pointer', background: 'rgba(99,179,237,0.15)', color: '#63b3ed' }}>Go</button>
          </form>
          <Link to="/" style={s.navLink}>← Home</Link>
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
