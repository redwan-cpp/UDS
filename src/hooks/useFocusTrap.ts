"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Traps focus inside a container while `active`, and restores focus to whatever
 * was focused before it opened.
 *
 * Written by hand rather than pulled in as a dependency: it is thirty lines, and
 * the alternative was a library for one behaviour (ruler.md §5).
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previous = document.activeElement as HTMLElement | null;

    // Move focus in, but to the container rather than the first link, so a
    // screen reader reads the panel's purpose before its contents.
    container.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }
      if (event.key !== "Tab") return;

      const items = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || current === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (!previous?.isConnected) return;

      // The trigger lives in the header, which is `inert` while the dialog is
      // open. Focusing an inert element silently fails, so if the first attempt
      // does not take, retry once after the DOM has settled.
      previous.focus({ preventScroll: true });
      if (document.activeElement !== previous) {
        window.setTimeout(() => {
          if (previous.isConnected) previous.focus({ preventScroll: true });
        }, 0);
      }
    };
  }, [ref, active, onEscape]);
}
