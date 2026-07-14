import { useState, useEffect } from 'react';

/**
 * Subscribes to browser history changes (popstate) and returns the current href.
 * Re-renders the consumer when the URL changes via our default `setUrl`
 * (which dispatches popstate) or the browser Back/Forward interactions.
 */
export default function useHistoryLocation(): string | undefined {
  const [href, setHref] = useState<string | undefined>(() =>
    typeof window !== 'undefined' ? window.location.href : undefined,
  );

  useEffect(() => {
    const onPopState = () => setHref(window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return href;
}
