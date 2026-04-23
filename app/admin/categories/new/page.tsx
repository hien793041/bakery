import Link from 'next/link';
import { ensureAdmin } from '@/lib/adminGuard';
import { CategoryForm } from '../CategoryForm';

export default async function NewCategoryPage() {
  await ensureAdmin();
  return (
    <>
      <div className="admin-header">
        <div>
          <Link className="mira-link" href="/admin/categories">← Back</Link>
          <h1>Add a category</h1>
          <p>Categories show up as filter chips on the storefront.</p>
        </div>
      </div>
      <div className="admin-card">
        <CategoryForm />
      </div>
    </>
  );
}
