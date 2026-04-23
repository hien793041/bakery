import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';
import { DeleteCategoryButton } from './DeleteCategoryButton';
import { ActiveToggle } from './ActiveToggle';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  await ensureAdmin();
  const rows = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Categories</h1>
          <p>
            {rows.length} categor{rows.length === 1 ? 'y' : 'ies'} · controls the filter bar on the
            shop.
          </p>
        </div>
        <div className="admin-actions">
          <Link className="admin-btn admin-btn--primary" href="/admin/categories/new">
            + Add category
          </Link>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="admin-empty">
          No categories yet. <Link href="/admin/categories/new">Add the first one →</Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Sort</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>
                  <code style={{ fontSize: 12 }}>/{c.slug}</code>
                </td>
                <td>{c._count.products}</td>
                <td>{c.sortOrder}</td>
                <td>
                  <ActiveToggle id={c.id} active={c.active} />
                </td>
                <td>
                  <div className="admin-actions">
                    <Link className="admin-btn" href={`/admin/categories/${c.id}`}>
                      Edit
                    </Link>
                    <DeleteCategoryButton
                      id={c.id}
                      name={c.name}
                      productCount={c._count.products}
                    />
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
