import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await ensureAdmin();
  const status = searchParams.status;

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 200,
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} order{orders.length === 1 ? '' : 's'} shown.</p>
        </div>
        <div className="admin-actions">
          {filters.map((f) => {
            const active = (f.id === 'all' && !status) || status === f.id;
            return (
              <Link
                key={f.id}
                className={`admin-btn ${active ? 'admin-btn--primary' : ''}`}
                href={f.id === 'all' ? '/admin/orders' : `/admin/orders?status=${f.id}`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty">No orders match this filter yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id.slice(-6).toUpperCase()}</td>
                <td><strong>{o.customerName}</strong></td>
                <td>{o.phone}</td>
                <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                <td>${o.total.toFixed(2)}</td>
                <td><span className={`admin-pill admin-pill--${o.status}`}>{o.status}</span></td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <Link className="admin-btn" href={`/admin/orders/${o.id}`}>View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
