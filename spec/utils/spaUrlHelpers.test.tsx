import { setUrlWithPushState } from '../../src/utils';
import { EMITTED_EVENTS } from '../../src/constants';

describe('Testing SPA UrlHelper: setUrlWithPushState', () => {
  const originalWindowLocation = window.location;
  const mockUrl = 'https://example.com/a/random/path?q=3&randomQuery=[true,%20false]';

  beforeEach(() => {
    window.location = mockUrl;
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  test('setUrlWithPushState should emit the spaNavigation event', () => {
    const nextUrl = 'https://example.com/a/random/path?q=item&page=3';
    const callbackFn = jest.fn();
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    window.addEventListener(EMITTED_EVENTS.SPA_NAVIGATION, callbackFn);

    setUrlWithPushState(nextUrl);

    expect(callbackFn).toHaveBeenCalledTimes(1);
    expect(callbackFn).toHaveBeenCalledWith(
      expect.objectContaining({
        type: EMITTED_EVENTS.SPA_NAVIGATION,
        detail: { url: nextUrl },
      }),
    );
    expect(dispatchEventSpy.mock.calls.map(([event]) => event.type)).toEqual([
      EMITTED_EVENTS.SPA_NAVIGATION,
    ]);

    window.removeEventListener(EMITTED_EVENTS.SPA_NAVIGATION, callbackFn);
    dispatchEventSpy.mockRestore();
  });

  test('setUrlWithPushState should treat relative URLs as same-origin and use pushState', () => {
    const relativeUrl = '/a/random/path?q=item&page=2';
    const pushStateSpy = jest.spyOn(window.history, 'pushState');

    setUrlWithPushState(relativeUrl);

    expect(pushStateSpy).toHaveBeenCalledWith({ url: relativeUrl }, '', relativeUrl);

    pushStateSpy.mockRestore();
  });

  test('setUrlWithPushState should fall back to a full navigation for cross-origin URLs', () => {
    const crossOriginUrl = 'https://cross-origin.example.com/a/random/path?q=item';
    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    setUrlWithPushState(crossOriginUrl);

    expect(pushStateSpy).not.toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    expect(window.location.href).toBe(crossOriginUrl);

    pushStateSpy.mockRestore();
    dispatchEventSpy.mockRestore();
  });

  test('setUrlWithPushState should fall back to a full navigation when pushState throws', () => {
    const nextUrl = 'https://example.com/a/random/path?q=item&page=2';
    const pushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {
      throw new DOMException('pushState failed', 'SecurityError');
    });
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    setUrlWithPushState(nextUrl);

    expect(pushStateSpy).toHaveBeenCalled();
    expect(dispatchEventSpy).not.toHaveBeenCalled();
    expect(window.location.href).toBe(nextUrl);

    pushStateSpy.mockRestore();
    dispatchEventSpy.mockRestore();
  });
});
