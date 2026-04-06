import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';

import { MapPin, PackageOpen, ReceiptText } from 'lucide-react';

const statusColors = {
  pending: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  processing: {
    bg: 'rgba(201,168,76,0.15)',
    color: 'var(--gold-highlight)',
    border: 'rgba(201,168,76,0.3)',
  },
  shipped: { bg: 'rgba(167,139,250,0.1)', color: '#d8b4fe', border: 'rgba(167,139,250,0.2)' },
  delivered: { bg: 'rgba(74,222,128,0.1)', color: '#86efac', border: 'rgba(74,222,128,0.2)' },
};

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-dark)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--text-cream)',
    padding: '64px 24px',
  },
  wrap: { maxWidth: '900px', margin: '0 auto' },
  title: {
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '40px',
    color: 'var(--text-cream)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  card: { padding: '24px', marginBottom: '24px' },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  orderId: {
    fontWeight: 600,
    fontFamily: 'monospace',
    fontSize: '0.95rem',
    color: 'var(--gold-primary)',
  },
  date: { color: 'var(--text-muted)', fontSize: '0.85rem' },
  total: {
    fontSize: '1.4rem',
    fontWeight: 600,
    color: 'var(--text-cream)',
    fontFamily: 'Playfair Display, serif',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--glass-border)',
    fontSize: '0.95rem',
  },
  itemName: { color: 'var(--text-cream)', fontWeight: 500 },
  itemMeta: { color: 'var(--text-muted)' },
  empty: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '100px 0',
    fontSize: '1.1rem',
  },
};

const StatusBadge = ({ status }) => {
  const c = statusColors[status] || statusColors.pending;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: '6px',
        padding: '6px 14px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}
    >
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
        <div style={s.title} className="font-playfair">
          <PackageOpen size={32} color="var(--gold-primary)" /> Order History
        </div>
        {loading && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: '60px' }}>
            Retrieving timeline…
          </div>
        )}
        {!loading && orders.length === 0 && (
          <div style={s.empty}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <ReceiptText size={64} color="var(--glass-border)" />
            </div>
            <div>Your timeline is completely empty.</div>
            <a
              href="/products"
              style={{
                color: 'var(--gold-highlight)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'block',
                marginTop: '16px',
              }}
            >
              Start Shopping →
            </a>
          </div>
        )}
        {orders.map((order) => (
          <div key={order._id} style={s.card} className="glass-panel skeuo-shadow">
            <div style={s.cardHeader}>
              <div>
                <div style={s.orderId}>#{order._id.slice(-8).toUpperCase()}</div>
                <div style={s.date}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <StatusBadge status={order.status} />
              <div style={s.total}>₹{((order.totalPrice || 0) * 83).toFixed(0)}</div>
            </div>
            {order.items?.map((item, i) => (
              <div key={i} style={s.itemRow}>
                <span style={s.itemName}>{item.name}</span>
                <span style={s.itemMeta}>
                  x{item.qty} &bull; ₹{(item.price * item.qty * 83).toFixed(0)}
                </span>
              </div>
            ))}
            {order.shippingAddress && (
              <div
                style={{
                  marginTop: '16px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MapPin size={16} color="var(--gold-highlight)" /> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
