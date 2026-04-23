import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'cake', name: 'Cakes', sortOrder: 1 },
  { slug: 'croissant', name: 'Croissants', sortOrder: 2 },
  { slug: 'macaron', name: 'Macarons', sortOrder: 3 },
  { slug: 'tart', name: 'Tarts', sortOrder: 4 },
];

const PRODUCTS = [
  {
    slug: 'strawberry-mousse-cake',
    name: 'Strawberry Mousse Cake',
    categorySlug: 'cake',
    price: 42,
    rating: 4.9,
    reviews: 128,
    ingredients: ['Strawberry', 'Fresh cream', 'French butter'],
    image: '/assets/illustrations/cake-hero.svg',
    discColor: 'var(--pink-200)',
    badge: 'new',
    description: 'A cloud of whipped mousse on sponge, crowned with Da Lat strawberries.',
  },
  {
    slug: 'french-butter-croissant',
    name: 'French Butter Croissant',
    categorySlug: 'croissant',
    price: 5,
    rating: 4.8,
    reviews: 214,
    ingredients: ['French butter', 'Italian flour', 'Sea salt'],
    image: '/assets/illustrations/croissant.svg',
    discColor: 'var(--pink-100)',
    description: 'Laminated 27 times with cultured French butter. Flaky, tender, crisp.',
  },
  {
    slug: 'macaron-box-of-six',
    name: 'Macaron Box of Six',
    categorySlug: 'macaron',
    price: 24,
    rating: 4.9,
    reviews: 96,
    ingredients: ['Almond', 'Buttercream', 'Fresh fruit'],
    image: '/assets/illustrations/macaron.svg',
    discColor: 'var(--pink-300)',
    description: 'Six assorted macarons, flavors rotate by the season.',
  },
  {
    slug: 'blueberry-tart',
    name: 'Blueberry Tart',
    categorySlug: 'tart',
    price: 8,
    rating: 4.7,
    reviews: 142,
    ingredients: ['Wild blueberry', 'Vanilla custard', 'Almond crust'],
    image: '/assets/illustrations/tart.svg',
    discColor: 'var(--cream-200)',
    description: 'Wild blueberries over vanilla bean custard on almond shortcrust.',
  },
  {
    slug: 'cherry-blossom-cupcake',
    name: 'Cherry Blossom Cupcake',
    categorySlug: 'cake',
    price: 6,
    rating: 4.8,
    reviews: 88,
    ingredients: ['Cherry', 'Whipped cream', 'Belgian chocolate'],
    image: '/assets/illustrations/cupcake.svg',
    discColor: 'var(--pink-200)',
    description: 'Cherry-kissed sponge, cloud of cream, Belgian chocolate shard.',
  },
  {
    slug: 'classic-tiramisu',
    name: 'Classic Tiramisu',
    categorySlug: 'cake',
    price: 9,
    rating: 4.9,
    reviews: 167,
    ingredients: ['Mascarpone', 'Italian cocoa', 'Vietnamese coffee'],
    image: '/assets/illustrations/tiramisu.svg',
    discColor: 'var(--cream-300)',
    badge: 'hot',
    description: 'Layers of mascarpone cream and ladyfingers dipped in Vietnamese coffee.',
  },
  {
    slug: 'rose-strawberry-macaron',
    name: 'Rose Strawberry Macaron',
    categorySlug: 'macaron',
    price: 4,
    rating: 4.9,
    reviews: 203,
    ingredients: ['Strawberry', 'Almond', 'Madagascar vanilla'],
    image: '/assets/illustrations/macaron.svg',
    discColor: 'var(--pink-200)',
    description: 'Rose-perfumed shell hugging a strawberry vanilla ganache.',
  },
  {
    slug: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    categorySlug: 'croissant',
    price: 6,
    rating: 4.8,
    reviews: 156,
    ingredients: ['Dark chocolate', 'French butter', 'Bread flour'],
    image: '/assets/illustrations/croissant.svg',
    discColor: 'var(--cream-200)',
    description: 'Two batons of dark chocolate folded into buttery laminated dough.',
  },
];

async function main() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categories.`);

  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const p of PRODUCTS) {
    const categoryId = categoryBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Unknown category ${p.categorySlug}`);
    const { categorySlug, ingredients, ...rest } = p;
    const data = {
      ...rest,
      categoryId,
      ingredients: JSON.stringify(ingredients),
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
  console.log(`Seeded admin: ${username} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
