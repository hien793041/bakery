'use client';

import { useTransition } from 'react';
import { setOrderStatusAction } from '../../actions';

export function StatusControl({
  id,
  current,
  options,
}: {
  id: string;
  current: string;
  options: string[];
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={isPending || opt === current}
          className={`admin-btn ${opt === current ? 'admin-btn--primary' : ''}`}
          onClick={() => startTransition(() => setOrderStatusAction(id, opt))}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
