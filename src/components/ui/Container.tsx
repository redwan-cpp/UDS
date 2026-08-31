import type { ElementType, ReactNode } from "react";

type ContainerWidth = "wide" | "text" | "narrow" | "full";

const WIDTHS: Record<ContainerWidth, string> = {
  wide: "max-w-(--container-wide)",
  text: "max-w-(--container-text)",
  narrow: "max-w-(--container-narrow)",
  full: "max-w-none",
};

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  width?: ContainerWidth;
  /** Drop the page gutter — for full-bleed media that runs to the viewport edge. */
  bleed?: boolean;
  className?: string;
}

/**
 * The page gutter lives here and nowhere else, so horizontal rhythm is
 * identical on every route without each section re-deciding it.
 */
export function Container({
  children,
  as: Tag = "div",
  width = "wide",
  bleed = false,
  className = "",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${WIDTHS[width]} ${bleed ? "" : "px-(--gutter)"} ${className}`}
    >
      {children}
    </Tag>
  );
}
