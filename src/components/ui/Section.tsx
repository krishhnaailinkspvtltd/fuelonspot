import { cn } from "@/lib/cn";

type Tone = "light" | "alt" | "dark";

const toneClass: Record<Tone, string> = {
  light: "bg-surface border-t border-line",
  alt: "bg-surface-alt border-t border-line",
  dark: "bg-navy-950 text-onnavy-300",
};

/**
 * Standard section shell: consistent vertical rhythm and a hairline rule
 * between bands instead of drop shadows or floating panels.
 */
export function Section({
  id,
  tone = "light",
  className,
  children,
  labelledBy,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative scroll-mt-24 py-16 sm:py-20 lg:py-28",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
