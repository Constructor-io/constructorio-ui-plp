import { useState, useEffect } from 'react';

/**
 * Subscribes to browser history changes via popstate and returns the current href.
 * When `enabled` is false, no listener is attached and the initial href is returned.
 */
export default function useHistoryLocation(enabled: boolean = true): string | undefined {
  const [href, setHref] = useState<string | undefined>(() =>
    typeof window !== 'undefined' ? window.location.href : undefined,
  );

  useEffect(() => {
    if (!enabled) return undefined;

    const onPopState = () => setHref(window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [enabled]);

  return href;
}
