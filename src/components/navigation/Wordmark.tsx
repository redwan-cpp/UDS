import Link from "next/link";

/**
 * The studio mark, set typographically.
 *
 * A drawn mark is an open client decision (design.md §9) — until one exists,
 * inventing a logo would be inventing brand identity. The rule beneath the
 * name carries the structural gesture instead.
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
      className={`group/mark inline-flex flex-col gap-1.5 py-1.5 ${className}`}
      aria-label={`${name} — home`}
    >
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
    </Link>
  );
}
