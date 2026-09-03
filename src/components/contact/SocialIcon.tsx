/**
 * Channel marks for the four platforms the studio asked for.
 *
 * Drawn as single-weight glyphs at the same stroke as the rest of the
 * interface's line work, rather than dropped in as the platforms' full-colour
 * brand assets — a row of brand blue, gradient pink and WhatsApp green would
 * be the loudest thing on a page built almost entirely from hairlines.
 *
 * Decorative: every one of these sits next to its own visible text label, so
 * the icon is hidden from assistive technology rather than announced twice.
 */
export function SocialIcon({ label }: { label: string }) {
  const shared = {
    viewBox: "0 0 16 16",
    "aria-hidden": true as const,
    className: "size-3.5 shrink-0",
  };

  switch (label.toLowerCase()) {
    case "facebook":
      return (
        <svg {...shared} fill="currentColor">
          <path d="M9.2 14.5V8.6h2l.3-2.3H9.2V4.8c0-.66.18-1.11 1.13-1.11h1.2V1.6a16 16 0 0 0-1.76-.09c-1.74 0-2.93 1.06-2.93 3.01v1.78H4.8v2.3h2.04v5.9h2.36Z" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="1.9" y="1.9" width="12.2" height="12.2" rx="3.6" />
          <circle cx="8" cy="8" r="3" />
          <circle cx="11.6" cy="4.4" r="0.72" fill="currentColor" stroke="none" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.2">
          <path
            d="M2.2 13.8 3.1 11a5.9 5.9 0 1 1 2.2 2.1l-3.1.7Z"
            strokeLinejoin="round"
          />
          <path
            d="M6.1 5.8c.25 1.7 2.4 3.85 4.1 4.1l.7-.95 1.15.55c-.2.8-.9 1.1-1.6 1-2.3-.3-4.5-2.5-4.8-4.8-.1-.7.2-1.4 1-1.6l.55 1.15-.1.55Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "linkedin":
      return (
        <svg {...shared} fill="currentColor">
          <path d="M3.05 5.9h1.9v7.6h-1.9zM4 2.5a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM6.6 5.9h1.82v1.04h.03c.25-.46.87-.95 1.8-.95 1.92 0 2.28 1.2 2.28 2.77v3.74h-1.9v-3.32c0-.79-.02-1.81-1.14-1.81-1.14 0-1.31.85-1.31 1.75v3.38H6.6z" />
        </svg>
      );

    default:
      return null;
  }
}
