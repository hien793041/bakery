'use client';

import { useState } from 'react';
import type { CategoryDTO, ProductDTO } from '@/lib/types';
import { useCart } from './CartContext';

function FilterBar({
  categories,
  active,
  onChange,
}: {
  categories: CategoryDTO[];
  active: string;
  onChange: (id: string) => void;
}) {
  const items = [{ slug: 'all', name: 'All pastries' }, ...categories];
  return (
    <div className="mira-filter">
      <div className="mira-filter__scroll">
        {items.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            className={`mira-chip ${active === cat.slug ? 'mira-chip--active' : ''}`}
            onClick={() => onChange(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ProductDTO }) {
  const { addToCart, cart } = useCart();
  const added = cart.some((c) => c.id === product.id);
  return (
    <article className="mira-card">
      {product.badge && <span className="mira-card__badge">{product.badge}</span>}
      <div className="mira-card__disc" style={{ background: product.discColor }}>
        <img src={product.image} alt={product.name} />
      </div>
      <h3 className="mira-card__name">{product.name}</h3>
      <div className="mira-card__rating">
        <span className="mira-card__stars">★★★★★</span>
        <span className="mira-card__rating-num">
          {product.rating.toFixed(1)} · {product.reviews} reviews
        </span>
      </div>
      <div className="mira-card__ing">{product.ingredients.join(' · ')}</div>
      <div className="mira-card__foot">
        <span className="mira-card__price">${product.price.toFixed(2)}</span>
        <button
          type="button"
          className={`mira-add ${added ? 'mira-add--on' : ''}`}
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          {added ? '✓' : '+'}
        </button>
      </div>
    </article>
  );
}

export function Menu({
  products,
  categories,
}: {
  products: ProductDTO[];
  categories: CategoryDTO[];
}) {
  const [activeSlug, setActiveSlug] = useState('all');
  const visible =
    activeSlug === 'all' ? products : products.filter((p) => p.categorySlug === activeSlug);

  return (
    <>
      <FilterBar categories={categories} active={activeSlug} onChange={setActiveSlug} />
      <section className="mira-grid-wrap" id="menu">
        <div className="mira-grid-head">
          <h2>Today's menu</h2>
          <small>Baked this morning · order 3 hours ahead for delivery</small>
        </div>
        {visible.length === 0 ? (
          <div className="mira-grid-empty">No pastries in this category yet.</div>
        ) : (
          <div className="mira-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
