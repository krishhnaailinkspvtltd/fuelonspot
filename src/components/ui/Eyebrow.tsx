import { cn } from "@/lib/cn";

/**
 * Small tracked label that opens most sections. The green tick is the one
 * recurring brand flourish — it replaces decorative icons and pill badges.
 */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-micro flex items-center gap-2.5",
        tone === "dark" ? "text-onnavy-300" : "text-navy-600",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block h-[3px] w-6 shrink-0 bg-fuel-500"
      />
      {children}
    </p>
  );
}
