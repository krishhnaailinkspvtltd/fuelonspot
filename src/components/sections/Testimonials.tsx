import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/site";

/**
 * Customer testimonials, printed as the customers wrote them.
 *
 * Deliberately not a carousel: three quotes fit on one screen at desktop and
 * read faster stacked than they would one-at-a-time behind arrows, so this
 * stays a static server component with nothing to hydrate.
 *
 * There is no role, company, avatar, date or rating in `site.ts`, so none
 * appears here. The only structure added around the customers' words is the
 * `theme` field, used as a scan label so a buyer can find the concern that
 * matches their own before committing to the paragraph.
 *
 * The three quotes are very different lengths (a single sentence up to five).
 * Rather than truncate them, the panels stretch to a shared row height and the
 * attribution is pushed to the foot with `mt-auto`, so the hairline and the
 * name land on the same baseline across the row whatever the quote's length.
 */
export function Testimonials() {
  return (
    <Section id="testimonials" tone="alt" labelledBy="testimonials-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="testimonials-title"
            eyebrow="In their words"
            title="What customers say"
            description="Feedback from customers who have diesel delivered to their own site."
          />
        </Reveal>

        {/* Straight to three columns at lg — a 2-up step at md would leave the
            third quote orphaned on its own row. Below lg the single column is
            capped at the same max-w-2xl the SectionHeading uses, so a 768–1023px
            tablet keeps a readable measure and the panel edges stay flush with
            the heading above rather than sitting inside or outside it.
            role="list" restores the semantics Preflight's list-style:none
            strips in Safari/VoiceOver. */}
        <ul
          role="list"
          className="mt-12 grid max-w-2xl grid-cols-1 items-stretch gap-6 lg:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
          {testimonials.map((testimonial, i) => (
            <Reveal
              key={testimonial.name}
              as="li"
              delay={i * 80}
              /* Flex, not block: the grid stretches the li to the row height and
                 the li then stretches the figure, without relying on a
                 percentage height resolving against the grid area. */
              className="flex h-full"
            >
              <figure className="flex h-full w-full flex-col rounded-[4px] border border-line bg-white p-7 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  {/* The theme is the panel's heading, so it is an <h3> under
                      the section's <h2> — same micro-label treatment as the
                      other card headings on the site. `font-sans` is needed
                      because the base h1–h4 rule sets the display face. */}
                  <h3 className="text-micro font-sans text-navy-600">
                    {testimonial.theme}
                  </h3>
                  {/* The one decorative mark on the panel, and the only one:
                      hairline grey, never green — nothing here is actionable. */}
                  <Quote
                    className="size-5 shrink-0 text-line-strong"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                {/* mb-7 sets the minimum gap above the attribution; mt-auto on
                    the figcaption absorbs whatever slack the shorter quotes
                    leave. Preflight has already zeroed the blockquote margin. */}
                <blockquote className="mb-7 mt-5">
                  <p className="font-display text-[1.0625rem] font-semibold leading-relaxed tracking-[-0.01em] text-navy-800 lg:text-[1.125rem]">
                    {testimonial.quote}
                  </p>
                </blockquote>

                <figcaption className="mt-auto border-t border-line pt-5">
                  <span className="text-sm font-semibold text-navy-800">
                    {testimonial.name}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
