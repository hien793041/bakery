import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';
import { ORDER_STATUSES } from '@/lib/types';
import { StatusControl } from './StatusControl';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  await ensureAdmin();
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <Link className="mira-link" href="/admin/orders">← Back to orders</Link>
          <h1>Order #{order.id.slice(-6).toUpperCase()}</h1>
          <p>Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <span className={`admin-pill admin-pill--${order.status}`}>{order.status}</span>
        </div>
      </div>

      <div className="admin-order-detail">
        <div className="admin-card">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, marginBottom: 16 }}>Items</h3>
          <ul className="admin-order-detail__items">
            {order.items.map((i) => (
              <li key={i.id}>
                <span>
                  {i.qty}× <strong>{i.productName}</strong>
                </span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </li>
            ))}
            <li style={{ fontWeight: 600, paddingTop: 14 }}>
              <span>Total</span>
              <span style={{ color: 'var(--terra-500)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20 }}>
                ${order.total.toFixed(2)}
              </span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, marginBottom: 16 }}>Customer</h3>
            <ul className="admin-info-list">
              <li><strong>Name</strong>{order.customerName}</li>
              <li><strong>Phone</strong><a href={`tel:${order.phone}`}>{order.phone}</a></li>
              {order.email && <li><strong>Email</strong><a href={`mailto:${order.email}`}>{order.email}</a></li>}
              <li><strong>Address</strong>{order.address}</li>
              {order.note && <li><strong>Note</strong>{order.note}</li>}
            </ul>
          </div>

          <div className="admin-card">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, marginBottom: 12 }}>Update status</h3>
            <StatusControl id={order.id} current={order.status} options={[...ORDER_STATUSES]} />
          </div>
        </div>
      </div>
    </>
  );
}
