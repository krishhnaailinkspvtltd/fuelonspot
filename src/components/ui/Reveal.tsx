"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger in milliseconds. Keep steps small (60–90ms) so nothing feels slow. */
  delay?: number;
  /** "rise" translates up on entry, "fade" only changes opacity. */
  variant?: "rise" | "fade";
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
};

/**
 * Scroll-reveal wrapper. Animates once, then stops observing.
 * Motion is disabled entirely under prefers-reduced-motion (see globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  variant = "rise",
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Fail open: if the observer is unavailable, unhide the node immediately
    // rather than leaving it stuck at opacity 0. Written straight to the DOM
    // rather than through setState — this is a one-way update to an external
    // system and setState here would trigger a cascading render.
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    // Anything already in view on first paint should not wait for a scroll.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-visible={visible ? "true" : "false"}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={cn(variant === "rise" ? "fos-reveal" : "fos-fade", className)}
    >
      {children}
    </Tag>
  );
}
