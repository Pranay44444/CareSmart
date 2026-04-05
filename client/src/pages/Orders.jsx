import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';

const statusColors = {
  pending:    { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  processing: { bg: 'rgba(99,179,237,0.15)',  color: '#63b3ed', border: 'rgba(99,179,237,0.3)' },
  shipped:    { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
  delivered:  { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
};

const s = {
  page: { minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', color: '#e2e8f0', padding: '32px 24px' },
  wrap: { maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '32px', background: 'linear-gradient(135deg, #e2e8f0, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', marginBottom: '16px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' },
  orderId: { fontWeight: 700, fontSize: '0.85rem', color: '#94a3b8' },
  date: { color: '#94a3b8', fontSize: '0.85rem' },
  total: { fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa' },
  itemRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' },
  itemName: { color: '#e2e8f0' },
  itemMeta: { color: '#94a3b8' },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '80px 0', fontSize: '1.1rem' },
};

const StatusBadge = ({ status }) => {
  const c = statusColors[status] || statusColors.pending;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
      {status?.toUpperCase()}
    </span>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.title}>📦 My Orders</div>
        {loading && <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '60px' }}>Loading…</div>}
        {!loading && orders.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
            <div>No orders yet.</div>
            <a href="/products" style={{ color: '#63b3ed', textDecoration: 'none', fontWeight: 600, display: 'block', marginTop: '12px' }}>Start Shopping →</a>
          </div>
        )}
        {orders.map((order) => (
          <div key={order._id} style={s.card}>
            <div style={s.cardHeader}>
              <div>
                <div style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</div>
                <div style={s.date}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              </div>
              <StatusBadge status={order.status} />
              <div style={s.total}>${order.totalPrice?.toFixed(2)}</div>
            </div>
            {order.items?.map((item, i) => (
              <div key={i} style={s.itemRow}>
                <span style={s.itemName}>{item.name}</span>
                <span style={s.itemMeta}>x{item.qty} · ${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            {order.shippingAddress && (
              <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.8rem' }}>
                📍 {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
