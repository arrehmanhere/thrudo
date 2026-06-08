# Thru Do — Landing Page

Premium marketing site for **Thru Do** — hands-free Shopify ownership for UK investors.
Pure **HTML + CSS + JavaScript**. No build step, no framework, no runtime dependencies.
Deploys to any static host as-is.

---

## Project structure

```
thru-do/
│
├── index.html              # Single-page site (semantic, SEO, JSON-LD)
│
├── assets/
│   └── fonts/              # Self-hosted, subsetted woff2 (Fraunces · Inter · JetBrains Mono)
│
├── css/
│   ├── fonts.css           # @font-face declarations (unicode-range subsets)
│   ├── style.css           # Design tokens + component styles (mobile-first base)
│   ├── animations.css      # Keyframes, scroll-reveal, reduced-motion handling
│   └── responsive.css      # All media queries, large → small
│
├── js/
│   ├── main.js             # Mobile nav, scroll-spy, cursor glow, hero parallax
│   ├── animations.js       # IntersectionObserver reveals + count-up stats
│   └── components.js       # Packages carousel (snap, dots, arrows, drag)
│
└── README.md
```

---

## Design system

| Token group | Values |
|-------------|--------|
| **Palette** | Midnight navy `#0B1A2E`, cream `#F5EFE2`, paper `#FAF6EC`, brass `#B87E3E`, emerald `#1F5B3A` |
| **Display** | Fraunces (serif, 300–500, upright + italic) |
| **Body / UI** | Inter (300–600) |
| **Mono** | JetBrains Mono — eyebrows, labels, numerics |
| **Rhythm** | Fluid via `clamp()` — `--section-y`, `--wrap-x` |
| **Easing** | `--ease: cubic-bezier(.2,.7,.2,1)` |

All colours, fonts and spacing live as CSS custom properties at the top of `css/style.css`.

---

## What was improved from the original

- **Split** one 696 KB self-extracting bundle into a clean, maintainable multi-file project.
- **Self-hosted fonts** — extracted the embedded woff2 into `assets/fonts/` (≈480 KB total, subsetted, `font-display:swap`, two preloaded for the hero). No third-party font requests.
- **Real mobile navigation** — accessible hamburger + drawer (the original simply hid the links under 780 px with no replacement).
- **SEO** — meta description, canonical, Open Graph, Twitter Card, and `Organization` JSON-LD with the three offers.
- **Accessibility** — skip link, visible `:focus-visible` rings, ARIA on the toggle/menu, semantic `<main>`/`<ol>`/`<nav>` landmarks, `aria-hidden` on decorative art.
- **Fluid everything** — headings, ledes, section padding and gutters scale with `clamp()`; verified clean from 320 px to 2560 px+ with no horizontal scroll.
- **Scroll-spy** highlights the active nav item.
- **Resilience** — `.reveal` content only hides while the `.js` flag is set, so the page is never blank if JavaScript fails.
- **Reduced motion** — honoured throughout (decorative loops stop, reveals show instantly, counters jump to final value).

---

## Performance notes

- Zero JS libraries; three small deferred scripts.
- Animations use only `transform` / `opacity` (GPU-friendly, no layout thrash).
- Scroll work is throttled with `requestAnimationFrame`; reveals/counters use `IntersectionObserver`.
- Fonts are subsetted woff2 with `unicode-range`; the two above-the-fold faces are preloaded.
- No external network calls — fully offline-capable.

---

## Run locally

Any static file server works. From the project root:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>. (Opening `index.html` via `file://` works too, but a
local server is recommended so font preloads and relative paths behave exactly as in production.)

---

## Deploy

Static hosting, no configuration needed. Pick one:

- **Netlify** — drag the folder onto the dashboard, or `netlify deploy --prod`.
- **Vercel** — `vercel --prod` (framework preset: *Other*).
- **GitHub Pages** — push to a repo, enable Pages on the default branch root.
- **Cloudflare Pages / S3 / any CDN** — upload the folder; serve `index.html`.

### Before going live
- Wire up the booking links (CTA button + footer "Book a call") and replace placeholder links (`Privacy`, `LinkedIn`) once a contact method exists.
- Swap the founder portrait placeholder (`.portrait`) for a real image.
- Update the `og:url` / `canonical` if the domain differs from `thrudo.com`.
- Add an `og:image` (1200×630) once brand artwork is ready.

---

© Thru Do Ltd. · Lahore · London
