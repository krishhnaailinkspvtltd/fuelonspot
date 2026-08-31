import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { visionMission } from "@/lib/site";

/**
 * One type ramp shared by both statements so the dark and the light panel sit
 * in exactly the same optical rhythm — only colour separates them. The clamp
 * tops out around 1173px so the statement stops growing before the column does.
 */
const statementType =
  "font-display text-[clamp(1.375rem,1.2rem_+_0.75vw,1.75rem)] font-bold leading-snug tracking-[-0.02em]";

/**
 * Per-panel token swap. The markup below is identical for both entries, which
 * is what keeps the two label rails — and therefore the two statements —
 * starting on the same line once the grid puts them side by side.
 */
const panelTone = {
  vision: {
    panel: "bg-navy-950 blueprint-grid",
    rail: "border-white/10",
    label: "text-fuel-400",
    index: "text-onnavy-500",
    statement: "text-white",
  },
  mission: {
    panel: "bg-surface-alt",
    rail: "border-line",
    label: "text-navy-600",
    index: "text-line-strong",
    statement: "text-navy-800",
  },
} as const;

export function VisionMission() {
  return (
    <Section id="vision-mission" tone="light" labelledBy="vm-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="vm-title"
            eyebrow="Direction"
            title="What we are building"
          />
        </Reveal>

        {/* One bordered plate split down the middle rather than two cards: the
            frame owns the border and `gap-px` over a line-coloured ground draws
            the single seam — vertical from md up, horizontal once the panels
            stack. Same joined-cell treatment as the rest of the page. */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line md:grid-cols-2 lg:mt-16">
          {visionMission.map((item, i) => {
            const tone = panelTone[item.key];

            return (
              <Reveal
                key={item.key}
                delay={i * 90}
                className={cn(
                  // isolate + overflow-hidden keep the watermark inside its own
                  // half instead of bleeding across the seam.
                  "relative isolate flex flex-col overflow-hidden",
                  tone.panel,
                )}
              >
                {item.key === "vision" ? (
                  <LogoMark
                    size={280}
                    className="pointer-events-none absolute -bottom-12 -right-12 opacity-[0.09]"
                  />
                ) : null}

                {/* Label rail. Same padding and same type on both sides, so the
                    rails line up to the pixel and the statements below them do
                    too — no fixed heights involved. */}
                <div
                  className={cn(
                    "relative flex items-center justify-between gap-4 border-b px-6 py-5 sm:px-8 lg:px-10",
                    tone.rail,
                  )}
                >
                  <h3 className={cn("text-micro font-sans", tone.label)}>
                    {item.label}
                  </h3>
                  <span
                    aria-hidden="true"
                    className={cn("text-micro nums", tone.index)}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* flex-1 + justify-center: the grid stretches both panels to a
                    common height, and the shorter mission statement centres in
                    the space it gets instead of hanging off the rail. */}
                <div className="relative flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                  <p className={cn(statementType, tone.statement)}>
                    {item.statement}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
