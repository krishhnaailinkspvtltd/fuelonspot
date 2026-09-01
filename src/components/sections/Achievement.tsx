import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { achievement, site } from "@/lib/site";

/**
 * The delivery milestone — the only figure anywhere on the page.
 *
 * It sits directly under the trust strip, before the argument for doorstep
 * delivery is made: the volume already delivered is the evidence the rest of
 * the page then explains.
 *
 * `SectionHeading` is not used here because the claim is a figure, not a
 * sentence — the h2 carries a tracked lead line above an oversized numeral
 * rather than one run of `text-h2`.
 */
export function Achievement() {
  return (
    <Section id="achievement" tone="light" labelledBy="achievement-title">
      <Container>
        <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* --------------------------------------------------------- copy */}
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{achievement.eyebrow}</Eyebrow>

              <h2 id="achievement-title" className="mt-5">
                <span className="text-micro block text-navy-600">
                  {achievement.lead}
                </span>
                {/* Deliberately outside the shared type scale: `text-display`
                    belongs to the hero's h1, and this figure has to out-weigh
                    every other h2 without matching the h1. Capped at 4rem so
                    the h1's 4.5rem ceiling still wins. Left to wrap rather than
                    held on one line — at 375px the two words need the break. */}
                <span className="nums mt-3 block font-display text-[clamp(2.5rem,1.4rem+4.8vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-navy-800">
                  {achievement.figure}{" "}
                  <span className="text-fuel-600">{achievement.unit}</span>
                </span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <p className="text-lead mt-6 text-navy-700">
                {achievement.headline}
              </p>
              <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-500">
                {achievement.body}
              </p>
            </Reveal>

            <Reveal delay={140}>
              {/* Wraps rather than shrinks: both labels are fixed-width inside
                  the button, and at 480px the pair is within a few pixels of
                  the gutter. */}
              <div className="mt-8 flex flex-col gap-3 border-t border-line pt-7 xs:flex-row xs:flex-wrap">
                <ButtonLink href="#contact" size="lg" className="justify-center">
                  {achievement.cta}
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </ButtonLink>
                <ButtonLink
                  href={site.phoneHref}
                  variant="outline"
                  size="lg"
                  className="nums justify-center"
                >
                  <Phone className="size-4" strokeWidth={2.1} aria-hidden="true" />
                  Call {site.phoneDisplay}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* ------------------------------------------------------- poster */}
          <Reveal variant="fade" delay={120} className="lg:col-span-5">
            {/* Capped at every width and centred in its column: the artwork is
                a 4:5 portrait, so at full column width it would run ~550px tall
                and outweigh the copy it is evidence for. `h-auto w-full` keeps
                the supplied aspect ratio exactly — the poster is never cropped
                or stretched. */}
            <figure className="relative mx-auto w-full max-w-[20rem] xs:max-w-[22rem] lg:max-w-[24rem]">
              {/* Offset outline behind the frame — the register mark used on
                  the About photograph, mirrored to the opposite corner.
                  Suppressed below sm, where the gutter is only 20px. */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 -right-6 hidden h-2/3 w-2/3 rounded-[4px] border border-navy-800/25 sm:block lg:-bottom-8 lg:-right-8"
              />

              {/* `relative` keeps the frame painting above the outline. */}
              <div className="relative overflow-hidden rounded-[4px] border border-line bg-navy-950">
                <Image
                  src={achievement.poster}
                  alt={achievement.posterAlt}
                  width={1122}
                  height={1402}
                  sizes="(min-width: 1024px) 384px, (min-width: 480px) 352px, 320px"
                  // The one asset on the page that needs more than the default
                  // 75: it is display lettering, not a photograph.
                  quality={90}
                  className="h-auto w-full"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
