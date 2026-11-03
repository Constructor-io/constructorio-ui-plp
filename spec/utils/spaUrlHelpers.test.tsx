import { setUrlWithPushState } from '../../src/utils';

describe('Testing SPA UrlHelper: setUrlWithPushState', () => {
  const originalWindowLocation = window.location;
  const mockUrl = 'https://example.com/a/random/path?q=3&randomQuery=[true,%20false]';

  beforeEach(() => {
    window.location = mockUrl;
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  test('setUrlWithPushState should push the url to history and dispatch popstate', () => {
    const nextUrl = 'https://example.com/a/random/path?q=item&page=2';
    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    setUrlWithPushState(nextUrl);

    expect(pushStateSpy).toHaveBeenCalledWith({ url: nextUrl }, '', nextUrl);
    expect(window.location.href).toBe(nextUrl);

    const dispatchedEvent = dispatchEventSpy.mock.calls[0][0] as PopStateEvent;
    expect(dispatchedEvent.type).toBe('popstate');
    expect(dispatchedEvent.state).toEqual({ url: nextUrl });

    pushStateSpy.mockRestore();
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
