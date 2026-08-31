import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { leadership, site } from "@/lib/site";

/**
 * Two names — and no photographs, biographies or profiles exist for them.
 *
 * So this stays deliberately small: a heading column beside one joined block
 * of two entries, rather than a team grid stretched across the page with
 * portrait-shaped holes in it. The width is spent on the heading, not on
 * padding out the people.
 */
export function Leadership() {
  return (
    // Tighter than the standard band (py-16 sm:py-20 lg:py-28): six lines of
    // content do not earn full section rhythm. The `!` is load-bearing — `cn`
    // only concatenates, and between two same-property utilities it is CSS
    // order that decides, not class order, so the primitive's larger padding
    // would otherwise win at every breakpoint.
    <Section
      id="leadership"
      tone="light"
      labelledBy="leadership-title"
      className="py-14! sm:py-16! lg:py-20!"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center xl:gap-16">
          {/* ------------------------------------------------------ heading */}
          <Reveal className="lg:col-span-5">
            <SectionHeading
              id="leadership-title"
              eyebrow="Leadership"
              title={`The people behind ${site.name}`}
            />
          </Reveal>

          {/* ------------------------------------------------------- people */}
          {/* One bordered block split by a hairline — the same joined-cell
              treatment used elsewhere on the page — so two entries read as a
              register rather than as two lonely floating cards. `bg-line`
              shows through the 1px grid gap. role="list" restores the
              semantics Preflight's list-style:none strips in Safari/VoiceOver. */}
          <Reveal delay={70} className="lg:col-span-7">
            <ul
              role="list"
              className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2"
            >
              {leadership.map((person) => (
                <li
                  key={person.name}
                  /* The roomier padding waits for xl, not lg: the 7-of-12 track
                     is at its narrowest between 1024 and 1279px, and that is
                     exactly where the row needs the width for "Co-Founder of
                     FuelOnSpot" rather than more gutter. */
                  className="flex items-center gap-4 bg-white p-5 xl:p-6"
                >
                  {/* Initials stand in for a portrait we do not have. Hidden
                      from assistive tech: the full name sits right beside it. */}
                  <span
                    aria-hidden="true"
                    className="grid size-14 shrink-0 place-items-center rounded-[3px] bg-navy-800 font-display text-[1.0625rem] font-extrabold tracking-[0.02em] text-white"
                  >
                    {person.initials}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.0625rem] font-bold leading-snug tracking-[-0.02em] text-navy-800">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm leading-snug text-ink-500">
                      {person.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
