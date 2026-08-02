import {useEffect, useRef} from 'react';

// Each call to useSharedBodyScrollLock gets a unique ID.
// The body scroll is locked while the set is non-empty.
const locks = new Set<string>();
let nextId = 0;

function applyBodyScroll() {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = locks.size > 0 ? 'hidden' : '';
}

/**
 * Locks body scroll when `active` is true. Multiple concurrent calls
 * are safe — the scroll only unlocks when every active lock releases.
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
