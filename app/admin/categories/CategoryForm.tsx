'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Category } from '@prisma/client';
import { createCategoryAction, updateCategoryAction } from '../actions';

export function CategoryForm({ category }: { category?: Category }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const defaults = category ?? {
    name: '',
    slug: '',
    sortOrder: 0,
    active: true,
  };

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const res = category
          ? await updateCategoryAction(category.id, formData)
          : await createCategoryAction(formData);
        if (res && typeof res === 'object' && 'error' in res && res.error) {
          setError(res.error as string);
        }
      } catch {
        // redirect throws — ignore
      }
    });
  }

  return (
    <form action={onSubmit} className="admin-form">
      <div className="admin-form__row">
        <label>
          Name
          <input name="name" required defaultValue={defaults.name} />
        </label>
        <label>
          Slug <span className="admin-form__hint">(url-friendly, unique)</span>
          <input name="slug" defaultValue={defaults.slug} placeholder="auto from name" />
        </label>
      </div>

      <div className="admin-form__row">
        <label>
          Sort order <span className="admin-form__hint">(lower = first)</span>
          <input name="sortOrder" type="number" defaultValue={defaults.sortOrder} />
        </label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 24 }}>
          <input name="active" type="checkbox" defaultChecked={defaults.active} />
          Show on the storefront
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-form__foot">
        <button className="admin-btn admin-btn--primary admin-btn--lg" type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : category ? 'Save changes' : 'Create category'}
        </button>
        <Link className="mira-link" href="/admin/categories">
          Cancel
        </Link>
      </div>
    </form>
  );
}
