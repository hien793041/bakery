import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';
import { ProductForm } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await ensureAdmin();
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return (
    <>
      <div className="admin-header">
        <div>
          <Link className="mira-link" href="/admin/products">← Back</Link>
          <h1>Add a new pastry</h1>
          <p>Describe the item; it will appear on the shop when marked available.</p>
        </div>
      </div>
      <div className="admin-card">
        <ProductForm categories={categories} />
      </div>
    </>
  );
}
