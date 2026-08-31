import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/cn";

/**
 * Section header block. Keeps eyebrow → h2 → lead spacing identical everywhere.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  className,
  titleClassName,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <Eyebrow tone={tone} className={align === "center" ? "justify-center" : ""}>
        {eyebrow}
      </Eyebrow>
      <h2
        id={id}
        className={cn(
          "text-h2 mt-5",
          tone === "dark" ? "text-white" : "text-navy-800",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-lead mt-5",
            tone === "dark" ? "text-onnavy-300" : "text-ink-500",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
