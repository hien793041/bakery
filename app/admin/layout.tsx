import '@/styles/admin.css';
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth';
import { logoutAction } from './actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The /admin/login page uses its own chrome — allow it through.
  // We'll detect by checking for the current admin only on non-login routes,
  // but layouts can't read the path. Instead the child page is responsible
  // for redirecting when unauthenticated. We still render the shell only when
  // there's an admin session.
  const admin = await getCurrentAdmin();

  if (!admin) {
    // Children that shouldn't require auth (login page) short-circuit with their own layout group.
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Mira admin</div>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/" target="_blank" rel="noreferrer">
          View shop ↗
        </Link>
        <div className="admin-sidebar__foot">
          <span>Signed in as</span>
          <strong style={{ color: 'var(--fg)' }}>{admin.username}</strong>
          <form action={logoutAction}>
            <button className="mira-link" type="submit" style={{ fontSize: 13, padding: 0, marginTop: 4 }}>
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
