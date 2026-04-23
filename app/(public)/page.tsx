import { prisma } from '@/lib/db';
import { productToDTO, categoryToDTO } from '@/lib/types';
import { Header, Hero, Ribbon, Footer } from '@/components/public/Header';
import { Menu } from '@/components/public/Products';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [productRows, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where: { available: true },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
  ]);
  const products = productRows.map(productToDTO);
  const categories = categoryRows.map(categoryToDTO);

  return (
    <>
      <Header />
      <Ribbon />
      <Hero />
      <Menu products={products} categories={categories} />
      <Footer />
    </>
  );
}
