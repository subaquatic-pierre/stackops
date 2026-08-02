import {useEffect, useRef} from 'react';

// Each call gets a unique ID, tracked in a Set.
// Body scroll is locked while the set is non-empty.
const locks = new Set<string>();
let nextId = 0;

function applyBodyScroll() {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  if (locks.size > 0) {
    el.classList.add('scroll-locked');
  } else {
    el.classList.remove('scroll-locked');
  }
}

/**
 * Locks body scroll when `active` is true. Safe with multiple
 * concurrent callers — only unlocks when the last one releases.
 */
export function useSharedBodyScrollLock(active: boolean) {
  const lockId = useRef<string | null>(null);

  useEffect(() => {
    if (active) {
      const id = String(++nextId);
      lockId.current = id;
      locks.add(id);
      applyBodyScroll();

      return () => {
        locks.delete(id);
        lockId.current = null;
        applyBodyScroll();
      };
    }
  }, [active]);
}
