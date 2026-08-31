import Image from "next/image";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * The supplied FuelOnSpot lockup, used unmodified.
 *
 * Its wordmark is navy, so on dark surfaces it sits on a white plate rather
 * than being recoloured — the mark itself is never altered.
 */
export function Logo({
  className,
  imgClassName,
  plate = false,
  priority = false,
  width = 200,
}: {
  className?: string;
  imgClassName?: string;
  plate?: boolean;
  priority?: boolean;
  width?: number;
}) {
  const img = (
    <Image
      src="/fuelonspot-logo.png"
      alt={`${site.name} — ${site.tagline}`}
      width={900}
      height={361}
      priority={priority}
      sizes={`${width}px`}
      className={cn("h-auto w-full select-none", imgClassName)}
    />
  );

  if (!plate) {
    return (
      <span className={cn("block", className)} style={{ width }}>
        {img}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "logo-plate inline-flex items-center rounded-[4px] px-3.5 py-2.5",
        className,
      )}
    >
      <span className="block" style={{ width }}>
        {img}
      </span>
    </span>
  );
}

/** Emblem only — used where the full lockup would be too wide. */
export function LogoMark({
  className,
  size = 40,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/fuelonspot-mark.png"
      alt=""
      aria-hidden="true"
      width={440}
      height={453}
      priority={priority}
      sizes={`${size}px`}
      style={{ width: size, height: "auto" }}
      className={cn("select-none", className)}
    />
  );
}
