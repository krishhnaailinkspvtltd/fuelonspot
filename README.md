# FuelOnSpot — marketing site

Production-quality single-page marketing site for **FuelOnSpot**, a doorstep
diesel delivery and mobile refueling operator based in Vadodara, Gujarat.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- lucide-react for icons
- No backend — the contact form is a validated client-side demo

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
npm run lint
```

## Where things live

```
src/
  app/
    layout.tsx            fonts (Inter + Manrope), SEO metadata, viewport
    page.tsx              section composition order
    globals.css           design tokens, type scale, motion, surface treatments
    opengraph-image.tsx   generated 1200×630 social card
    robots.ts sitemap.ts
    icon.png apple-icon.png   generated from the logo mark
  lib/site.ts             ALL copy and contact details — single source of truth
  components/
    ui/                   Container, Section, SectionHeading, Eyebrow,
                          Button, Reveal, Icon, Logo
    layout/               Navbar, Footer
    sections/             one file per page section
    StructuredData.tsx    LocalBusiness + FAQPage JSON-LD
public/
  fuelonspot-logo.png     supplied logo, background removed, unmodified colours
  fuelonspot-mark.png     emblem only
  images/                 photography (cropped and optimised)
scripts/                  one-off asset build scripts (sharp)
```

`DESIGN.md` is the design contract every section follows. Read it before
adding a section.

## Content rules

Everything on the page is grounded in the operator's own published material.
There are no invented statistics, awards, certifications, partner logos or
customer logos, and customer testimonials are reproduced as written.

## Editing copy

Change `src/lib/site.ts`. Nothing else should hold user-visible strings.

## Brand assets

`scripts/build-logo.mjs` and `scripts/build-mark.mjs` regenerate the PNG assets
from `logo-source.jpeg` (luminance-keyed alpha to drop the paper background,
then a tight trim). `scripts/build-images.mjs` crops and compresses the
photography. Re-run with `node scripts/<name>.mjs`.
