"use client";

import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { faqs, hero, site } from "@/lib/site";

/**
 * The escape hatch for anything the seven answers do not cover.
 *
 * Rendered twice — pinned beside the heading on desktop, dropped below the
 * questions on mobile — because someone on a phone should reach the questions
 * first, not a number they already passed in the header. Only one instance is
 * ever displayed, so only one is ever in the accessibility tree.
 *
 * The caption is `hero.status`, not a new sentence: the service is described
 * once in site.ts and there is no second wording for it. It says what the
 * service is, never when it is open — operating hours are not verified.
 */
function HelplineCard({ className }: { className?: string }) {
  return (
    <Reveal
      delay={70}
      className={cn(
        "rounded-[4px] border border-line bg-surface-alt p-5 sm:p-6",
        className,
      )}
    >
      <p className="text-micro text-navy-600">Still have a question?</p>

      <a
        href={site.phoneHref}
        className="group/call mt-4 inline-flex min-h-11 items-center gap-3.5"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[3px] bg-fuel-600 text-white transition-colors duration-200 group-hover/call:bg-fuel-700">
          <Phone className="size-4" strokeWidth={2.1} aria-hidden="true" />
        </span>
        <span className="nums font-display text-xl font-extrabold tracking-[-0.02em] text-navy-800 transition-colors duration-200 group-hover/call:text-fuel-700">
          {site.phoneDisplay}
        </span>
      </a>

      <p className="mt-3.5 text-[0.8125rem] text-ink-500">{hero.status}</p>
    </Reveal>
  );
}

/**
 * FAQ — a reading layout rather than a stack: the heading and the helpline sit
 * still on the left while seven answers scroll past on the right.
 *
 * This is one of the few interactive sections, so it is a client component.
 * The accordion is hand-built instead of <details> because the panel animates:
 * a `grid-template-rows: 0fr -> 1fr` transition opens each answer to exactly
 * its own height, which a max-height guess cannot do for answers that range
 * from two lines to six.
 *
 * Collapsed panels stay in the DOM — they are the target of `aria-controls`
 * and have to exist for that reference to resolve — but carry `inert` and
 * `aria-hidden`, which takes them out of the tab order and out of the
 * accessibility tree. Nothing inside a panel is interactive, so `inert` costs
 * the reader nothing. It also settles the usual objection to `role="region"`
 * on an accordion this long: seven landmarks would be noise, but only the open
 * one is ever exposed.
 */
export function FAQ() {
  // One panel open at a time. The first question starts open so the affordance
  // is legible without a click; `null` means everything is closed.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" tone="light" labelledBy="faq-title">
      <Container>
        {/* Deliberately no `items-start`: the left column has to stretch to the
            full grid height or the sticky rail has no distance to travel. */}
        <div className="grid gap-12 lg:grid-cols-12 xl:gap-16">
          {/* -------------------------------------------------- left rail */}
          <div className="lg:col-span-5">
            {/* 8rem clears the compacted header (60px once the page has
                scrolled, which it always has by the time this pins). */}
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <SectionHeading
                  id="faq-title"
                  eyebrow="Questions"
                  title="Frequently asked"
                  description="What we deliver, where we deliver it, and how an order actually runs."
                />
              </Reveal>
              <HelplineCard className="mt-10 hidden lg:block" />
            </div>
          </div>

          {/* -------------------------------------------------- accordion */}
          <div className="lg:col-span-7">
            {/* One bordered block split by hairlines — seven separate cards
                would read as seven unrelated things. No `overflow-hidden` on
                it: at a 4px radius that buys nothing and would clip the global
                focus ring, which sits 3px outside the button. */}
            <div className="divide-y divide-line rounded-[4px] border border-line bg-white">
              {faqs.map((item, i) => {
                const isOpen = openIndex === i;
                const buttonId = `faq-q-${i + 1}`;
                const panelId = `faq-a-${i + 1}`;

                return (
                  <Reveal key={item.q} delay={Math.min(i, 5) * 70}>
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenIndex((prev) => (prev === i ? null : i))
                        }
                        className="group flex w-full cursor-pointer items-start gap-3 px-5 py-5 text-left transition-colors duration-200 hover:bg-surface-alt sm:gap-4 sm:px-6"
                      >
                        {/* The index is decoration and the first thing to go
                            when width is scarce: at 375px the question needs
                            those 40px (w-7 + gap-3) more than the reader needs
                            to be told this is the fifth one. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "nums text-micro mt-2 hidden w-7 shrink-0 transition-colors duration-200 sm:block",
                            isOpen
                              ? "text-fuel-600"
                              : "text-ink-500 group-hover:text-navy-600",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1 font-display text-[1.0625rem] font-bold leading-[1.35] tracking-[-0.02em] text-navy-800">
                          {item.q}
                        </span>

                        {/* Pulled up 4px so the plate centres on the first line
                            of the question rather than on the whole block,
                            which is what a three-line question needs. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "-mt-1 flex size-8 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-200",
                            isOpen
                              ? "border-line-strong text-navy-800"
                              : "border-line text-navy-600 group-hover:border-line-strong",
                          )}
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform duration-300 ease-out",
                              isOpen && "rotate-180",
                            )}
                            strokeWidth={2}
                          />
                        </span>
                      </button>
                    </h3>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      aria-hidden={!isOpen}
                      inert={!isOpen}
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      {/* overflow-hidden does two jobs here: it clips the
                          answer while the row grows, and it drops the grid
                          item's automatic minimum size to 0 — without that,
                          0fr cannot actually collapse. */}
                      <div className="overflow-hidden">
                        {/* Indented to the question's text column from sm up.
                            On a phone that indent would cost more width than
                            the alignment is worth. */}
                        <p className="max-w-[68ch] pb-6 pl-5 pr-5 text-[0.9375rem] leading-relaxed text-ink-500 sm:pl-[4.25rem] sm:pr-10">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <HelplineCard className="mt-8 lg:hidden" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
