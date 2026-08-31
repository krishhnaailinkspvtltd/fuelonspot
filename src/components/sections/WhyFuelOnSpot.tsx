import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reliabilityPillars, site } from "@/lib/site";

/**
 * The eight commitments, laid out as a specification matrix rather than as a
 * wall of cards.
 *
 * The grid is a single bordered plate: the wrapper is painted `bg-line` and the
 * cells `bg-white`, so the `gap-px` between them reads as one continuous
 * hairline rule — no per-cell borders to double up, no floating panels. Eight
 * cells divide evenly into 1, 2 and 4 columns, so no breakpoint ever leaves a
 * ragged hole in the matrix.
 */
export function WhyFuelOnSpot() {
  return (
    <Section id="why-us" tone="light" labelledBy="why-us-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="why-us-title"
            /* The h2 is fixed copy, so the eyebrow names the subject instead of
               repeating the heading back at the reader. */
            eyebrow={`Why ${site.name}`}
            title="Built Around Reliability"
            description="Eight things we hold ourselves to on every delivery."
          />
        </Reveal>

        {/* role="list" restores the semantics Preflight's list-style:none
            strips in Safari/VoiceOver. */}
        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[4px] border border-line bg-line xs:grid-cols-2 lg:mt-16 xl:grid-cols-4"
        >
          {reliabilityPillars.map((pillar, i) => (
            /* The cell owns the white ground and the hover tint; the Reveal
               sits inside it. If the reveal wrapped the cell instead, every
               not-yet-animated cell would be transparent and the line-coloured
               plate would show through as a solid grey slab. */
            <li
              key={pillar.title}
              className="group bg-white transition-colors duration-200 hover:bg-surface-alt"
            >
              {/* Delays repeat every fourth cell so a row of the widest layout
                  lands together, instead of an eight-step chain. */}
              <Reveal delay={(i % 4) * 60} className="p-6 lg:p-7">
                <div className="flex items-start justify-between gap-4">
                  <Icon
                    name={pillar.icon}
                    strokeWidth={1.7}
                    className="size-5 shrink-0 text-fuel-600 transition-colors duration-200 group-hover:text-navy-800"
                  />
                  {/* Quiet index — the cell's coordinate in the matrix, not a claim. */}
                  <span
                    aria-hidden="true"
                    className="text-micro nums text-line-strong transition-colors duration-200 group-hover:text-navy-600"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* A floor of two lines so the bodies share a baseline across
                    the 4-up row, where the longer titles wrap and the shorter
                    ones do not. */}
                <h3 className="mt-5 font-display text-[1.0625rem] font-bold leading-snug tracking-[-0.02em] text-navy-800 xl:min-h-[2.95rem]">
                  {pillar.title}
                </h3>
                {/* Capped measure so the two-column layout at 1024px does not
                    run the body out to a 75-character line. */}
                <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-ink-500">
                  {pillar.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
