import { useCallback, useRef, useEffect } from 'react';

/**
 * Infinite scroll using the browser's IntersectionObserver (no library needed).
 *
 * Usage:
 *   const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading, results.length);
 *   ...
 *   <div ref={sentinelRef} />   // place an empty div AFTER the last item
 *
 * When that div comes within 400px of the viewport, `onReachEnd` is called.
 * @param {Function} onReachEnd  called when the bottom is reached
 * @param {boolean}  enabled     set false to pause (no more pages, or already loading)
 * @param {*}        resetKey    changes when new items arrive, so the observer re-checks
 *                               (handles tall screens where the sentinel is still visible)
 */
export default function useInfiniteScroll(onReachEnd, enabled, resetKey) {
  const callbackRef = useRef(onReachEnd);
  const observerRef = useRef(null);

  // Always call the latest version of the callback
  useEffect(() => {
    callbackRef.current = onReachEnd;
  }, [onReachEnd]);

  // Disconnect on unmount
  useEffect(() => () => observerRef.current && observerRef.current.disconnect(), []);

  // Callback ref: React calls it when the sentinel element mounts / unmounts.
  // It is recreated when `enabled` or `resetKey` change, which re-attaches the observer.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) callbackRef.current();
        },
        { rootMargin: '400px' }
      );
      observerRef.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, resetKey]
  );
}
