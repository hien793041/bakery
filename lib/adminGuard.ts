import { redirect } from 'next/navigation';
import { getCurrentAdmin } from './auth';

export async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}
