# Mira Bánh Ngọt — Website UI Kit

Responsive storefront for the bakery. Mobile-first; desktop is a wider, 3–4-column version of the same design.

## Files

- `index.html` — entry point, loads Google Fonts + styles + all JSX
- `styles.css` — component styles (imports root `colors_and_type.css`)
- `Header.jsx` — sticky header, USP ribbon, hero section
- `Products.jsx` — filter chips, product card, grid
- `Cart.jsx` — cart drawer (empty + filled states), footer
- `app.jsx` — entry; product data, cart state

## Screens covered

1. **Home (default view)** — hero, ribbon, filter bar, product grid, footer
2. **Cart empty** — drawer opens with illustration + prompt
3. **Cart with items** — drawer shows items, qty controls, total, checkout CTA
4. **Filter by category** — chip click filters grid
5. **Add to cart toast** — brief confirmation bubble

## Interactions

- Click any product card's `+` to add to cart (toggles to `✓`)
- Click cart icon (top right) to open drawer
- In drawer: `+`/`−` qty, trash to remove
- Click filter chips to filter the grid
- CTA button in hero smooth-scrolls to menu

## Responsive

- Mobile (<768px): single-column hero, 2-column grid, hamburger-ready header (nav links hidden; add a drawer if needed)
- Desktop (≥1024px): split hero, 3–4 column grid, full nav visible

## Design references

All tokens come from root `colors_and_type.css`. Visual rules live in root `README.md`. Illustrations are in `assets/illustrations/`.
