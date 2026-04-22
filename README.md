# Mira Bakery — Design System

> "A little sweetness in every bite."

Mira is a small Vietnamese-American pâtisserie based in the US (Bay Area / San Jose), selling artisan cakes, pastries, and macarons. Most customers order from mobile, so the web presence is a **mobile‑first responsive storefront** with a desktop experience that doesn't feel like a blown‑up phone. **UI copy is English**; the Vietnamese heritage shows up in ingredient stories (Đà Lạt strawberries, Buôn Ma Thuột coffee) rather than UI chrome.

The brand sits at the intersection of three feelings:

- **Sweetness & softness** — pastel pink, rounded forms, delicate serif type
- **Craft & warmth** — terracotta/crimson accents, hand-made feeling, cream paper backgrounds
- **Quiet confidence** — clean typography, generous white space, not overly decorated

## Sources

This design system was created from scratch (no codebase or Figma provided) based on the brief:

> Tone màu hồng pastel + đỏ đất (terracotta/crimson) cho tiệm bánh ngọt. Nền kem trắng. Hero với tên tiệm serif nghiêng, tagline, minh họa bánh trên nền tròn pastel. Grid sản phẩm với card (hình bánh, tên serif, giá đỏ đậm, pill ingredients hồng nhạt, rating + nút thêm giỏ). Filter bar. Ribbon đỏ chạy ngang với USPs. Footer đơn giản.

## Index

Top-level files:

- `README.md` — this file; brand overview, content + visual fundamentals, iconography
- `colors_and_type.css` — design tokens (colors, type, spacing, radii, shadows) as CSS variables
- `SKILL.md` — agent skill manifest (for Claude Code / skills)
- `assets/logo/` — `wordmark.svg`, `monogram.svg`
- `assets/illustrations/` — `cake-hero.svg`, `croissant.svg`, `macaron.svg`, `tart.svg`, `cupcake.svg`, `tiramisu.svg`
- `preview/` — individual HTML cards for the Design System tab
- `ui_kits/website/` — bakery storefront (desktop + mobile) as a clickable React prototype

### Fonts

Loaded from Google Fonts (flagged — drop your licensed TTF/WOFF2 in `fonts/` if you prefer):
- **Cormorant Garamond** — display, product names
- **DM Sans** — body
- **Caveat** — small script accents

## Products

- **Website** (`ui_kits/website/`) — responsive marketing + storefront. Hero, product grid, filter, ribbon, cart drawer, product detail, footer. Used on PC and mobile; mobile is the primary target.

---

## CONTENT FUNDAMENTALS

UI is **English-first**; Vietnamese shows up as flavor in ingredient names and shop lore. Tone is **warm, feminine, unhurried** — like a handwritten note from a baker friend. Never corporate, never hard-sell.

### Voice

- **Personal, soft, warm.** "We bake from 4am every morning." Not "Our team produces fresh baked goods daily."
- **Sensory and specific.** Name the butter (French), the strawberries (Đà Lạt, Vietnam), the technique (cold-proofed 12 hours).
- **Short lines, lots of breath.** One idea per line. No paragraphs on product cards.
- **Lowercase is okay in decorative spots** (hero tagline, script flourishes). Product names and section headers are Title Case.

### Pronouns

- Shop is **"we"** or **"Mira"**, never "the bakery" / "Mira Bakery Inc."
- Customer is **"you"**. Softer CTAs can use "your" ("your bag", "we'll pack it for you").

### Casing

- **Product names** — Title Case, serif display font. `Strawberry Mousse Cake`, not `strawberry mousse cake`.
- **Prices** — US dollars with `$` and two decimals: `$42.00`, `$4.50`.
- **Section headers** — Title case in serif. Hero tagline can be all lowercase italic for a handwritten feel.
- **Buttons** — Sentence case. "Add to bag", never "ADD TO BAG".
- **Pill tags (ingredients)** — Sentence case, middot separated: `Strawberry · Fresh cream · French butter`.

### Emoji

- **Avoided in UI chrome** (buttons, menus, headers).
- **Allowed sparingly** in toasts or ribbon as a single decorative glyph (🌸 for a flower divider, never stacked).
- **Never used in place of real iconography.** Product imagery uses photos/illustrations, not 🍰.

### Example copy

| Context | Copy |
|---|---|
| Hero tagline | *a little sweetness in every bite* |
| Hero sub | Fresh pastries baked every morning with French butter and Đà Lạt strawberries. |
| USP ribbon | No preservatives · Local Bay Area delivery · Handmade every morning |
| Product CTA | `+` (icon only) |
| Empty bag | Your bag is empty. Pick something sweet. |
| Hours | Open 7am — 9pm, closed Tuesdays |
| Add toast | Added to your bag 🌸 |
| Filter "all" | All pastries |

### What to avoid

- ❌ "Discover our premium selection of artisanal confections"
- ❌ "SHOP NOW" / "BUY NOW" all caps
- ❌ "The best bakery in San Jose"
- ❌ Over-punctuated marketing speak, exclamations, emoji clusters

---

## VISUAL FOUNDATIONS

### Color

A three-part palette, always in this hierarchy:

1. **Cream paper (`#FBF5EC`)** — dominant background, ~70% of any surface
2. **Pastel pink family (`#F4C2C2` → `#F9DCDC` → `#FDECEC`)** — soft shapes behind product imagery, pill tags, highlights, ~20%
3. **Terracotta / đỏ đất (`#B84A39`)** as the single strong accent — prices, ribbon, primary buttons, ~10%

Supporting neutrals are warm (ink `#2B1E1A` — nearly-black with red undertone, never pure `#000`). Greens and blues do not appear; if a semantic success/info color is needed, we borrow an olive (`#8A8B5C`) or a muted slate (`#6B7280`) rather than saturated hues.

### Typography

- **Display / serif — `Cormorant Garamond`** (italic variants especially). Used for the wordmark, hero tagline, product names, section headers. High contrast, graceful, slightly old-world.
- **Body — `DM Sans`**. Rounded humanist sans. Calm, friendly, readable at small sizes on mobile.
- **Occasional handwritten accent — `Caveat`** for the tagline flourish and small "new" / "hot" badges.

Scale is generous: on mobile, body is `16px`, headings jump to `28–40px`. On desktop, hero display hits `96px+` with tight italic leading.

### Spacing

Base 4px grid. Common stops: `4, 8, 12, 16, 24, 32, 48, 64, 96`. Product cards breathe — `24px` internal padding minimum. Section rhythm on desktop is `96–128px` vertical.

### Backgrounds

- **Cream paper is default.** Never pure white.
- **Soft pastel pink circles** sit behind product imagery as a signature motif — never gradients with multiple colors, never bluish-purple.
- **No photographic full-bleed heros.** The hero is composed: wordmark + tagline + one centered illustrated cake on a pink disc.
- **No patterns or textures** on main surfaces. The cream color itself is the texture.
- **No noise, no grain filters.**

### Radii

- `--r-sm: 8px` — pill tags, small chips
- `--r-md: 14px` — buttons, inputs
- `--r-lg: 20px` — product cards
- `--r-xl: 28px` — drawers, modals
- `--r-full: 999px` — ingredient pills, round CTAs, the signature pink disc behind hero cake

### Shadows

Warm, diffused, never grey. All shadows use a tinted terracotta base (`rgba(184, 74, 57, 0.08)`) so they feel embedded in the cream world.

- `--shadow-sm` — 0 1px 2px rgba(184,74,57,.06)
- `--shadow-md` — 0 8px 24px rgba(184,74,57,.08)
- `--shadow-lg` — 0 20px 48px rgba(184,74,57,.12)
- No inner shadows. No hard drop shadows.

### Borders

Hairline borders (`1px`) in a 10% terracotta tint (`rgba(184,74,57,.12)`) instead of grey. Avoid borders on product cards (rely on shadow); use borders only on inputs, footer dividers, and filter chips in their default (unselected) state.

### Hover / press

- **Hover**: raise by `2px`, darken cream slightly, shadow `md → lg`. Pills gain a pink fill. Links underline (1px, 2px offset).
- **Press**: `scale(0.98)`, shadow drops to `sm`, 80ms ease-out. Buttons lose their hover lift.
- **Focus**: `2px` terracotta ring offset by `2px` — visible but not jarring.

### Animation

- **Easing**: `cubic-bezier(.2,.7,.2,1)` — a gentle exit curve that feels like dough settling.
- **Durations**: 180ms (small), 260ms (cards, drawers), 480ms (hero entrance).
- **Motion vocabulary**: fade-in, subtle rise (8–16px), soft scale. No bounces, no springs, no spinning, no confetti.
- **Ribbon marquee** scrolls at a slow, readable pace (~40s per loop).

### Transparency / blur

- Cart drawer backdrop: `rgba(43,30,26,.4)` with `backdrop-filter: blur(8px)`.
- Sticky mobile filter bar: cream at `92%` opacity with `blur(16px)`.
- Otherwise, solid colors — transparency is not a decorative effect.

### Layout rules

- **Mobile (<768px)**: single-column, product grid is 2 cols, hero stacks, filter bar sticks to top on scroll.
- **Desktop (≥1024px)**: 12-col grid, product grid is 3–4 cols, hero is split (text left, illustration right).
- **Max content width**: `1200px` centered, with `24px` mobile gutters, `48px` desktop gutters.
- **Sticky elements**: header (always), mobile filter bar (when scrolled past hero), cart FAB (mobile only).

### Cards

Product cards are the hero UI element:

- `20px` radius, no border
- `--shadow-md` resting, `--shadow-lg` on hover with `-2px` translate
- Product image sits on a pastel pink circle (`--r-full`) that bleeds slightly beyond the card top
- Price is `1.25rem` serif italic in terracotta
- Ingredients as up-to-3 pink pills, middot separator
- `+` button floats bottom-right, terracotta filled, circular

### Imagery

When photography is used: warm, natural light, shallow DOF, cream or pink surfaces, a single cake as subject. Never stark white backgrounds, never moody/dark. Placeholder illustrations sit on the pink disc and use flat shapes with a single outline stroke in ink.

---

## ICONOGRAPHY

See `assets/icons/` for the full set and `preview/icons.html` for the card.

- **Primary icon set: Lucide Icons** (via CDN), `1.75` stroke-width, `24px` default. Lucide's gentle rounded ends match the brand feel better than Heroicons' sharper corners.
- **Delivered via CDN**: `https://unpkg.com/lucide-static/icons/{name}.svg` — we reference by name, no npm.
- **Color**: icons inherit `currentColor`. In chrome, that's `--ink`. On the terracotta CTA, that's `--cream`.
- **Stroke weight is locked at 1.75.** Do not mix weights.
- **No emoji as iconography.** Emoji appears only as decorative glyphs in micro-copy (one 🌸 in the toast, for example), never as a button icon.
- **Unicode chars** used in copy: `·` (middot) for ingredient separators, `—` (em-dash) for hours, `đ` for currency. No arrows like `→` in buttons — use Lucide `arrow-right`.
- **The wordmark** is a hand-drawn serif lockup; the brand mark (`M` monogram) is a custom SVG in `assets/logo/`.

### Flagged substitution

→ **Cormorant Garamond** and **DM Sans** are loaded from **Google Fonts** as the system was built without provided font files. If you have licensed display faces you prefer (e.g. a custom serif), drop TTF/WOFF2 files into `fonts/` and update `colors_and_type.css`.

---
