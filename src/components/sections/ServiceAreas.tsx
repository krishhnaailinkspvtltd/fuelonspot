"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { districts, site } from "@/lib/site";

type District = (typeof districts)[number];

/** Vadodara. Every connector on the panel radiates from this node. */
const base: District = districts.find((d) => d.primary) ?? districts[0];
const spokes = districts.filter((d) => !d.primary);

/**
 * Blueprint rule grid — two hairline scales drawn with repeating gradients
 * rather than an image, so the panel reads as a plan sheet and not as a map.
 * This is the light-surface counterpart to `blueprint-grid` in globals.css.
 *
 * The steps are px, not percentages. A percentage step is measured along the
 * gradient line, so it would draw 4:3 cells in the 4/3 panel and square ones
 * at lg, and it would re-scale the whole rule density on every resize. Fixed
 * steps keep the cells square and the density identical at 375px and 1440px.
 */
const gridStyle: React.CSSProperties = {
  backgroundImage: [
    "repeating-linear-gradient(to right, rgba(11,51,87,0.11) 0 1px, transparent 1px 96px)",
    "repeating-linear-gradient(to bottom, rgba(11,51,87,0.11) 0 1px, transparent 1px 96px)",
    "repeating-linear-gradient(to right, rgba(11,51,87,0.05) 0 1px, transparent 1px 24px)",
    "repeating-linear-gradient(to bottom, rgba(11,51,87,0.05) 0 1px, transparent 1px 24px)",
  ].join(","),
};

export function ServiceAreas() {
  /* `selected` survives a click, `hovered` is a transient preview. The panel
     and the list both render from `active`, which is what keeps the two
     halves of this section in sync in either direction. */
  const [selected, setSelected] = useState<string | null>(base.name);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selected;

  return (
    <Section id="service-areas" tone="light" labelledBy="areas-title">
      <Container>
        <SectionHeading
          id="areas-title"
          eyebrow="Coverage"
          title="Serving Businesses Across Gujarat"
          description="Nine districts across central and southern Gujarat, dispatched from our Vadodara base."
        />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* ------------------------------------------- dispatch panel */}
          {/* The panel is a schematic, not a source of information: every name
              on it also appears in the list beside it. It is hidden from
              assistive tech so the districts are not announced twice, which is
              also why it deliberately holds no focusable children. */}
          <Reveal variant="fade" className="lg:col-span-7">
            <div
              aria-hidden="true"
              className="rounded-[4px] border border-line bg-surface-alt"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
                <p className="text-micro text-navy-600">Dispatch network</p>
                <ul className="flex items-center gap-4">
                  <li className="flex items-center gap-2 text-[0.6875rem] font-semibold text-ink-500">
                    <span className="size-2.5 shrink-0 rounded-full bg-fuel-600" />
                    Dispatch base
                  </li>
                  <li className="flex items-center gap-2 text-[0.6875rem] font-semibold text-ink-500">
                    <span className="size-2 shrink-0 rounded-full bg-navy-600" />
                    Service district
                  </li>
                </ul>
              </div>

              {/* `overflow-hidden` is the guarantee that a label can never push
                  the page sideways. Squarer at lg so the panel finishes closer
                  to the height of the nine-row list beside it. */}
              <div
                style={gridStyle}
                className="relative aspect-[4/3] overflow-hidden lg:aspect-square"
              >
                {/* Inset frame: the x/y percentages resolve inside this box,
                    which keeps markers and labels clear of the panel edge. */}
                <div className="absolute inset-4 sm:inset-6">
                  {/* Connectors, base to district. viewBox "0 0 100 100" with
                      preserveAspectRatio="none" makes one user unit equal one
                      percent — the same units the markers are placed with —
                      and non-scaling-stroke keeps the hairline even after that
                      non-uniform stretch. */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 size-full"
                  >
                    {spokes.map((d) => {
                      const on = active === d.name;
                      return (
                        <line
                          key={d.name}
                          x1={base.x}
                          y1={base.y}
                          x2={d.x}
                          y2={d.y}
                          stroke="currentColor"
                          strokeWidth={on ? 1.5 : 1}
                          strokeOpacity={on ? 0.6 : 0.16}
                          vectorEffect="non-scaling-stroke"
                          className={cn(
                            "transition-[color,stroke-opacity,stroke-width] duration-200",
                            on ? "text-fuel-600" : "text-navy-600",
                          )}
                        />
                      );
                    })}
                  </svg>

                  {districts.map((d) => {
                    const on = active === d.name;
                    return (
                      <span
                        key={d.name}
                        style={{ left: `${d.x}%`, top: `${d.y}%` }}
                        onMouseEnter={() => setHovered(d.name)}
                        onMouseLeave={() => setHovered(null)}
                        className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center p-1.5"
                      >
                        {d.primary ? (
                          <span className="relative flex size-3.5 items-center justify-center">
                            {/* The base is the one live thing on this panel, so
                                it carries the same pulsing ring as the hero
                                status dot and nothing else here loops. */}
                            <span className="absolute size-3.5 rounded-full bg-fuel-500 [animation:fos-pulse-ring_2.6s_ease-out_infinite]" />
                            <span
                              className={cn(
                                "relative size-3.5 rounded-full bg-fuel-600 ring-2 ring-white transition-transform duration-200",
                                on && "scale-125",
                              )}
                            />
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "size-2.5 rounded-full ring-2 ring-white transition-[background-color,transform] duration-200",
                              on ? "scale-[1.35] bg-navy-800" : "bg-navy-600",
                            )}
                          />
                        )}

                        {/* Taken out of flow so the marker — not the marker
                            plus its label — is what sits on the coordinate.
                            Nine labels cannot coexist below 640px without
                            colliding, so under `sm` the panel is markers only
                            and the list carries every name. */}
                        <span
                          className={cn(
                            "absolute left-1/2 top-full mt-0.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[3px] border px-1.5 py-0.5 text-[0.6875rem] leading-4 transition-colors duration-200 sm:block",
                            d.primary
                              ? on
                                ? "border-fuel-700 bg-fuel-600 font-bold text-white"
                                : "border-fuel-600 bg-white font-bold text-fuel-800"
                              : on
                                ? "border-navy-800 bg-navy-800 font-semibold text-white"
                                : "border-line bg-white font-semibold text-navy-700",
                          )}
                        >
                          {d.name}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* -------------------------------------------- district list */}
          <div className="lg:col-span-5">
            <Reveal>
              <p id="areas-list-label" className="text-micro text-navy-600">
                Districts served
              </p>
            </Reveal>

            <ul
              aria-labelledby="areas-list-label"
              className="mt-4 divide-y divide-line rounded-[4px] border border-line bg-white"
            >
              {districts.map((d, i) => {
                const on = active === d.name;
                return (
                  <Reveal as="li" key={d.name} delay={Math.min(i * 55, 330)}>
                    <button
                      type="button"
                      aria-pressed={selected === d.name}
                      onClick={() =>
                        setSelected((cur) => (cur === d.name ? null : d.name))
                      }
                      onMouseEnter={() => setHovered(d.name)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(d.name)}
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
                            ? d.primary
                              ? "bg-fuel-500"
                              : "bg-navy-600"
                            : "bg-transparent",
                        )}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 rounded-full ring-2 ring-white transition-colors duration-200",
                          d.primary
                            ? "size-3 bg-fuel-600"
                            : on
                              ? "size-2.5 bg-navy-800"
                              : "size-2.5 bg-navy-600",
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display font-bold tracking-[-0.02em] text-navy-800">
                          {d.name}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 block text-sm",
                            d.primary
                              ? "font-semibold text-fuel-700"
                              : "text-ink-500",
                          )}
                        >
                          {d.note}
                        </span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={120}>
              <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-ink-500">
                Close to a district boundary? Call us and we will confirm
                coverage.{" "}
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
