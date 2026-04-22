---
name: mira-banhngot-design
description: Use this skill to generate well-branded interfaces and assets for Mira Bánh Ngọt — a Vietnamese artisan bakery — either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **Brand**: Vietnamese artisan bakery. Tone: sweet, feminine, warm, unhurried.
- **Palette**: cream paper (`#FBF5EC`), pastel pink (`#F4C2C2`/`#F9DCDC`), terracotta accent (`#B84A39`), warm ink (`#2B1E1A`).
- **Type**: Cormorant Garamond italic for display/product names, DM Sans for body, Caveat for small script accents.
- **Motifs**: pastel pink discs behind product imagery, warm tinted shadows, hand-drawn illustrations, terracotta ribbon for USPs.
- **Voice**: Vietnamese-first, "tiệm" / "bạn", lowercase okay in decorative spots, title case for product names, prices like `85.000đ`.

## Files

- `README.md` — brand overview, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — all design tokens as CSS variables
- `assets/` — logos, illustrations, icons
- `ui_kits/website/` — reference React implementation of the storefront
- `preview/` — individual cards per token/component

## Don'ts

- No bluish-purple gradients, no pure white, no pure black
- No emoji as iconography (one decorative 🌸 is okay)
- No all-caps buttons, no hard-sell English
- No photographic full-bleed heroes; hero uses one illustration on a pink disc
