/* global React */
function CartDrawer({ open, cart, onClose, onRemove, onInc, onDec }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div className={`mira-drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose}/>
      <aside className={`mira-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <header className="mira-drawer__head">
          <h3>Your bag</h3>
          <button className="mira-iconbtn" onClick={onClose} aria-label="Close">
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/x.svg" width="20" height="20" alt=""/>
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="mira-drawer__empty">
            <img src="/assets/illustrations/cupcake.svg" width="120" height="120" alt=""/>
            <p>Your bag is empty.<br/>Pick something sweet.</p>
          </div>
        ) : (
          <>
            <ul className="mira-drawer__list">
              {cart.map(item => (
                <li key={item.id} className="mira-drawer__item">
                  <div className="mira-drawer__thumb" style={{ background: item.discColor || 'var(--pink-200)' }}>
                    <img src={item.image} alt=""/>
                  </div>
                  <div className="mira-drawer__info">
                    <div className="mira-drawer__name">{item.name}</div>
                    <div className="mira-drawer__price">${item.price.toFixed(2)}</div>
                    <div className="mira-drawer__qty">
                      <button onClick={() => onDec(item.id)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onInc(item.id)}>+</button>
                    </div>
                  </div>
                  <button className="mira-drawer__remove" onClick={() => onRemove(item.id)} aria-label="Remove">
                    <img src="https://unpkg.com/lucide-static@0.460.0/icons/trash-2.svg" width="16" height="16" alt=""/>
                  </button>
                </li>
              ))}
            </ul>
            <footer className="mira-drawer__foot">
              <div className="mira-drawer__total">
                <span>Subtotal</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <button className="mira-btn mira-btn--primary mira-btn--block">Checkout →</button>
              <p className="mira-drawer__note">We'll confirm your order within 10 minutes.</p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="mira-footer">
      <div className="mira-footer__inner">
        <div className="mira-footer__brand">
          <img src="/assets/logo/wordmark.svg" height="60" alt="Mira Bánh Ngọt"/>
          <p className="mira-footer__tag"><em>a little sweetness in every bite</em></p>
        </div>
        <div className="mira-footer__col">
          <h4>Visit</h4>
          <p><img src="https://unpkg.com/lucide-static@0.460.0/icons/map-pin.svg" width="14" height="14" alt=""/> 128 Lion Ave, San Jose, CA 95112</p>
          <p><img src="https://unpkg.com/lucide-static@0.460.0/icons/clock.svg" width="14" height="14" alt=""/> Open 7am — 9pm, closed Tuesdays</p>
          <p><img src="https://unpkg.com/lucide-static@0.460.0/icons/phone.svg" width="14" height="14" alt=""/> (408) 555–0123</p>
        </div>
        <div className="mira-footer__col">
          <h4>Follow</h4>
          <p><a href="#">Instagram · @mirabakery</a></p>
          <p><a href="#">TikTok · @mirabakery</a></p>
          <p><a href="#">Order on DoorDash</a></p>
        </div>
      </div>
      <div className="mira-footer__copy">
        <span>© 2026 Mira Bakery</span>
        <span>Made with French butter and a lot of patience.</span>
      </div>
    </footer>
  );
}

window.CartDrawer = CartDrawer;
window.Footer = Footer;
