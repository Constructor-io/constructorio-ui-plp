import { act, renderHook } from '@testing-library/react';
import useHistoryLocation from '../../../src/hooks/useHistoryLocation';
import { EMITTED_EVENTS } from '../../../src/constants';

describe('Testing Hook: useHistoryLocation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not subscribe to location change events when disabled', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useHistoryLocation(false));

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('popstate', expect.any(Function));
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      EMITTED_EVENTS.SPA_NAVIGATION,
      expect.any(Function),
    );
  });

  it('Should keep returning the initial href on location change when disabled', () => {
    const { result } = renderHook(() => useHistoryLocation(false));
    const initialHref = result.current;

    act(() => {
      window.history.pushState({}, '', '/disabled-path?q=boots');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current).toBe(initialHref);
  });

  it('Should return the updated href on location change when enabled', () => {
    const updatedHref = '/enabled-path?q=boots';
    const { result } = renderHook(() => useHistoryLocation(true));

    act(() => {
      window.history.pushState({}, '', updatedHref);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current).toBe(window.location.href);
    expect(result.current).toContain(updatedHref);
  });

  it('Should return the updated href on spaNavigation when enabled', () => {
    const updatedHref = '/url-change-path?q=boots';
    const { result } = renderHook(() => useHistoryLocation(true));

    act(() => {
      window.history.pushState({}, '', updatedHref);
      window.dispatchEvent(new CustomEvent(EMITTED_EVENTS.SPA_NAVIGATION));
    });

    expect(result.current).toBe(window.location.href);
    expect(result.current).toContain(updatedHref);
  });

  it('Should remove both listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useHistoryLocation(true));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      EMITTED_EVENTS.SPA_NAVIGATION,
      expect.any(Function),
    );
  });
});
