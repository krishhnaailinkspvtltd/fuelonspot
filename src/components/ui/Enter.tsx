import { cn } from "@/lib/cn";

/**
 * Above-the-fold entrance animation.
 *
 * Unlike <Reveal>, this is a server component driven purely by CSS, so the
 * content is painted as soon as the HTML and stylesheet arrive — it never
 * waits for hydration. Use it for anything in the first viewport (the hero);
 * use <Reveal> for everything the user has to scroll to.
 */
export function Enter({
  children,
  delay = 0,
  variant = "rise",
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  variant?: "rise" | "fade";
  className?: string;
  as?: "div" | "span" | "li";
}) {
  return (
    <Tag
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(variant === "rise" ? "fos-enter" : "fos-enter-fade", className)}
    >
      {children}
    </Tag>
  );
}
