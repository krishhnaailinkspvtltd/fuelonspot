import Image from "next/image";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Enter } from "@/components/ui/Enter";
import { association, hero, serviceAreas, site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-surface"
    >
      {/* Structural background: a light panel under the image column and a
          faint blueprint grid, instead of a gradient wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-y-0 right-0 hidden w-[46%] bg-surface-alt lg:block" />
        <div className="absolute inset-y-0 right-0 hidden w-px bg-line lg:left-[54%] lg:block" />
        <div className="absolute -right-24 -top-24 hidden size-[34rem] rounded-full border border-line lg:block" />
        <div className="absolute -right-40 -top-40 hidden size-[44rem] rounded-full border border-line/60 lg:block" />
      </div>

      <Container className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          {/* ---------------------------------------------------- copy */}
          <div className="lg:col-span-6 xl:col-span-6">
            <Enter>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-fuel-100 bg-fuel-50 py-1.5 pl-2.5 pr-3.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-2 rounded-full bg-fuel-500 [animation:fos-pulse-ring_2.4s_ease-out_infinite]" />
                    <span className="relative inline-flex size-2 rounded-full bg-fuel-600" />
                  </span>
                  <span className="text-micro text-fuel-800">{hero.status}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500">
                  <MapPin className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                  {site.addressShort}
                </span>
              </div>

              {/* Association badge. Its own line rather than a third chip in the
                  row above: at 375px that row already wraps, and a third item
                  would push the headline down another line.

                  Deliberately quieter than the status chip beside it — neutral
                  plate, hairline border, no green. Green is reserved for things
                  that are actionable or live, and this is provenance. It must
                  read under the h1, never against it.

                  Text, not a mark: no authorised Jio-bp logo asset exists in
                  the project. See the note in site.ts. */}
              <p className="mt-4 inline-flex items-center gap-2.5 rounded-[3px] border border-line bg-white py-1.5 pl-3 pr-3.5">
                <span className="text-micro text-ink-500">
                  {association.label}
                </span>
                <span
                  aria-hidden="true"
                  className="h-3.5 w-px shrink-0 bg-line-strong"
                />
                <span className="font-display text-[0.9375rem] font-extrabold leading-none tracking-[-0.02em] text-navy-800">
                  {association.partner}
                </span>
              </p>
            </Enter>

            <Enter delay={70}>
              <h1 id="hero-title" className="text-display mt-6 text-navy-800">
                {hero.headline[0]}
                <span className="text-fuel-500">.</span>
                <br />
                <span className="text-navy-700">{hero.headline[1]}</span>
              </h1>
            </Enter>

            <Enter delay={140}>
              <p className="text-lead mt-6 max-w-xl text-ink-500">{hero.body}</p>
            </Enter>

            <Enter delay={210}>
              <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <ButtonLink href="#contact" size="lg" className="justify-center">
                  {hero.primaryCta}
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
                  {hero.secondaryCta}
                </ButtonLink>
              </div>
            </Enter>

            <Enter delay={280}>
              <div className="mt-10 border-t border-line pt-5">
                <p className="text-micro text-ink-500">Delivering in</p>
                {/* A flex list, not inline text: the separator spans carry no
                    whitespace between them, so as inline content the whole row
                    became a single unbreakable word and overflowed at 375px.
                    Flex wrapping gives every area its own break. */}
                <ul className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-600">
                  {serviceAreas.map((d, i) => (
                    <li key={d.name} className="flex items-center gap-x-2">
                      {i > 0 && (
                        <span aria-hidden="true" className="text-line-strong">
                          ·
                        </span>
                      )}
                      <span
                        className={
                          d.primary ? "font-semibold text-navy-800" : undefined
                        }
                      >
                        {d.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Enter>

          </div>

          {/* --------------------------------------------------- image */}
          <div className="lg:col-span-6 xl:col-span-6">
            <Enter variant="fade" delay={120}>
              {/* The supplied campaign poster, whole.

                  `h-auto w-full` rather than a fixed aspect box with
                  object-cover: the artwork is 5:4 and the old frame was 4:3,
                  so covering it would have shaved the FuelOnSpot lockup off the
                  top and the Jio-bp panel off the corner. Letting the image set
                  its own height shows every part of it at its true ratio, with
                  no letterbox bars either.

                  The scrim, the green corner rules and the "Mobile refueling"
                  caption that used to sit here are gone with the stock photo:
                  the poster already carries the mark, the tagline, the 7 Lakh
                  figure and a number, and site chrome on top of finished
                  artwork reads as a mistake. */}
              <figure className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="overflow-hidden rounded-[4px] border border-line">
                  <Image
                    src="/images/fuelonspot-diesel-delivery.webp"
                    alt="FuelOnSpot diesel delivery at your doorstep"
                    width={1254}
                    height={1005}
                    /* Above the fold and the LCP element on every breakpoint.
                       `preload` is the Next 16 spelling of the old `priority`. */
                    preload
                    /* 75 softens the poster's small print; 90 is allowlisted in
                       next.config.ts for exactly this kind of asset. */
                    quality={90}
                    sizes="(min-width: 1024px) 46vw, (min-width: 640px) 32rem, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              </figure>
            </Enter>
          </div>
        </div>
      </Container>
    </section>
  );
}
