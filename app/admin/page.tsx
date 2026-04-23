import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await ensureAdmin();

  const [pending, today, productCount, recent] = await Promise.all([
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.product.count({ where: { available: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { items: true },
    }),
  ]);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p>Fresh out of the oven — here's what's happening today.</p>
        </div>
        <div className="admin-actions">
          <Link className="admin-btn" href="/admin/orders">
            All orders
          </Link>
          <Link className="admin-btn admin-btn--primary" href="/admin/products/new">
            + Add pastry
          </Link>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat">
          <div className="admin-stat__label">Pending orders</div>
          <div className="admin-stat__value">{pending}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Orders today</div>
          <div className="admin-stat__value">{today}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Products on shelf</div>
          <div className="admin-stat__value">{productCount}</div>
        </div>
      </div>

      <div className="admin-header" style={{ marginTop: 8 }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 500 }}>Recent orders</h2>
        <Link className="mira-link" href="/admin/orders">
          See all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="admin-empty">No orders yet. Share your shop link to start receiving orders.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td>#{o.id.slice(-6).toUpperCase()}</td>
                <td>
                  <strong>{o.customerName}</strong>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{o.phone}</div>
                </td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>${o.total.toFixed(2)}</td>
                <td>
                  <span className={`admin-pill admin-pill--${o.status}`}>{o.status}</span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <Link className="admin-btn" href={`/admin/orders/${o.id}`}>
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
