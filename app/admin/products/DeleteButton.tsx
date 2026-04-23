'use client';

import { useTransition } from 'react';
import { deleteProductAction } from '../actions';

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="admin-btn admin-btn--danger"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Delete "${name}"? This can't be undone.`)) {
          startTransition(() => deleteProductAction(id));
        }
      }}
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
