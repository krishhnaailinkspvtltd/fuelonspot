import { cn } from "@/lib/cn";

/** Page gutter + max width. Every section's content sits inside one of these. */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
