'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

type CheckoutStage = 'cart' | 'form' | 'success';

export function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, removeFromCart, incQty, decQty, subtotal, clearCart } =
    useCart();
  const [stage, setStage] = useState<CheckoutStage>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  });

  function handleClose() {
    closeDrawer();
    // Reset after the drawer slides out
    setTimeout(() => {
      setStage('cart');
      setError(null);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not place order');
      }
      setStage('success');
      clearCart();
      setForm({ customerName: '', phone: '', email: '', address: '', note: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        className={`mira-drawer-backdrop ${drawerOpen ? 'is-open' : ''}`}
        onClick={handleClose}
      />
      <aside className={`mira-drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
        <header className="mira-drawer__head">
          <h3>
            {stage === 'cart' ? 'Your bag' : stage === 'form' ? 'Checkout' : 'Thank you 🌸'}
          </h3>
          <button
            className="mira-iconbtn"
            onClick={handleClose}
            aria-label="Close"
            type="button"
          >
            <img src="https://unpkg.com/lucide-static@0.460.0/icons/x.svg" width={20} height={20} alt="" />
          </button>
        </header>

        {stage === 'success' ? (
          <div className="mira-checkout__success">
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--terra-500)' }}>
              Your order's in the oven.
            </p>
            <p>We'll call you to confirm within 10 minutes.</p>
            <div style={{ padding: '16px 24px' }}>
              <button className="mira-btn mira-btn--primary mira-btn--block" type="button" onClick={handleClose}>
                Keep shopping
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="mira-drawer__empty">
            <img src="/assets/illustrations/cupcake.svg" width={120} height={120} alt="" />
            <p>
              Your bag is empty.
              <br />
              Pick something sweet.
            </p>
          </div>
        ) : stage === 'cart' ? (
          <>
            <ul className="mira-drawer__list">
              {cart.map((item) => (
                <li key={item.id} className="mira-drawer__item">
                  <div className="mira-drawer__thumb" style={{ background: item.discColor }}>
                    <img src={item.image} alt="" />
                  </div>
                  <div className="mira-drawer__info">
                    <div className="mira-drawer__name">{item.name}</div>
                    <div className="mira-drawer__price">${item.price.toFixed(2)}</div>
                    <div className="mira-drawer__qty">
                      <button type="button" onClick={() => decQty(item.id)}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => incQty(item.id)}>+</button>
                    </div>
                  </div>
                  <button
                    className="mira-drawer__remove"
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove"
                  >
                    <img
                      src="https://unpkg.com/lucide-static@0.460.0/icons/trash-2.svg"
                      width={16}
                      height={16}
                      alt=""
                    />
                  </button>
                </li>
              ))}
            </ul>
            <footer className="mira-drawer__foot">
              <div className="mira-drawer__total">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button
                className="mira-btn mira-btn--primary mira-btn--block"
                type="button"
                onClick={() => setStage('form')}
              >
                Checkout →
              </button>
              <p className="mira-drawer__note">We'll confirm your order within 10 minutes.</p>
            </footer>
          </>
        ) : (
          <form className="mira-checkout" onSubmit={handleSubmit}>
            <h4>Where should we send it?</h4>

            <div className="mira-field">
              <label htmlFor="customerName">Your name</label>
              <input
                id="customerName"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
            </div>

            <div className="mira-field">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="mira-field">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="mira-field">
              <label htmlFor="address">Delivery address</label>
              <textarea
                id="address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="mira-field">
              <label htmlFor="note">Note (optional)</label>
              <textarea
                id="note"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Birthday message, allergy, pick-up time…"
              />
            </div>

            <div className="mira-drawer__total">
              <span>Total</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            {error && <p className="mira-checkout__error">{error}</p>}

            <button
              className="mira-btn mira-btn--primary mira-btn--block"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
            <button className="mira-link" type="button" onClick={() => setStage('cart')}>
              ← Back to bag
            </button>
          </form>
        )}
      </aside>
    </>
  );
}

export function Toast() {
  const { toast } = useCart();
  return <div className={`mira-toast ${toast ? 'is-on' : ''}`}>{toast}</div>;
}
