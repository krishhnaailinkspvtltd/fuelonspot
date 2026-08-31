import Image from "next/image";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Enter } from "@/components/ui/Enter";
import { districts, hero, site } from "@/lib/site";

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
                <p className="text-micro text-ink-500">Delivering across</p>
                {/* A flex list, not inline text: the separator spans carry no
                    whitespace between them, so as inline content the whole row
                    became a single unbreakable ~511px word and overflowed at
                    375px. Flex wrapping gives every district its own break. */}
                <ul className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-600">
                  {districts.map((d, i) => (
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
              <figure className="relative">
                <div className="relative overflow-hidden rounded-[4px] border border-line bg-navy-950">
                  <Image
                    src="/images/hero-refueling.jpg"
                    alt="Road tanker delivering fuel through city traffic at dusk"
                    width={1600}
                    height={1200}
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/3]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/70 to-transparent"
                  />
                  {/* green corner rule — the logo's accent, used structurally */}
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-16 w-1 bg-fuel-500"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-1 w-16 bg-fuel-500"
                  />
                </div>

                <figcaption className="relative z-10 mx-4 -mt-10 flex items-center gap-3.5 rounded-[4px] border border-line bg-white p-4 shadow-[0_16px_40px_-24px_rgba(4,24,46,0.55)] sm:mx-6 sm:-mt-12 sm:gap-4 sm:p-5">
                  <LogoMark size={44} className="shrink-0" />
                  <div className="min-w-0">
                    <p className="text-micro text-navy-600">Mobile refueling</p>
                    <p className="mt-1.5 font-display text-base font-extrabold tracking-[-0.02em] text-navy-800 sm:text-lg">
                      {site.proposition}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Enter>
          </div>
        </div>
      </Container>
    </section>
  );
}
