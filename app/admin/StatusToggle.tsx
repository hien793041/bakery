'use client';

import { useOptimistic, useTransition } from 'react';

type Props = {
  checked: boolean;
  onToggle: (next: boolean) => Promise<void>;
  labelOn?: string;
  labelOff?: string;
};

export function StatusToggle({
  checked,
  onToggle,
  labelOn = 'Active',
  labelOff = 'Hidden',
}: Props) {
  const [optimistic, setOptimistic] = useOptimistic(checked);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !optimistic;
    startTransition(async () => {
      setOptimistic(next);
      await onToggle(next);
    });
  }

  return (
    <button
      type="button"
      className={`admin-toggle ${optimistic ? 'admin-toggle--on' : ''}`}
      role="switch"
      aria-checked={optimistic}
      aria-busy={isPending}
      disabled={isPending}
      onClick={handleClick}
    >
      <span className="admin-toggle__track">
        <span className="admin-toggle__thumb" />
      </span>
      <span className="admin-toggle__label">{optimistic ? labelOn : labelOff}</span>
    </button>
  );
}
