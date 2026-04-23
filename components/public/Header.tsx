'use client';

import { useCart } from './CartContext';

export function Header() {
  const { cartCount, openDrawer } = useCart();
  return (
    <header className="mira-header">
      <div className="mira-header__inner">
        <a className="mira-header__logo" href="#">
          <img src="/assets/logo/wordmark.svg" alt="Mira Bánh Ngọt" height={48} />
        </a>
        <nav className="mira-header__nav">
          <a href="#menu">Shop</a>
          <a href="#story">Our story</a>
          <a href="#visit">Visit</a>
        </nav>
        <div className="mira-header__actions">
          <button className="mira-iconbtn" aria-label="Search" type="button">
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/search.svg" width={20} height={20} alt="" />
          </button>
          <button
            className="mira-iconbtn mira-iconbtn--cart"
            onClick={openDrawer}
            aria-label="Bag"
            type="button"
          >
            <img
              src="https://unpkg.com/lucide-static@0.460.0/icons/shopping-bag.svg"
              width={20}
              height={20}
              alt=""
            />
            {cartCount > 0 && <span className="mira-iconbtn__badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Ribbon() {
  const items = [
    'No preservatives',
    'Local delivery in the Bay Area',
    'Handmade every morning',
    'Imported French butter',
    'Free gift wrapping',
  ];
  const loop = [...items, ...items, ...items];
  return (
    <div className="mira-ribbon" role="marquee">
      <div className="mira-ribbon__track">
        {loop.map((t, i) => (
          <span key={i} className="mira-ribbon__item">
            <span>{t}</span>
            <span className="mira-ribbon__dot">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="mira-hero">
      <div className="mira-hero__text">
        <div className="mira-hero__eyebrow">Handmade Vietnamese patisserie · San Jose</div>
        <h1 className="mira-hero__title">
          <span>a little</span>
          <em>sweetness</em>
        </h1>
        <p className="mira-hero__sub">
          Fresh pastries baked every morning with French butter, Da Lat strawberries, and hands
          that have loved the kitchen for over ten years.
        </p>
        <div className="mira-hero__cta">
          <button className="mira-btn mira-btn--primary" onClick={scrollToMenu} type="button">
            See today's menu
          </button>
          <a className="mira-link" href="#menu">
            Order a birthday cake →
          </a>
        </div>
      </div>
      <div className="mira-hero__visual">
        <div className="mira-hero__disc">
          <img src="/assets/illustrations/cake-hero.svg" alt="Bánh dâu" />
        </div>
        <span className="mira-hero__flourish">sweet things</span>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mira-footer" id="visit">
      <div className="mira-footer__inner">
        <div className="mira-footer__brand">
          <img src="/assets/logo/wordmark.svg" height={60} alt="Mira Bánh Ngọt" />
          <p className="mira-footer__tag">
            <em>a little sweetness in every bite</em>
          </p>
        </div>
        <div className="mira-footer__col">
          <h4>Visit</h4>
          <p>
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/map-pin.svg" width={14} height={14} alt="" />
            128 Lion Ave, San Jose, CA 95112
          </p>
          <p>
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/clock.svg" width={14} height={14} alt="" />
            Open 7am — 9pm, closed Tuesdays
          </p>
          <p>
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/phone.svg" width={14} height={14} alt="" />
            (408) 555–0123
          </p>
        </div>
        <div className="mira-footer__col">
          <h4>Follow</h4>
          <p>
            <a href="#">Instagram · @mirabakery</a>
          </p>
          <p>
            <a href="#">TikTok · @mirabakery</a>
          </p>
          <p>
            <a href="#">Order on DoorDash</a>
          </p>
        </div>
      </div>
      <div className="mira-footer__copy">
        <span>© {new Date().getFullYear()} Mira Bakery</span>
        <span>Made with French butter and a lot of patience.</span>
      </div>
    </footer>
  );
}
