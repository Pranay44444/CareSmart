import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';

import { MapPin, PackageOpen, ReceiptText } from 'lucide-react';

const statusColors = {
  pending:    { bg: 'var(--color-status-pending-bg)',    color: 'var(--color-status-pending-text)',    border: 'var(--color-status-pending-border)' },
  processing: { bg: 'var(--color-status-processing-bg)', color: 'var(--color-status-processing-text)', border: 'var(--color-status-processing-border)' },
  shipped:    { bg: 'var(--color-status-shipped-bg)',    color: 'var(--color-status-shipped-text)',    border: 'var(--color-status-shipped-border)' },
  delivered:  { bg: 'var(--color-status-delivered-bg)',  color: 'var(--color-status-delivered-text)',  border: 'var(--color-status-delivered-border)' },
};

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg-base)',
    fontFamily: 'Inter, sans-serif',
    color: 'var(--color-text-heading)',
    padding: '48px 24px',
  },
  wrap: { maxWidth: '860px', margin: '0 auto' },
  title: {
    fontSize: '1.75rem',
    fontWeight: 800,
    marginBottom: '32px',
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  card: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '12px',
    padding: '22px 24px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-subtle)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
  },
  orderId: { fontWeight: 700, fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-action-primary)' },
  date: { color: 'var(--color-text-body)', fontSize: '0.82rem', marginTop: '2px' },
  total: { fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--color-border-subtle)',
    fontSize: '0.9rem',
  },
  itemName: { color: 'var(--color-text-heading)', fontWeight: 500 },
  itemMeta: { color: 'var(--color-text-body)' },
  empty: { textAlign: 'center', color: 'var(--color-text-body)', padding: '80px 0', fontSize: '1.05rem' },
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
        <div style={s.title}>
          <PackageOpen size={28} color="var(--color-action-primary)" /> Order History
        </div>
        {loading && (
          <div style={{ color: 'var(--color-text-body)', textAlign: 'center', paddingTop: '60px' }}>
            Loading orders…
          </div>
        )}
        {!loading && orders.length === 0 && (
          <div style={s.empty}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <ReceiptText size={56} color="var(--color-border-subtle)" />
            </div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-label)' }}>No orders yet.</div>
            <a
              href="/products"
              style={{
                color: 'var(--color-action-primary)',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'block',
                marginTop: '14px',
              }}
            >
              Start Shopping →
            </a>
          </div>
        )}
        {orders.map((order) => (
          <div key={order._id} style={s.card}>
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
                  marginTop: '14px',
                  color: 'var(--color-text-body)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MapPin size={14} color="var(--color-action-primary)" /> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
