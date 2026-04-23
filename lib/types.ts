export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  active: boolean;
};

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  description: string | null;
  ingredients: string[];
  image: string;
  discColor: string;
  badge: string | null;
  rating: number;
  reviews: number;
  available: boolean;
};

export type CartItem = ProductDTO & { qty: number };

export const ORDER_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function parseIngredients(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v.map(String);
  } catch {
    // fall through
  }
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

type ProductWithCategory = {
  id: string; slug: string; name: string; categoryId: string; price: number;
  description: string | null; ingredients: string; image: string; discColor: string;
  badge: string | null; rating: number; reviews: number; available: boolean;
  category: { slug: string; name: string };
};

export function productToDTO(p: ProductWithCategory): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.categoryId,
    categorySlug: p.category.slug,
    categoryName: p.category.name,
    price: p.price,
    description: p.description,
    ingredients: parseIngredients(p.ingredients),
    image: p.image,
    discColor: p.discColor,
    badge: p.badge,
    rating: p.rating,
    reviews: p.reviews,
    available: p.available,
  };
}

export function categoryToDTO(c: {
  id: string; slug: string; name: string; sortOrder: number; active: boolean;
}): CategoryDTO {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    sortOrder: c.sortOrder,
    active: c.active,
  };
}
