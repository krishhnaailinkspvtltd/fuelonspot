# FuelOnSpot — design system contract

Every section component MUST follow this document. It exists so fifteen files
written independently read as one designed website, not fifteen designs.

## Read these first (they are the reference implementation)

- `src/app/globals.css` — tokens, type utilities, motion
- `src/lib/site.ts` — ALL copy. Never hardcode copy that lives here.
- `src/components/ui/*` — the primitives you must reuse
- `src/components/sections/Hero.tsx` — the exemplar. Match its density, its
  comment style, its use of structure over decoration.
- `src/components/layout/Navbar.tsx` — the exemplar for client interactivity.

## The look, in one line

An industrial operations console: hairline rules, square-ish corners, numbered
indices, generous whitespace, navy type, green used only where something is
actionable or live.

## Non-negotiable rules

1. **No gradients** except a single dark scrim over a photo (`from-navy-950/70
   to-transparent`). No gradient text, no gradient backgrounds, no glassmorphism.
2. **Corners are `rounded-[3px]` or `rounded-[4px]`.** Never `rounded-2xl`,
   never `rounded-full` except on a status dot, an avatar, or a pill that holds
   a single short label.
3. **Cards do not float.** Use `border border-line` on `bg-white`. Shadows are
   only allowed on hover, and only as `shadow-[0_16px_40px_-24px_rgba(4,24,46,0.5)]`.
4. **Separate sections with a hairline**, not with a colour blob. The `Section`
   primitive already adds `border-t border-line`.
5. **No invented content.** No statistics, percentages, counters, years in
   business, client counts, awards or certifications. If a number is not in
   `src/lib/site.ts`, it does not go on the page. Customer logos appear ONLY
   where the operator supplied the file, used unmodified — never one taken from
   the web, never a generated approximation, and never recoloured or recropped
   to tidy up a grid. A client with no supplied file stays a typographic card
   (`logo: null`). The one
   third-party name on the site is `association` (Jio-bp), operator-supplied and
   set as **text** — there is no authorised logo asset for it, and it appears in
   exactly two places (hero badge, footer). Do not spread it further, and do not
   add a mark cropped out of the campaign posters.
6. **No lorem ipsum, no filler.** Every line must say something a buyer cares
   about.
7. **One icon per idea.** Do not decorate. Icons come from
   `@/components/ui/Icon` via the `Icon` component, or are imported directly
   from `lucide-react` for one-off UI affordances (arrows, chevrons, phone).
8. Ban this vocabulary in copy: "seamless", "cutting-edge", "revolutionize",
   "empower", "unlock", "world-class", "one-stop", "leverage", "solutions
   provider".

## Tokens (Tailwind classes generated from `@theme`)

Navy: `navy-950 navy-900 navy-800 navy-700 navy-600 navy-500` · `sky-400`
Green: `fuel-800 fuel-700 fuel-600 fuel-500 fuel-400 fuel-100 fuel-50`
Ink: `ink-900 ink-700 ink-600 ink-500`
Surfaces: `surface` `surface-alt` `surface-tint` · Lines: `line` `line-strong`
On dark: `onnavy-100 onnavy-300 onnavy-500`

Usage:
- Headings → `text-navy-800`. Body → `text-ink-500` (or `ink-600` when dense).
- On dark sections: headings `text-white`, body `text-onnavy-300`, accents
  `text-fuel-400`.
- Green (`fuel-600`) is for primary buttons, the eyebrow tick, active states,
  live dots and step numbers. Nothing else.

## Type utilities (already fluid — do not re-invent sizes)

`text-display` (h1 only) · `text-h2` · `text-h3` · `text-lead` · `text-micro`
(uppercase tracked label) · `nums` (tabular figures — use on phone numbers,
step indices, quantities).

Body copy: plain `text-sm` / `text-base` / `text-[0.9375rem]`.

## Primitives — reuse, do not re-implement

```tsx
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";        // tone: "light" | "alt" | "dark"
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink, Button } from "@/components/ui/Button"; // variant: primary | navy | outline | outlineDark | quiet
import { Reveal } from "@/components/ui/Reveal";           // delay in ms, variant: "rise" | "fade"
import { Icon } from "@/components/ui/Icon";               // <Icon name={item.icon} className="size-5" />
import { Logo, LogoMark } from "@/components/ui/Logo";     // Logo plate={true} on dark
import { cn } from "@/lib/cn";
```

`Section` handles vertical rhythm (`py-16 sm:py-20 lg:py-28`) and the top
hairline. Always put content inside a `Container`.

## Section shell pattern

```tsx
export function Thing() {
  return (
    <Section id="thing" tone="alt" labelledBy="thing-title">
      <Container>
        <SectionHeading
          id="thing-title"
          eyebrow="Eyebrow text"
          title="The heading"
          description="One or two sentences."
        />
        <div className="mt-12 lg:mt-16">…</div>
      </Container>
    </Section>
  );
}
```

- Gap between the heading block and the content grid: `mt-12 lg:mt-16`.
- Grid gaps: `gap-px` for joined cells, otherwise `gap-6 lg:gap-8`.

## Motion

Wrap entering blocks in `<Reveal>`. Stagger list items with
`delay={index * 70}` capped around 350ms. Hover transitions are
`transition-colors duration-200` or `duration-300`; never longer. Nothing
loops except the hero status dot. Reduced motion is already handled globally.

## Responsiveness — this is graded

Must be correct at 375, 480, 768, 1024, 1280 and 1440 px.

- Mobile is not a squeezed desktop. Multi-column comparisons stack; horizontal
  timelines become vertical; 4-up grids go 1-up (or 2-up if the cell is small
  like an industry tile).
- Touch targets ≥ 44px. Buttons full-width on mobile (`w-full xs:w-auto`).
- No horizontal overflow, ever. Long strings (emails, addresses) need
  `break-words`. Wide content scrolls inside its own container.
- Use the `xs:` breakpoint (480px) where a two-up works but one-up wastes space.

## Accessibility

- Exactly one `<h1>` on the page (Hero owns it). Sections use `<h2>`, cards
  `<h3>`. Never skip a level.
- Every `Section` gets `labelledBy` pointing at its `<h2>` id.
- Decorative icons/images: `aria-hidden="true"` / `alt=""`. Meaningful images
  get real alt text describing the scene.
- Interactive elements are `<button>` or `<a>`, never a clickable `<div>`.
- Accordions: `<button aria-expanded aria-controls>` + a region with `id`.
- Do not remove focus outlines; the global `:focus-visible` style handles them.

## Client vs server components

Default to server components (no directive). Add `"use client"` ONLY for:
FAQ (accordion), Contact (form), Testimonials (if it has a carousel),
ServiceAreas (if it has hover/selection state). Everything else is static.

## Images

Use `next/image` with explicit `width`/`height` and a `sizes` prop. Available
files (all under `public/images/`):

| file | intrinsic | subject |
|---|---|---|
| `hero-refueling.jpg` | 1600×1200 | road tanker at dusk — JSON-LD `image` only, no longer on the page |
| `construction-site.jpg` | 1200×900 | excavator on an active site |
| `industrial-facility.jpg` | 1200×900 | process plant lit at twilight |
| `backup-generator.jpg` | 1200×900 | enclosed standby DG set |
| `commercial-fleet.jpg` | 1200×900 | line of tanker trucks at a depot |
| `fuel-operations.jpg` | 1200×1400 | petroleum transport tanker (portrait) |
| `fuelonspot-diesel-delivery.webp` | 1254×1005 | supplied hero poster (Jio-bp lockup, 7 Lakh figure, phone) |
| `fuelonspot-7-lakh-delivered.webp` | 1122×1402 | supplied "7 Lakh+ LTR" campaign poster |
| `leadership/vipul-p-shah.webp` | 900×1125 | Vipul P. Shah, Founder (studio portrait) |
| `leadership/nirmit-d-shah.webp` | 900×1125 | Nirmit D. Shah, Co-Founder (studio portrait) |

`solutions[]` in `site.ts` already carries `image` and `imageAlt`; so do
`achievement` (`poster` / `posterAlt`) and each `leadership[]` entry (`photo` /
`photoAlt`). The two portraits are paired with their person in `site.ts` — do
not swap them, and do not retouch either face.

Both supplied posters are shown **whole**: `h-auto w-full` inside a bordered
frame, never a fixed aspect box with `object-cover`. They carry a Jio-bp
lockup, a phone number and the delivery figure, and none of that may be
cropped. Do not lay scrims, corner rules or caption cards over finished
artwork either.

## The coverage map

`components/coverage/CoverageMap.tsx` draws **real administrative boundaries**,
not an illustration. Geometry lives in the generated `lib/coverage-map.ts`
(rebuild with `node scripts/build-coverage-map.mjs`); pin positions come from
the real `lon`/`lat` on each `serviceAreas[]` entry and are projected with the
same maths as the paths, so the two can never drift.

- No map library and no tile server. Nothing pans or zooms, so an inline SVG
  beats shipping Leaflet plus network tiles for a picture that is only looked at.
- The graphic and its legend are `aria-hidden`; the list beside it is the
  accessible control. The licence credit sits outside that subtree because it
  contains a real link.
- **Keep the geoBoundaries credit under the map** — CC BY 4.0 / ODbL require it.
- Never hand-edit the path strings, and never add a service area to the map
  without a verified coordinate.

## Phone / email / links

Always `site.phoneHref` (`tel:+919998621701`) and `site.emailHref`
(`mailto:info@fuelonspot.com`). Display them with `site.phoneDisplay`
(`+91 99986 21701`) and `site.email` (`info@fuelonspot.com`), and put the `nums`
utility on any rendered number. Never hardcode any of them — they all live in
`site.ts` and every reference on the page derives from them. For E.164
(schema.org `telephone`) strip the scheme off `phoneHref`; do not rebuild it
from `phoneDisplay`.

`site.phoneAltDisplay` / `phoneAltHref` (`+91 94280 28112`) is a **second line
listed in the footer only**. Every CTA — navbar, hero, emergency band, contact
panel, FAQ, service areas — stays on the primary number, so there is exactly
one number to call from anywhere that asks for a delivery.

**There are no operating hours.** No 24×7, no "round the clock", no "at any
hour", and no `openingHoursSpecification` in the JSON-LD. `site.tagline`
("Mobile Refueling | Anytime. Anywhere.") stays — that is the supplied logo
artwork's own wording, not an hours claim.

## Deliverable shape

One file, one named export, no default export. Typed with the `as const` data
from `site.ts` (read the types; do not redeclare them). Comments only where a
decision is non-obvious — match the density in `Hero.tsx`.
