import { useState, useEffect } from 'react';
import { EMITTED_EVENTS } from '../constants';

/**
 * Subscribes to browser history changes and returns the current href.
 * Listens to native popstate (Back / Forward) and the library's own SPA_NAVIGATION event (setUrlWithPushState).
 * When `enabled` is false, no listener is attached and the initial href is returned.
 */
export default function useHistoryLocation(enabled: boolean = true): string | undefined {
  const [href, setHref] = useState<string | undefined>(() =>
    typeof window !== 'undefined' ? window.location.href : undefined,
  );

  useEffect(() => {
    if (!enabled) return undefined;

    const onLocationChange = () => setHref(window.location.href);
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener(EMITTED_EVENTS.SPA_NAVIGATION, onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener(EMITTED_EVENTS.SPA_NAVIGATION, onLocationChange);
    };
  }, [enabled]);

  return href;
}
