import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ensureAdmin } from '@/lib/adminGuard';
import { CategoryForm } from '../CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  await ensureAdmin();
  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category) notFound();

  return (
    <>
      <div className="admin-header">
        <div>
          <Link className="mira-link" href="/admin/categories">← Back</Link>
          <h1>Edit {category.name}</h1>
        </div>
      </div>
      <div className="admin-card">
        <CategoryForm category={category} />
      </div>
    </>
  );
}
