import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';
import { ProductForm } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  await ensureAdmin();
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
  ]);
  if (!product) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <Link className="mira-link" href="/admin/products">← Back</Link>
          <h1>Edit {product.name}</h1>
          <p>Changes appear on the shop immediately.</p>
        </div>
      </div>
      <div className="admin-card">
        <ProductForm product={product} categories={categories} />
      </div>
    </>
  );
}
