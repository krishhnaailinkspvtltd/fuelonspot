import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { about } from "@/lib/site";

export function About() {
  const lastServe = about.serves.length - 1;

  return (
    <Section id="about" tone="alt" labelledBy="about-title">
      <Container>
        {/* Photo left, copy right — the mirror of the hero, so the page's two
            picture-and-text bands do not read as the same layout twice.
            On mobile the copy comes first: the reader wants the words. */}
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* --------------------------------------------------- photograph */}
          <Reveal
            variant="fade"
            delay={120}
            className="order-2 lg:order-1 lg:col-span-5"
          >
            {/* Capped on small and tablet widths: a 4:5 portrait run full-bleed
                at 768px would be nearly 900px tall and swamp the copy. */}
            <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Offset outline behind the frame — a register mark from an
                  engineering drawing, not a drop shadow. Suppressed below sm,
                  where the container gutter is only 20px wide. */}
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -left-8 hidden h-2/3 w-2/3 rounded-[4px] border border-navy-800/25 sm:block lg:-bottom-10 lg:-left-10"
              />

              {/* `relative` keeps the frame painting above the outline. */}
              <div className="relative overflow-hidden rounded-[4px] border border-line bg-navy-950">
                <Image
                  src={about.image}
                  alt={about.imageAlt}
                  width={1200}
                  height={1400}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="aspect-[4/5] w-full object-cover"
                />
                {/* The hero's green corner rule, reduced to a single bar and
                    moved to the opposite edge from the outline below-left. */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-16 w-1 bg-fuel-500 sm:h-20"
                />
              </div>
            </figure>
          </Reveal>

          {/* --------------------------------------------------------- copy */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Reveal>
              <SectionHeading
                id="about-title"
                eyebrow="About FuelOnSpot"
                title={about.heading}
              />
            </Reveal>

            <Reveal delay={70}>
              {/* Rendered here rather than passed to SectionHeading's
                  `description`, which only takes a single block. */}
              <div className="mt-5 max-w-prose space-y-5 text-ink-500">
                <p className="text-lead">{about.paragraphs[0]}</p>
                <p className="text-base leading-relaxed">
                  {about.paragraphs[1]}
                </p>
              </div>
            </Reveal>

            <Reveal delay={140}>
              {/* The list runs the full column width while the prose above
                  stays at reading measure — the change of rhythm is the point. */}
              <div className="mt-9 border-t border-line pt-5">
                {/* This intro is a sentence, not a two-word label, so it
                    wraps below ~440px — and text-micro ships line-height:1,
                    which would set the two lines touching. */}
                <p
                  id="about-serves"
                  className="text-micro leading-snug text-navy-600"
                >
                  {about.servesIntro}
                </p>
                <ul
                  aria-labelledby="about-serves"
                  className="mt-5 grid grid-cols-1 gap-x-8 xs:grid-cols-2"
                >
                  {about.serves.map((item, i) => (
                    <li
                      key={item}
                      className={cn(
                        "flex items-center gap-3 border-b border-line py-2.5 text-[0.9375rem] text-ink-600",
                        // Nine items across two columns leaves an orphan; run
                        // it full width so the list closes on a straight rule.
                        i === lastServe && "xs:col-span-2",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-3 shrink-0 bg-fuel-500"
                      />
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
