import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/lib/site";

/**
 * Industries — a scan-in-one-look index rather than a handful of illustrated
 * cards. Fifteen sectors is itself the argument ("whatever you run, we already
 * fuel it"), so the layout's only job is to let a buyer find their own trade
 * without reading a paragraph.
 *
 * Column counts are picked so the list divides evenly where it matters:
 * 5-across (3 rows) at xl and 3-across (5 rows) from 480px up to md. The 2-up
 * and 4-up steps in between leave a short final row, which the uniform tile
 * min-height keeps from reading as a mistake.
 */
export function Industries() {
  return (
    <Section id="industries" tone="alt" labelledBy="industries-title">
      <Container>
        <SectionHeading
          id="industries-title"
          eyebrow="Who we fuel"
          title="Industries We Serve"
          description="Anywhere diesel is consumed on site, we deliver to it."
        />

        {/* role="list" restores the semantics Preflight's list-style:none
            strips in Safari/VoiceOver. */}
        <ul
          role="list"
          className="mt-12 grid grid-cols-2 gap-6 xs:grid-cols-3 md:grid-cols-4 lg:mt-16 lg:gap-8 xl:grid-cols-5"
        >
          {/* Stagger caps at the tenth tile: a full 15-step ramp would still
              be animating cells that scrolled into view rows earlier. */}
          {industries.map((industry, i) => (
            <Reveal
              key={industry.name}
              as="li"
              delay={Math.min(i, 9) * 45}
              className="group flex min-h-[7.5rem] flex-col rounded-[3px] border border-line bg-white p-4 transition-colors duration-200 hover:border-navy-800 hover:bg-surface-tint sm:min-h-[8.25rem] sm:p-5"
            >
              <Icon
                name={industry.icon}
                className="size-6 shrink-0 text-navy-600 transition-colors duration-200 group-hover:text-fuel-600"
              />
              {/* Dropped to the foot of the tile so every name in a row shares
                  a baseline whatever its line count. Hyphenation is the safety
                  valve for "Telecommunications", which is wider than a 3-up
                  cell at 480px; break-words catches anything narrower still. */}
              <span className="mt-auto hyphens-auto text-balance break-words pt-3 text-sm font-semibold leading-snug text-navy-800">
                {industry.name}
              </span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
