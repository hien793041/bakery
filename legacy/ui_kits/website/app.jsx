/* global React, ReactDOM, Header, Ribbon, Hero, FilterBar, ProductGrid, CartDrawer, Footer */
const { useState, useEffect } = React;

const PRODUCTS = [
  { id: 'p1', category: 'cake', name: 'Strawberry Mousse Cake', price: 42, rating: 4.9, reviews: 128,
    ingredients: ['Strawberry', 'Fresh cream', 'French butter'],
    image: '/assets/illustrations/cake-hero.svg', discColor: 'var(--pink-200)', badge: 'new' },
  { id: 'p2', category: 'croissant', name: 'French Butter Croissant', price: 5, rating: 4.8, reviews: 214,
    ingredients: ['French butter', 'Italian flour', 'Sea salt'],
    image: '/assets/illustrations/croissant.svg', discColor: 'var(--pink-100)' },
  { id: 'p3', category: 'macaron', name: 'Macaron Box of Six', price: 24, rating: 4.9, reviews: 96,
    ingredients: ['Almond', 'Buttercream', 'Fresh fruit'],
    image: '/assets/illustrations/macaron.svg', discColor: 'var(--pink-300)' },
  { id: 'p4', category: 'tart', name: 'Blueberry Tart', price: 8, rating: 4.7, reviews: 142,
    ingredients: ['Wild blueberry', 'Vanilla custard', 'Almond crust'],
    image: '/assets/illustrations/tart.svg', discColor: 'var(--cream-200)' },
  { id: 'p5', category: 'cake', name: 'Cherry Blossom Cupcake', price: 6, rating: 4.8, reviews: 88,
    ingredients: ['Cherry', 'Whipped cream', 'Belgian chocolate'],
    image: '/assets/illustrations/cupcake.svg', discColor: 'var(--pink-200)' },
  { id: 'p6', category: 'cake', name: 'Classic Tiramisu', price: 9, rating: 4.9, reviews: 167,
    ingredients: ['Mascarpone', 'Italian cocoa', 'Vietnamese coffee'],
    image: '/assets/illustrations/tiramisu.svg', discColor: 'var(--cream-300)', badge: 'hot' },
  { id: 'p7', category: 'macaron', name: 'Rose Strawberry Macaron', price: 4, rating: 4.9, reviews: 203,
    ingredients: ['Strawberry', 'Almond', 'Madagascar vanilla'],
    image: '/assets/illustrations/macaron.svg', discColor: 'var(--pink-200)' },
  { id: 'p8', category: 'croissant', name: 'Pain au Chocolat', price: 6, rating: 4.8, reviews: 156,
    ingredients: ['Dark chocolate', 'French butter', 'Bread flour'],
    image: '/assets/illustrations/croissant.svg', discColor: 'var(--cream-200)' },
];

const CATEGORIES = [
  { id: 'all', label: 'All pastries' },
  { id: 'cake', label: 'Cakes' },
  { id: 'macaron', label: 'Macarons' },
  { id: 'tart', label: 'Tarts' },
  { id: 'croissant', label: 'Croissants' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cat, setCat] = useState('all');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast('Added to your bag 🌸');
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const incQty = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const decQty = (id) => setCart(prev => prev
    .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i)
    .filter(i => i.qty > 0)
  );

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="mira-app" data-screen-label="01 Home">
      <Header cartCount={cartCount} onCartClick={() => setDrawerOpen(true)} onNavClick={() => {}}/>
      <Ribbon/>
      <Hero onCta={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}/>
      <FilterBar categories={CATEGORIES} active={cat} onChange={setCat}/>
      <section className="mira-grid-wrap" id="menu">
        <div className="mira-grid-head">
          <h2>Today's menu</h2>
          <small>Baked this morning · order 3 hours ahead for delivery</small>
        </div>
        <ProductGrid products={PRODUCTS} activeCat={cat} cart={cart} onAdd={addToCart}/>
      </section>
      <Footer/>

      <CartDrawer
        open={drawerOpen}
        cart={cart}
        onClose={() => setDrawerOpen(false)}
        onRemove={removeFromCart}
        onInc={incQty}
        onDec={decQty}
      />

      <div className={`mira-toast ${toast ? 'is-on' : ''}`}>{toast}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
