import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { emergencyCta, serviceAreas, site } from "@/lib/site";

/**
 * The conversion band — the page's second-strongest ask after the contact form.
 *
 * Deliberately the only dark band between the light sections, so it reads as a
 * hard stop rather than another card grid. Structure carries the emphasis:
 * blueprint grid + a single large ring bleeding off the right edge, echoing the
 * hero's circle motif. No photo, no gradient, no glow.
 */
export function EmergencyCTA() {
  return (
    // This band gets more room on either side than any other section. `cn` is a
    // plain joiner, not tailwind-merge, so the padding override needs `!` to
    // beat Section's own py-* (same convention as Leadership).
    <Section
      id="emergency"
      tone="dark"
      labelledBy="emergency-title"
      className="isolate overflow-hidden py-20! sm:py-24! lg:py-32!"
    >
      {/* Structural background. `overflow-hidden` above lets the ring run off
          the right edge instead of widening the page. */}
      <div
        aria-hidden="true"
        className="blueprint-grid pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -right-40 top-1/2 hidden size-[44rem] -translate-y-1/2 rounded-full border border-white/10 lg:block" />
      </div>

      <Container>
        <div className="flex flex-col gap-12 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:text-left xl:gap-24">
          {/* ------------------------------------------------------ message */}
          {/* Written out rather than using <SectionHeading>: that primitive
              takes a plain string eyebrow and a fixed alignment, and this block
              needs a live dot inside the eyebrow plus centre→left alignment.
              The spacing tokens below are the ones SectionHeading uses. */}
          <Reveal className="lg:min-w-0 lg:flex-1">
            <Eyebrow tone="dark" className="justify-center lg:justify-start">
              {/* Live dot, same treatment as the hero status chip. This and
                  the hero are the only two looping elements on the page. It is
                  a brand flourish, not an availability claim — operating hours
                  are not verified and nothing here may imply them. */}
              <span aria-hidden="true" className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-2 rounded-full bg-fuel-500 [animation:fos-pulse-ring_2.4s_ease-out_infinite]" />
                <span className="relative inline-flex size-2 rounded-full bg-fuel-500" />
              </span>
              Emergency supply
            </Eyebrow>

            <h2 id="emergency-title" className="text-h2 mt-5 text-white">
              {emergencyCta.heading}
            </h2>

            <p className="text-lead mx-auto mt-5 max-w-xl text-onnavy-300 lg:mx-0">
              {emergencyCta.sub}
            </p>
          </Reveal>

          {/* --------------------------------------------------------- asks */}
          <Reveal delay={120} className="lg:w-[20rem] lg:shrink-0 xl:w-[22rem]">
            {/* The buttons size themselves: each reserves 16rem before the row
                is allowed to sit two-up, which is the width the longer label
                needs — so it can never wrap inside the fixed-height button.
                Result: stacked full-width on phones, two-up from ~564px, and
                stacked again inside the narrow lg rail. */}
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href="#contact"
                size="lg"
                className="w-full xs:w-auto xs:min-w-[16rem] xs:flex-1"
              >
                Request Fuel Delivery
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </ButtonLink>

              <ButtonLink
                href={site.phoneHref}
                variant="outlineDark"
                size="lg"
                className="nums w-full xs:w-auto xs:min-w-[16rem] xs:flex-1"
              >
                <Phone className="size-4" strokeWidth={2.1} aria-hidden="true" />
                Call {site.phoneDisplay}
              </ButtonLink>
            </div>

            <p className="mt-5 border-t border-white/10 pt-4 text-[0.8125rem] text-onnavy-500">
              Doorstep fuel delivery across{" "}
              {serviceAreas.map((area) => area.name).join(", ")}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
