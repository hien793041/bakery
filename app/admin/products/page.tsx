import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';
import { DeleteButton } from './DeleteButton';
import { AvailabilityToggle } from './AvailabilityToggle';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  await ensureAdmin();
  const products = await prisma.product.findMany({
    orderBy: [{ available: 'desc' }, { createdAt: 'asc' }],
    include: { category: true },
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Products</h1>
          <p>{products.length} item{products.length === 1 ? '' : 's'} in the catalog.</p>
        </div>
        <div className="admin-actions">
          <Link className="admin-btn admin-btn--primary" href="/admin/products/new">
            + Add pastry
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="admin-empty">
          No pastries yet. <Link href="/admin/products/new">Add the first one →</Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="admin-thumb" style={{ background: p.discColor }}>
                    <img src={p.image} alt="" />
                  </div>
                </td>
                <td>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>/{p.slug}</div>
                </td>
                <td>{p.category.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>
                  <AvailabilityToggle id={p.id} available={p.available} />
                </td>
                <td>
                  <div className="admin-actions">
                    <Link className="admin-btn" href={`/admin/products/${p.id}`}>Edit</Link>
                    <DeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
