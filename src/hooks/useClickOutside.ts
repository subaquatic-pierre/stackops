import { useEffect, type RefObject } from "react";

/**
 * Calls `callback` when a `mousedown` event fires outside `ref.current`.
 * Uses `mousedown` (not `click`) to avoid race conditions with other
 * click handlers that may unmount or toggle the target element.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
): void {
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, callback]);
}
