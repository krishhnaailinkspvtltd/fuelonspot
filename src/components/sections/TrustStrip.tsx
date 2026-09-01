import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { trustItems } from "@/lib/site";

/**
 * Per-cell grid placement and hairline dividers.
 *
 * The strip re-flows four times, so the dividers are declared explicitly per
 * item rather than derived from the index — five fixed items make the literal
 * table shorter to read (and safer for Tailwind's class scanner) than the
 * modulo arithmetic it would take to place them.
 *
 *   base (<480)  1 column   — horizontal rules between rows
 *   xs   (480+)  2 columns  — 2 / 2 / 1, the last cell spanning both
 *   md   (768+)  3 then 2   — a 6-column track carries 2·2·2 over 3·3
 *   lg   (1024+) 5 columns  — a 10-column track carries 2·2·2·2·2, verticals only
 *
 * Left padding is switched on and off in lockstep with `border-l`, so a cell is
 * only inset when there is actually a rule to its left.
 */
const cellLayout = [
  // 01 — first in its row at every width, so it never carries a divider.
  "md:col-span-2",
  // 02 — row 1 col 2 from xs up; the rule turns from horizontal to vertical.
  "border-t xs:border-t-0 xs:border-l xs:pl-5 md:col-span-2 xl:pl-6",
  // 03 — drops to row 2 at xs, climbs back to row 1 (col 3) at md.
  "border-t md:col-span-2 md:border-t-0 md:border-l md:pl-5 xl:pl-6",
  // 04 — leads row 2 at md, so its vertical rule is dropped there and
  //      explicitly restored at lg, where it is mid-row again.
  "border-t xs:border-l xs:pl-5 md:col-span-3 md:border-l-0 md:pl-0 lg:col-span-2 lg:border-t-0 lg:border-l lg:pl-5 xl:pl-6",
  // 05 — the odd fifth cell: spans the full width at xs, half of row 2 at md.
  "border-t xs:col-span-2 md:col-span-3 md:border-l md:pl-5 lg:col-span-2 lg:border-t-0 xl:pl-6",
] as const;

/**
 * The commitments band under the hero.
 *
 * Deliberately not a `Section`: it is a compact full-bleed rule between the
 * hero and the first real section, so it sets its own tight rhythm and skips
 * the heading block entirely. Landmark naming comes from `aria-label`, and the
 * cell titles stay as `<p>` — an `<h3>` here would skip a level under the
 * hero's `<h1>`.
 */
export function TrustStrip() {
  return (
    <section
      aria-label="Service commitments"
      className="blueprint-grid bg-navy-950 py-8 sm:py-10"
    >
      <Container>
        {/* One reveal for the whole row: the strip should land as a single
            object, not as five staggered items. */}
        <Reveal variant="fade">
          <ul className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-6 lg:grid-cols-10">
            {trustItems.map((item, i) => (
              <li
                key={item.title}
                className={cn(
                  // Icon sits beside the text on phones (shorter rows, no
                  // awkward title wraps) and above it once cells are columns.
                  "flex items-start gap-3.5 border-white/10 py-4",
                  "xs:flex-col xs:gap-3 xs:py-5 xs:pr-4",
                  "lg:py-0 xl:pr-5",
                  cellLayout[i],
                )}
              >
                <Icon
                  name={item.icon}
                  className="size-5 shrink-0 text-fuel-400"
                  strokeWidth={1.7}
                />
                <div className="min-w-0">
                  {/* The floor of two lines keeps every note on the same
                      baseline across the five columns, where only "Quality &
                      Quantity Assurance" wraps. */}
                  <p className="text-balance font-display text-[0.9375rem] font-bold leading-snug tracking-[-0.01em] text-white lg:min-h-[2.6rem]">
                    {item.title}
                  </p>
                  {/* `nums` because one of these notes is the phone number;
                      it is inert on the cells that hold plain text. */}
                  <p className="nums mt-1 text-[0.8125rem] leading-[1.45] text-onnavy-500">
                    {item.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
