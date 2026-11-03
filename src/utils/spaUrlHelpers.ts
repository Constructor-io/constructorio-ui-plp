// SPA navigation helper: update the URL without a full page reload
// pushState throws a SecurityError for cross-origin URLs
// Fallback to a full page navigation when the target origin differs or parsing fails
// eslint-disable-next-line import/prefer-default-export
export function setUrlWithPushState(newUrlWithEncodedState: string) {
  if (typeof window === 'undefined') return;

  let sameOrigin = false;
  try {
    const target = new URL(newUrlWithEncodedState, window.location.href);
    sameOrigin = target.origin === window.location.origin;
  } catch {
    sameOrigin = false;
  }

  if (!sameOrigin) {
    window.location.href = newUrlWithEncodedState;
    return;
  }

  const state = { url: newUrlWithEncodedState };
  try {
    window.history.pushState(state, '', newUrlWithEncodedState);
  } catch {
    window.location.href = newUrlWithEncodedState;
    return;
  }

  // Note: dispatchEvent must be called after pushState to ensure that the URL change is reflected in the event state.
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
}
