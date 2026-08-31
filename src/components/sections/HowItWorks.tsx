import { Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { processSteps, site } from "@/lib/site";

/**
 * The four-step delivery process.
 *
 * One list, three layouts: a vertical timeline on phones, bordered 2×2 cells on
 * tablets, and a horizontal rail on desktop. The rail is not one long line —
 * each step draws the segment to its *right*, so the last step draws none and
 * the rail can never dangle past the first or last marker at any column width.
 */
export function HowItWorks() {
  const lastIndex = processSteps.length - 1;

  return (
    <Section
      id="how-it-works"
      tone="dark"
      labelledBy="how-title"
      className="overflow-hidden"
    >
      {/* Engineered ground for the dark band — a blueprint grid rather than a
          gradient wash. Sits under the Container, which is positioned so it
          paints on top. */}
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0"
      />

      <Container className="relative">
        <Reveal>
          <SectionHeading
            id="how-title"
            tone="dark"
            eyebrow="The process"
            title="Fuel Delivery, Simplified."
            description="Four steps from the moment you call to the moment your equipment is running again."
          />
        </Reveal>

        {/* An ordered list because the indices are the ordinals; role="list"
            restores the semantics Preflight's list-style:none strips in
            Safari/VoiceOver. No mobile `gap`: the steps space themselves with a
            margin so the vertical rail can run through it. */}
        <ol
          role="list"
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-4 lg:gap-8"
        >
          {processSteps.map((step, i) => {
            const isLast = i === lastIndex;

            return (
              <Reveal
                key={step.step}
                as="li"
                delay={i * 90}
                className={cn(
                  // Mobile spacing is a margin, not padding, so the vertical
                  // rail can run through the gap to the next marker.
                  "relative mb-10 last:mb-0 sm:mb-0",
                  "sm:rounded-[4px] sm:border sm:border-white/15 sm:p-6",
                  "lg:rounded-none lg:border-0 lg:p-0",
                )}
              >
                {/* Mobile rail: stops 8px short of the next marker, and is not
                    rendered at all on the last step. */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-8 left-6 top-14 w-px -translate-x-1/2 bg-white/15 sm:hidden"
                  />
                )}

                {/* Desktop step index — decorative watermark, so it is hidden
                    from assistive tech; the ordered list carries the sequence
                    and the visible index below covers smaller screens. */}
                <span
                  aria-hidden="true"
                  className="nums hidden font-display text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-white/15 lg:block"
                >
                  {step.step}
                </span>

                <div className="sm:flex sm:items-center lg:relative lg:mt-5">
                  {/* Desktop rail segment: from this node's right edge across
                      the grid gutter to the next node's left edge. */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-8 left-14 top-1/2 hidden h-px -translate-y-1/2 bg-white/15 lg:block"
                    />
                  )}
                  <span className="absolute left-0 top-0 inline-flex size-12 items-center justify-center rounded-[3px] border border-white/20 bg-navy-900 text-fuel-400 sm:static lg:size-14">
                    <Icon
                      name={step.icon}
                      className="size-5 lg:size-6"
                      strokeWidth={1.7}
                    />
                  </span>
                </div>

                {/* Left inset clears the pinned mobile marker (48px node +
                    24px gutter); the cell layouts drop it. */}
                <div className="pl-[4.5rem] sm:mt-5 sm:pl-0 lg:mt-5">
                  <span className="text-micro nums block text-fuel-400 lg:hidden">
                    {step.step}
                  </span>
                  <h3 className="text-h3 mt-2.5 text-white lg:mt-0">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-onnavy-300 lg:max-w-[26ch]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={120}>
          {/* One row: the sentence takes the slack, the button never shrinks
              below its label. Stacks under 480px where the two do not fit. */}
          <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 xs:flex-row xs:items-center xs:gap-6 lg:mt-16">
            <p className="min-w-0 text-base text-onnavy-100">
              Step one is a phone call to our team.
            </p>
            <ButtonLink
              href={site.phoneHref}
              size="lg"
              className="nums w-full shrink-0 justify-center xs:w-auto"
            >
              <Phone className="size-4" strokeWidth={2.1} aria-hidden="true" />
              Call {site.phoneDisplay}
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
