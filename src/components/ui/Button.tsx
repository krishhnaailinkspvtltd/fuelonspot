import { cn } from "@/lib/cn";

type Variant = "primary" | "navy" | "outline" | "outlineDark" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] font-semibold " +
  "tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow,transform] " +
  "duration-200 ease-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-fuel-600 text-white shadow-[0_1px_0_0_rgba(4,24,46,0.18)] hover:bg-fuel-700 hover:shadow-[0_6px_20px_-8px_rgba(14,124,60,0.85)]",
  navy: "bg-navy-800 text-white hover:bg-navy-900",
  outline:
    "border border-line-strong bg-white text-navy-800 hover:border-navy-800 hover:bg-navy-800 hover:text-white",
  outlineDark:
    "border border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10",
  quiet: "text-navy-800 hover:text-fuel-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-6 text-base sm:px-7",
};

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
