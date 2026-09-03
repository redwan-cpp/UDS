import Link from "next/link";

import { UthanMark } from "@/components/brand/UthanMark";

/**
 * The studio lockup: the drawn mark beside the name.
 *
 * The mark was previously absent on purpose — inventing a logo would have been
 * inventing brand identity. The studio has since supplied one, so it leads the
 * lockup and the name sits beside it, which is how the supplied artwork is
 * composed. The mark inherits `currentColor`, so the header needs no separate
 * light and dark asset.
 */
export function Wordmark({
  name,
  className = "",
  showRule = true,
}: {
  name: string;
  className?: string;
  showRule?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group/mark inline-flex items-center gap-3 py-1.5 ${className}`}
      aria-label={`${name} — home`}
    >
      <UthanMark className="h-7 w-auto shrink-0 transition-colors duration-[var(--dur-base)] group-hover/mark:text-accent" />

      <span className="inline-flex flex-col gap-1.5">
        <span className="text-nav uppercase">
          <span className="font-medium">Uthan</span>
          <span className="text-secondary transition-colors duration-[var(--dur-fast)] group-hover/mark:text-accent">
            {" "}
            Design Studio
          </span>
        </span>
        {showRule && (
          <span
            aria-hidden="true"
            className="block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--dur-base)] ease-out-soft group-hover/mark:scale-x-100 group-focus-visible/mark:scale-x-100 motion-reduce:transition-none"
          />
        )}
      </span>
    </Link>
  );
}
