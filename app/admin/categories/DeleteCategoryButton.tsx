'use client';

import { useState, useTransition } from 'react';
import { deleteCategoryAction } from '../actions';

export function DeleteCategoryButton({
  id,
  name,
  productCount,
}: {
  id: string;
  name: string;
  productCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const disabled = productCount > 0;
  return (
    <>
      <button
        type="button"
        className="admin-btn admin-btn--danger"
        disabled={isPending || disabled}
        title={disabled ? `${productCount} product(s) still use this category` : undefined}
        onClick={() => {
          if (!confirm(`Delete "${name}"?`)) return;
          startTransition(async () => {
            const res = await deleteCategoryAction(id);
            if (res && 'error' in res && res.error) setErr(res.error);
          });
        }}
      >
        {isPending ? 'Deleting…' : 'Delete'}
      </button>
      {err && <span style={{ color: 'var(--terra-500)', fontSize: 12 }}>{err}</span>}
    </>
  );
}
