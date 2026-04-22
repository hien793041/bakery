/* global React */
const { useState } = React;

function Header({ cartCount, onCartClick, onNavClick }) {
  return (
    <header className="mira-header">
      <div className="mira-header__inner">
        <a className="mira-header__logo" href="#" onClick={(e) => { e.preventDefault(); onNavClick('home'); }}>
          <img src="/assets/logo/wordmark.svg" alt="Mira Bánh Ngọt" height="48" />
        </a>
        <nav className="mira-header__nav">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('shop'); }}>Shop</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('story'); }}>Our story</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('contact'); }}>Visit</a>
        </nav>
        <div className="mira-header__actions">
          <button className="mira-iconbtn" aria-label="Search">
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/search.svg" width="20" height="20" alt=""/>
          </button>
          <button className="mira-iconbtn mira-iconbtn--cart" onClick={onCartClick} aria-label="Bag">
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/shopping-bag.svg" width="20" height="20" alt=""/>
            {cartCount > 0 && <span className="mira-iconbtn__badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function Ribbon() {
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
            <span>{t}</span><span className="mira-ribbon__dot">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero({ onCta }) {
  return (
    <section className="mira-hero">
      <div className="mira-hero__text">
        <div className="mira-hero__eyebrow">Handmade Vietnamese patisserie · San Jose</div>
        <h1 className="mira-hero__title">
          <span>a little</span>
          <em>sweetness</em>
        </h1>
        <p className="mira-hero__sub">
          Fresh pastries baked every morning with French butter, Da Lat strawberries,
          and hands that have loved the kitchen for over ten years.
        </p>
        <div className="mira-hero__cta">
          <button className="mira-btn mira-btn--primary" onClick={onCta}>See today's menu</button>
          <a className="mira-link" href="#">Order a birthday cake →</a>
        </div>
      </div>
      <div className="mira-hero__visual">
        <div className="mira-hero__disc">
          <img src="/assets/illustrations/cake-hero.svg" alt="Bánh dâu"/>
        </div>
        <span className="mira-hero__flourish">sweet things</span>
      </div>
    </section>
  );
}

window.Header = Header;
window.Ribbon = Ribbon;
window.Hero = Hero;
