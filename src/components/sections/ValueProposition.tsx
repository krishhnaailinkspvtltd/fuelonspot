import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { comparison } from "@/lib/site";

/**
 * The minimal shape both halves of `comparison` already have. Declaring the
 * contract structurally (rather than a union of the two `as const` literals)
 * keeps `steps.map` callable while site.ts stays the only source of copy.
 */
type ComparisonColumn = {
  readonly label: string;
  readonly steps: readonly { readonly title: string; readonly note: string }[];
};

/**
 * The two sides differ only in treatment, never in structure — so the classes
 * are tabulated here and one panel component renders both. Left reads as
 * friction (grey ground, grey markers); right reads as resolved (white ground,
 * green markers, green index).
 */
const treatments = {
  traditional: {
    icon: X,
    panel: "bg-surface-alt",
    accent: "bg-line-strong",
    label: "text-ink-500",
    index: "text-ink-500",
    marker: "border-line-strong bg-surface text-ink-500",
    title: "text-ink-700",
    rail: "bg-line-strong",
  },
  withUs: {
    icon: Check,
    panel: "bg-white",
    accent: "bg-fuel-500",
    label: "text-navy-800",
    index: "text-fuel-600",
    marker: "border-fuel-100 bg-fuel-50 text-fuel-600",
    title: "text-navy-800",
    rail: "bg-line",
  },
} as const;

type Variant = keyof typeof treatments;

function ComparisonPanel({
  column,
  variant,
}: {
  column: ComparisonColumn;
  variant: Variant;
}) {
  const t = treatments[variant];
  const Marker = t.icon;
  const lastIndex = column.steps.length - 1;

  return (
    <div className={cn("flex min-w-0 flex-col", t.panel)}>
      {/* Top edge. Both panels carry one so the two headers stay on the same
          baseline; only its colour says which side you are looking at. */}
      <div aria-hidden="true" className={cn("h-1 shrink-0", t.accent)} />

      <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6 lg:px-8 lg:py-5">
        <span
          aria-hidden="true"
          className={cn("h-[3px] w-6 shrink-0", t.accent)}
        />
        {/* font-sans: the base stylesheet sets the display face on every h3,
            and every other micro label on the site is set in the sans face. */}
        <h3 className={cn("text-micro font-sans", t.label)}>{column.label}</h3>
      </div>

      {/* An ordered list because the indices are the ordinals; role="list"
          restores the semantics Preflight's list-style:none strips in
          Safari/VoiceOver. */}
      <ol
        role="list"
        className="space-y-6 px-5 py-6 sm:px-6 sm:py-7 lg:space-y-7 lg:px-8 lg:py-9"
      >
        {column.steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            delay={i * 60}
            className="flex gap-3 sm:gap-4"
          >
            <span
              aria-hidden="true"
              className={cn("text-micro nums mt-1.5 w-6 shrink-0", t.index)}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Marker gutter. It stretches to the row height, so the connector
                can be anchored to it and run down into the next marker without
                depending on how many lines the copy wrapped to. */}
            <div className="relative flex w-5 shrink-0 items-start justify-center">
              <span
                className={cn(
                  "relative z-10 mt-0.5 inline-flex size-5 items-center justify-center rounded-[3px] border",
                  t.marker,
                )}
              >
                <Marker className="size-3" strokeWidth={2.4} aria-hidden="true" />
              </span>
              {i !== lastIndex && (
                /* top-6 / -bottom-7 leave the same 2px of air at both ends of
                   the hairline: the marker ends at 22px, and the row gap at
                   this breakpoint is exactly 28px. */
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-7 left-1/2 top-6 hidden w-px -translate-x-1/2 lg:block",
                    t.rail,
                  )}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-display text-[0.9375rem] font-bold leading-6 tracking-[-0.015em]",
                  t.title,
                )}
              >
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">
                {step.note}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export function ValueProposition() {
  return (
    <Section id="why" tone="light" labelledBy="why-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="why-title"
            eyebrow="The cost of fetching fuel"
            title={comparison.heading}
            description={comparison.intro}
          />
        </Reveal>

        {/* One object, not two cards: the frame owns the border, and gap-px
            over a line-coloured ground draws the single divider between the
            halves — vertical from md up, horizontal once they stack. The frame
            itself does not animate; the steps inside it do. */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-2 lg:mt-16">
          <ComparisonPanel
            column={comparison.traditional}
            variant="traditional"
          />
          <ComparisonPanel column={comparison.withUs} variant="withUs" />
        </div>
      </Container>
    </Section>
  );
}
