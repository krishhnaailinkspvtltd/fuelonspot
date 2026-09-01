"use client";

import { useState } from "react";
import { CoverageMap } from "@/components/coverage/CoverageMap";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { serviceAreas, site } from "@/lib/site";

/** Panchmahal — the dispatch region, and the first row in the list. */
const base = serviceAreas.find((area) => area.primary) ?? serviceAreas[0];

export function ServiceAreas() {
  /* `selected` survives a click, `hovered` is a transient preview. The map and
     the list both render from `active`, which is what keeps the two halves of
     this section in sync in either direction. */
  const [selected, setSelected] = useState<string | null>(base.name);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selected;

  return (
    <Section id="service-areas" tone="light" labelledBy="areas-title">
      <Container>
        <SectionHeading
          id="areas-title"
          eyebrow="Coverage"
          title="Fuel Delivery Across Key Locations"
          description="Reliable doorstep fuel delivery for businesses, industries, equipment and operations across our service areas."
        />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* --------------------------------------------------------- map */}
          <Reveal variant="fade" className="lg:col-span-7">
            <CoverageMap active={active} />
          </Reveal>

          {/* -------------------------------------------------- area list */}
          <div className="lg:col-span-5">
            <Reveal>
              <p id="areas-list-label" className="text-micro text-navy-600">
                Delivering in
              </p>
            </Reveal>

            <ul
              aria-labelledby="areas-list-label"
              className="mt-4 divide-y divide-line rounded-[4px] border border-line bg-white"
            >
              {serviceAreas.map((area, i) => {
                const on = active === area.name;
                return (
                  <Reveal as="li" key={area.name} delay={Math.min(i * 55, 330)}>
                    <button
                      type="button"
                      aria-pressed={selected === area.name}
                      onClick={() =>
                        setSelected((cur) =>
                          cur === area.name ? null : area.name,
                        )
                      }
                      onMouseEnter={() => setHovered(area.name)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(area.name)}
                      onBlur={() => setHovered(null)}
                      className={cn(
                        "relative flex w-full cursor-pointer items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-200 sm:px-5",
                        on ? "bg-surface-alt" : "hover:bg-surface-alt",
                      )}
                    >
                      {/* An inset tick rather than a full-height rail, so it
                          never paints into the list's rounded corners. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-1 left-0 w-[3px] transition-colors duration-200",
                          on
                            ? area.primary
                              ? "bg-fuel-500"
                              : "bg-navy-600"
                            : "bg-transparent",
                        )}
                      />
                      {/* Matches the map's own two marker styles, so the legend
                          reads across both halves of the section. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 rounded-full ring-2 ring-white transition-colors duration-200",
                          area.primary
                            ? "size-3 bg-fuel-600"
                            : on
                              ? "size-2.5 bg-navy-800"
                              : "size-2.5 bg-navy-600",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display font-bold tracking-[-0.02em] text-navy-800">
                          {area.name}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-sm",
                            area.primary
                              ? "font-semibold text-fuel-700"
                              : "text-ink-500",
                          )}
                        >
                          {area.note}
                        </span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={120}>
              <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-ink-500">
                Close to one of these areas? Call us and we will confirm
                coverage for your site.{" "}
                <a
                  href={site.phoneHref}
                  className="nums font-semibold text-navy-800 underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:text-fuel-700 hover:decoration-fuel-500"
                >
                  {site.phoneDisplay}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
