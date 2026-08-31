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
   business, client counts, awards, certifications, partner or customer logos.
   If a number is not in `src/lib/site.ts`, it does not go on the page.
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
| `hero-refueling.jpg` | 1600×1200 | road tanker in traffic at dusk |
| `construction-site.jpg` | 1200×900 | excavator on an active site |
| `industrial-facility.jpg` | 1200×900 | process plant lit at twilight |
| `backup-generator.jpg` | 1200×900 | enclosed standby DG set |
| `commercial-fleet.jpg` | 1200×900 | line of tanker trucks at a depot |
| `fuel-operations.jpg` | 1200×1400 | petroleum transport tanker (portrait) |

`solutions[]` in `site.ts` already carries `image` and `imageAlt`.

## Phone / email / links

Always `site.phoneHref` (`tel:8448444704`), `site.emailHref`
(`mailto:Info@readyfuel.in`). Display the number with the `nums` utility.

## Deliverable shape

One file, one named export, no default export. Typed with the `as const` data
from `site.ts` (read the types; do not redeclare them). Comments only where a
decision is non-obvious — match the density in `Hero.tsx`.
