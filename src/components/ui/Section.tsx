import type { ReactNode } from "react";

/**
 * Section rhythm is weighted by role, not applied uniformly — one padding value
 * everywhere is what makes a page read as "nothing gets its own moment"
 * (design.md §4). Three roles, and a section must pick one.
 *
 *   pivotal     the hero, featured work, the closing move
 *   standard    the default band
 *   connective  a section whose job is to link two bigger ones
 */
type Spacing = "pivotal" | "standard" | "connective" | "none";
type Surface = "dark" | "soft" | "light" | "dim";

const SPACING: Record<Spacing, string> = {
  pivotal: "py-24 md:py-40 lg:py-48",
  standard: "py-20 md:py-28 lg:py-32",
  connective: "py-16 md:py-20 lg:py-24",
  none: "",
};

/**
 * Surface also flips the accent token, which is what structurally prevents
 * pistachio ever landing on warm white (it measures 1.4:1 — see ruler.md §4).
 */
const SURFACE: Record<Surface, string> = {
  dark: "surface-dark bg-ink text-paper",
  soft: "surface-dark bg-ink-soft text-paper",
  light: "surface-light bg-paper text-ink",
  dim: "surface-light bg-paper-dim text-ink",
};

interface SectionProps {
  children: ReactNode;
  id?: string;
  surface?: Surface;
  spacing?: Spacing;
  /** Accessible name for the landmark, when the section has no visible heading. */
  label?: string;
  labelledBy?: string;
  className?: string;
}

export function Section({
  children,
  id,
  surface = "dark",
  spacing = "standard",
  label,
  labelledBy,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={`relative ${SURFACE[surface]} ${SPACING[spacing]} ${className}`}
    >
      {children}
    </section>
  );
}
