'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '../actions';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await loginAction(formData);
        if (res?.error) setError(res.error);
      } catch {
        // redirect() throws — ignore
      }
    });
  }

  return (
    <form action={onSubmit} className="admin-form">
      <label>
        Username
        <input name="username" required autoFocus autoComplete="username" />
      </label>
      <label>
        Password
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      {error && <p className="admin-error">{error}</p>}
      <button className="admin-btn admin-btn--primary admin-btn--lg" type="submit" disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
