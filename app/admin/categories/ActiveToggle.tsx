'use client';

import { StatusToggle } from '../StatusToggle';
import { toggleCategoryActiveAction } from '../actions';

export function ActiveToggle({ id, active }: { id: string; active: boolean }) {
  return (
    <StatusToggle
      checked={active}
      onToggle={(next) => toggleCategoryActiveAction(id, next)}
      labelOn="Active"
      labelOff="Hidden"
    />
  );
}
