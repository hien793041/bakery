'use client';

import { StatusToggle } from '../StatusToggle';
import { toggleProductAvailableAction } from '../actions';

export function AvailabilityToggle({ id, available }: { id: string; available: boolean }) {
  return (
    <StatusToggle
      checked={available}
      onToggle={(next) => toggleProductAvailableAction(id, next)}
      labelOn="Available"
      labelOff="Hidden"
    />
  );
}
