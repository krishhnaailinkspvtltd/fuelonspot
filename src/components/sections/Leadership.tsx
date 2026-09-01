import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { leadership, site } from "@/lib/site";

/**
 * Two people, two supplied studio portraits, and nothing else — no
 * biographies, tenures or profiles exist for either of them.
 *
 * So the section keeps the heading pinned to its own column beside one joined
 * block of two cards, rather than a full-width team grid that would have to be
 * padded out with copy nobody wrote. The portraits are held to a 4:5 frame
 * around 300px wide: large enough to read as a real leadership photograph,
 * small enough that the section stays a register of two names rather than a
 * gallery.
 */
export function Leadership() {
  return (
    <Section id="leadership" tone="light" labelledBy="leadership-title">
      <Container>
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* ------------------------------------------------------ heading */}
          <Reveal className="lg:col-span-5">
            <SectionHeading
              id="leadership-title"
              eyebrow="Leadership"
              title={`The People Behind ${site.name}`}
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
              className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line xs:grid-cols-2"
            >
              {leadership.map((person) => (
                <li
                  key={person.name}
                  /* Two card layouts, and the switch is the point. Below 480px
                     a stacked card would run a ~285px portrait and turn two
                     names into two screens of scrolling, so the phone gets a
                     96px thumbnail beside the name. From xs up there is room
                     for the portrait to lead. */
                  className="flex items-center gap-4 bg-white p-4 xs:block sm:p-5 xl:p-6"
                >
                  {/* The portrait is framed rather than bled to the card edge:
                      both photographs are shot on a near-white backdrop, so
                      without a hairline they would dissolve into the card. */}
                  <div className="relative w-24 shrink-0 overflow-hidden rounded-[3px] border border-line bg-surface-alt xs:w-auto">
                    <Image
                      src={person.photo}
                      alt={person.photoAlt}
                      width={900}
                      height={1125}
                      /* object-top, not centre: the crop is head-and-shoulders
                         already, and centring would shave the top of the head
                         if the frame is ever squared off. */
                      className="aspect-[4/5] w-full object-cover object-top"
                      sizes="(min-width: 1280px) 300px, (min-width: 1024px) 260px, (min-width: 480px) 45vw, 96px"
                    />
                    {/* The hero's green corner rule, at card scale. */}
                    <div
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-8 w-[3px] bg-fuel-500 xs:h-10"
                    />
                  </div>

                  <div className="min-w-0 xs:mt-4 xl:mt-5">
                    <h3 className="font-display text-[1.0625rem] font-bold leading-snug tracking-[-0.02em] text-navy-800">
                      {person.name}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold leading-snug text-fuel-700">
                      {person.role}
                    </p>
                    <p className="text-micro mt-2 text-ink-500">{site.name}</p>
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
