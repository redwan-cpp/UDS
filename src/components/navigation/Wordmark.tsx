import Link from "next/link";

/**
 * The studio name, set — no mark.
 *
 * The drawn mark sat here beside the name until the studio asked for it out.
 * It leads the footer lockup instead, at scale, where the supplied artwork
 * has room to be itself. Repeating it small in a fixed header meant the mark
 * appeared twice on every page, and the header's job is not to re-state the
 * identity — it is to hold the name and get out of the way of the work
 * behind it.
 *
 * Used by the header and by the menu overlay's top row, which takes the
 * header's exact position while the overlay is open; they have to match, so
 * both lose the mark together.
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
      className={`group/mark inline-flex items-center py-1.5 ${className}`}
      aria-label={`${name} — home`}
    >
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
