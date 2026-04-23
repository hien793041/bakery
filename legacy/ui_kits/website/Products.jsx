/* global React */
const { useState: useStateProduct } = React;

function FilterBar({ categories, active, onChange }) {
  return (
    <div className="mira-filter">
      <div className="mira-filter__scroll">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`mira-chip ${active === cat.id ? 'mira-chip--active' : ''}`}
            onClick={() => onChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd, added }) {
  return (
    <article className="mira-card">
      {product.badge && <span className="mira-card__badge">{product.badge}</span>}
      <div className="mira-card__disc" style={{ background: product.discColor || 'var(--pink-200)' }}>
        <img src={product.image} alt={product.name}/>
      </div>
      <h3 className="mira-card__name">{product.name}</h3>
      <div className="mira-card__rating">
        <span className="mira-card__stars">★★★★★</span>
        <span className="mira-card__rating-num">{product.rating} · {product.reviews} reviews</span>
      </div>
      <div className="mira-card__ing">
        {product.ingredients.join(' · ')}
      </div>
      <div className="mira-card__foot">
        <span className="mira-card__price">${product.price.toFixed(2)}</span>
        <button
          className={`mira-add ${added ? 'mira-add--on' : ''}`}
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          {added ? '✓' : '+'}
        </button>
      </div>
    </article>
  );
}

function ProductGrid({ products, activeCat, cart, onAdd }) {
  const filtered = activeCat === 'all' ? products : products.filter(p => p.category === activeCat);
  return (
    <div className="mira-grid">
      {filtered.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          onAdd={onAdd}
          added={cart.some(c => c.id === p.id)}
        />
      ))}
    </div>
  );
}

window.FilterBar = FilterBar;
window.ProductCard = ProductCard;
window.ProductGrid = ProductGrid;
