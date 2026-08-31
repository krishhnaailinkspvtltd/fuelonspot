import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { solutions } from "@/lib/site";

/**
 * Our Solutions — the four delivery programmes.
 *
 * Each card reads top-to-bottom like a spec sheet: the site the fuel goes to
 * (photo), the programme (icon + title + description), then a hairline and the
 * equipment it is built for. There are no sub-pages, so a card is an
 * <article>, never an anchor — no pointer cursor, no dead "Learn more".
 */
export function Solutions() {
  return (
    <Section id="solutions" tone="alt" labelledBy="solutions-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="solutions-title"
            eyebrow="What we deliver"
            title="Our Solutions"
            description="Four delivery programmes, each shaped around where the fuel is actually consumed."
          />
        </Reveal>

        {/* 1-up on phones; 2-up from 768px, where a cell is still as wide as a
            card on a 375px screen — so the mobile layout is never a squeeze.
            Four cards divide evenly into 1 and 2 columns, so no breakpoint
            leaves an orphan cell. role="list" restores the semantics
            Preflight's list-style:none strips in Safari/VoiceOver. */}
        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8"
        >
          {solutions.map((s, i) => (
            /* Flex li, not block: the grid stretches the cell to the row height
               and the cell then stretches the article, without relying on a
               percentage height resolving against the grid area. */
            <Reveal key={s.id} as="li" delay={i * 80} className="flex h-full">
              <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-[4px] border border-line bg-white transition-colors duration-300 hover:border-navy-800">
                {/* Hover tell: a 2px rule that draws in along the top edge.
                    z-10 keeps it over the photo, which is also positioned. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left scale-x-0 bg-fuel-500 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />

                {/* ----------------------------------------------- photo */}
                <div className="relative overflow-hidden bg-navy-950">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    width={1200}
                    height={900}
                    /* The cell is already half the viewport from md, not from
                       lg, so the breakpoint here has to match the grid or
                       tablets fetch a full-width image for a half-width slot. */
                    sizes="(min-width: 768px) 46vw, 100vw"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Index chip — the card's place in the set, not a claim, so
                      it is hidden from assistive tech; the list already carries
                      the order. text-micro's 0.16em tracking leaves a trailing
                      gap after the last figure, hence the tighter right pad. */}
                  <span
                    aria-hidden="true"
                    className="text-micro nums absolute left-4 top-4 rounded-[3px] border border-white/60 bg-white/95 py-1.5 pl-2 pr-1.5 text-navy-800"
                  >
                    {s.index}
                  </span>
                </div>

                {/* ------------------------------------------------ body */}
                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center self-start rounded-[3px] border border-line text-navy-700">
                    <Icon name={s.icon} className="size-5" strokeWidth={1.7} />
                  </span>

                  <h3 className="text-h3 mt-5 text-navy-800">{s.title}</h3>

                  {/* mb-6 guarantees the gap above the tag block; the block's
                      mt-auto then pins it to the bottom of a short card. */}
                  <p className="mb-6 mt-3 text-[0.9375rem] leading-relaxed text-ink-500">
                    {s.description}
                  </p>

                  <div className="mt-auto border-t border-line pt-5">
                    <p
                      id={`${s.id}-serves`}
                      className="text-micro text-navy-600"
                    >
                      {s.servesLabel}
                    </p>
                    <ul
                      role="list"
                      aria-labelledby={`${s.id}-serves`}
                      className="mt-3.5 flex flex-wrap gap-2"
                    >
                      {s.serves.map((item) => (
                        <li
                          key={item}
                          className="rounded-[3px] border border-line px-2.5 py-1 text-[0.8125rem] leading-snug text-ink-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
