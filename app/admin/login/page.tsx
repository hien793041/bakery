import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect('/admin');
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Mira admin</h1>
        <p>Sign in to manage orders and pastries.</p>
        <LoginForm />
      </div>
    </div>
  );
}
