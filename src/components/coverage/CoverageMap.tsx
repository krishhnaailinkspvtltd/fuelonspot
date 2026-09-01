import {
  CONTEXT_PATH,
  DISTRICT_PATHS,
  MAP_BORDER,
  MAP_HAIRLINE,
  MAP_VIEWBOX,
  toFrame,
} from "@/lib/coverage-map";
import { cn } from "@/lib/cn";
import { serviceAreas } from "@/lib/site";

type Area = (typeof serviceAreas)[number];

/**
 * The coverage map: real district boundaries, real coordinates.
 *
 * Geometry is genuine administrative data (see lib/coverage-map.ts), projected
 * once at build time into an inline SVG. No map library and no tile server:
 * nothing here pans, zooms or needs a network round trip, so a 26KB path table
 * beats shipping Leaflet plus OpenStreetMap tiles for a picture that is only
 * ever looked at.
 *
 * Two layers, drawn in this order so the served districts read first:
 *   1. neighbouring districts, faint — this is what makes it a map rather than
 *      three shapes floating in space
 *   2. the three served districts, with Panchmahal (the dispatch region) in
 *      green and the two delivery districts outlined in navy
 *
 * Pins are HTML rather than SVG <text> so they carry the same type, borders and
 * hover transitions as the rest of the page; `toFrame` projects them with the
 * identical maths used for the paths, so the two can never drift.
 *
 * The graphic and its legend are aria-hidden and hold nothing focusable: every
 * name on the map is also in the list beside it, and that list is the
 * accessible control. The licence credit sits OUTSIDE that hidden subtree — it
 * carries a real link, and a focusable element inside aria-hidden is a trap.
 */
export function CoverageMap({ active }: { active: string | null }) {
  /* Kalol and Savli sit ~13% of the frame apart with almost no vertical
     separation, so their labels are pushed to opposite sides of their pins.
     Everything else can hang below its pin. */
  const labelSide: Record<string, "left" | "right" | "below"> = {
    Panchmahal: "right",
    Savli: "left",
  };

  return (
    <div className="overflow-hidden rounded-[4px] border border-line bg-surface-alt">
      <div aria-hidden="true">
        {/* ------------------------------------------------------- legend bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-line px-4 py-3 sm:px-5">
          <p className="text-micro text-navy-600">Coverage map</p>
          <ul className="flex items-center gap-4">
            <li className="flex items-center gap-2 text-[0.6875rem] font-semibold text-ink-500">
              <span className="size-2.5 shrink-0 rounded-full bg-fuel-600" />
              Dispatch base
            </li>
            <li className="flex items-center gap-2 text-[0.6875rem] font-semibold text-ink-500">
              <span className="size-2 shrink-0 rounded-full bg-navy-700" />
              Delivery area
            </li>
          </ul>
        </div>

        {/* ------------------------------------------------------------- map */}
        {/* 4:3 matches the generated viewBox, so the projection fills the frame
          exactly and `overflow-hidden` guarantees no label can ever push the
          page sideways. */}
        <div className="relative aspect-[4/3] bg-surface-tint">
          <svg viewBox={MAP_VIEWBOX} className="absolute inset-0 size-full">
            {/* neighbouring districts */}
            <path
              d={CONTEXT_PATH}
              className="fill-surface-alt stroke-line-strong"
              strokeWidth={MAP_HAIRLINE}
              strokeLinejoin="round"
            />

            {serviceAreas.map((area) => {
              if (!area.district) return null;
              const on = active === area.name;
              return (
                <path
                  key={area.district}
                  d={DISTRICT_PATHS[area.district]}
                  strokeWidth={MAP_BORDER}
                  strokeLinejoin="round"
                  className={cn(
                    "transition-[fill,stroke] duration-200",
                    area.primary
                      ? on
                        ? "fill-fuel-100 stroke-fuel-700"
                        : "fill-fuel-50 stroke-fuel-600"
                      : on
                        ? "fill-surface-tint stroke-navy-800"
                        : "fill-surface stroke-navy-600",
                  )}
                />
              );
            })}
          </svg>

          {/* Pins. Inset so a label at the frame edge still has somewhere to go. */}
          <div className="absolute inset-0">
            {serviceAreas.map((area: Area) => {
              const { left, top } = toFrame(area.lon, area.lat);
              const on = active === area.name;
              const side = labelSide[area.name] ?? "below";

              return (
                <span
                  key={area.name}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                >
                  {area.primary ? (
                    <span className="relative flex size-3.5 items-center justify-center">
                      {/* The base is the one live thing on this map, so it takes
                        the hero's pulsing ring and nothing else here loops. */}
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

                  {/* Out of flow so the pin — not the pin plus its label — is
                    what sits on the coordinate. Four labels clear each other at
                    every width down to 375px (measured, not assumed) because
                    Kalol and Savli break to opposite sides, so they stay on
                    rather than leaving the phone with four anonymous dots. */}
                  <span
                    className={cn(
                      "absolute block whitespace-nowrap rounded-[3px] border px-1.5 py-0.5 text-[0.625rem] leading-4 transition-colors duration-200 sm:text-[0.6875rem]",
                      side === "below" &&
                        "left-1/2 top-full mt-1 -translate-x-1/2",
                      side === "right" &&
                        "left-full ml-1.5 top-1/2 -translate-y-1/2",
                      side === "left" &&
                        "right-full mr-1.5 top-1/2 -translate-y-1/2",
                      area.primary
                        ? on
                          ? "border-fuel-700 bg-fuel-600 font-bold text-white"
                          : "border-fuel-600 bg-white font-bold text-fuel-800"
                        : on
                          ? "border-navy-800 bg-navy-800 font-semibold text-white"
                          : "border-line bg-white font-semibold text-navy-700",
                    )}
                  >
                    {area.marker}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Required by the boundary data's licence (CC BY 4.0 / ODbL). Do not
          remove it — see the header of lib/coverage-map.ts. */}
      <p className="border-t border-line px-4 py-2.5 text-[0.6875rem] leading-4 text-ink-500 sm:px-5">
        District boundaries{" "}
        <a
          href="https://www.geoboundaries.org"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-navy-800"
        >
          geoBoundaries
        </a>{" "}
        (CC BY 4.0)
      </p>
    </div>
  );
}
