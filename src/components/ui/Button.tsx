import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";

/**
 * Three variants, no more. Colours resolve through the surface-aware accent
 * tokens, so a primary button is pistachio-on-ink in a dark section and
 * olive-on-paper in a light one without the caller choosing.
 *
 * Geometry: zero radius, 44px minimum target, hover moves the fill or the
 * underline — never the button's position.
 */
const BASE =
  "inline-flex min-h-11 items-center justify-center gap-3 text-meta uppercase " +
  "transition-colors duration-[var(--dur-fast)] ease-out-soft " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent px-7 py-3.5 text-on-accent hover:bg-accent-hover",
  secondary:
    "border border-hairline px-7 py-3.5 text-current hover:border-accent hover:text-accent",
  quiet: "group/quiet gap-2 text-current",
};

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  if (variant !== "quiet") return <>{children}</>;
  return (
    <span className="relative">
      {children}
      {/* The rule draws in from the left on hover — the brand's structural
          gesture, applied at the smallest scale. */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 left-0 block h-px w-full origin-left scale-x-0 bg-current transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/quiet:scale-x-100 group-focus-visible/quiet:scale-x-100 motion-reduce:transition-none"
      />
    </span>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  children: ReactNode;
}

export function ButtonLink({
  variant = "secondary",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = "secondary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}

/**
 * The close cross: two hairlines, drawn rather than a glyph, at the same
 * weight as every other rule on the site.
 *
 * Lived as four hand-copied pairs of rotated spans — in the menu overlay, the
 * search panel, the expanded team card and the image viewer. Identical markup
 * every time, differing only in size, which is exactly how an icon set drifts
 * out of one stroke weight.
 *
 * The size arrives as the whole `className` rather than being appended to a
 * default, deliberately: Tailwind resolves competing `size-*` utilities by
 * stylesheet order, not by the order they appear in the attribute, so a
 * built-in `size-4` plus a caller's `size-3.5` is a coin toss rather than an
 * override.
 */
export function CloseIcon({ className = "size-4" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative block ${className}`}>
      <span className="absolute top-1/2 left-0 block h-px w-full rotate-45 bg-current" />
      <span className="absolute top-1/2 left-0 block h-px w-full -rotate-45 bg-current" />
    </span>
  );
}

/** The arrow used on quiet links and index rows. Decorative — never the only cue. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`size-4 shrink-0 ${className}`}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}
