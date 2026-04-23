'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { login, logout, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ORDER_STATUSES } from '@/lib/types';

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  if (!username || !password) {
    return { error: 'Please fill in both fields.' };
  }
  const admin = await login(username, password);
  if (!admin) return { error: 'Invalid username or password.' };
  redirect('/admin');
}

export async function logoutAction() {
  await logout();
  redirect('/admin/login');
}

// ---------- Products ----------

function parseIngredientsField(raw: string): string {
  const arr = raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return JSON.stringify(arr);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function productFromForm(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const slug = String(formData.get('slug') || '').trim() || slugify(name);
  const categoryId = String(formData.get('categoryId') || '').trim();
  const price = Number(formData.get('price') || 0);
  const description = String(formData.get('description') || '').trim() || null;
  const ingredients = parseIngredientsField(String(formData.get('ingredients') || ''));
  const image = String(formData.get('image') || '/assets/illustrations/cake-hero.svg').trim();
  const discColor = String(formData.get('discColor') || 'var(--pink-200)').trim();
  const badge = String(formData.get('badge') || '').trim() || null;
  const rating = Number(formData.get('rating') || 4.8);
  const reviews = Number(formData.get('reviews') || 0);
  const available = formData.get('available') === 'on';
  return { name, slug, categoryId, price, description, ingredients, image, discColor, badge, rating, reviews, available };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const data = productFromForm(formData);
  if (!data.name || !data.slug || !data.categoryId || !(data.price >= 0)) {
    return { error: 'Name, slug, category and price are required.' };
  }
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) return { error: 'Slug is already in use.' };
  await prisma.product.create({ data });
  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const data = productFromForm(formData);
  if (!data.name || !data.slug || !data.categoryId || !(data.price >= 0)) {
    return { error: 'Name, slug, category and price are required.' };
  }
  await prisma.product.update({ where: { id }, data });
  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function toggleProductAvailableAction(id: string, available: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { available } });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

// ---------- Categories ----------

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  const slug = String(formData.get('slug') || '').trim() || slugify(name);
  const sortOrder = Number(formData.get('sortOrder') || 0);
  const active = formData.get('active') === 'on';
  if (!name || !slug) return { error: 'Name and slug are required.' };

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: 'Slug is already in use.' };

  await prisma.category.create({ data: { name, slug, sortOrder, active } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get('name') || '').trim();
  const slug = String(formData.get('slug') || '').trim() || slugify(name);
  const sortOrder = Number(formData.get('sortOrder') || 0);
  const active = formData.get('active') === 'on';
  if (!name || !slug) return { error: 'Name and slug are required.' };

  await prisma.category.update({
    where: { id },
    data: { name, slug, sortOrder, active },
  });
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return { error: `Cannot delete: ${productCount} product(s) still use this category.` };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

export async function toggleCategoryActiveAction(id: string, active: boolean) {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data: { active } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
}

// ---------- Orders ----------

export async function setOrderStatusAction(id: string, status: string) {
  await requireAdmin();
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}
