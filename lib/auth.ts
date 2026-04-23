import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from './db';

const COOKIE_NAME = 'mira_session';
const SESSION_DAYS = 7;

export async function login(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { adminId: admin.id, token, expiresAt },
  });

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });

  return admin;
}

export async function logout() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  return admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('UNAUTHORIZED');
  return admin;
}
