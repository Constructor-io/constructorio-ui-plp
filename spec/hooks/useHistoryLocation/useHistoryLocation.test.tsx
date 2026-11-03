import { act, renderHook } from '@testing-library/react';
import useHistoryLocation from '../../../src/hooks/useHistoryLocation';

describe('Testing Hook: useHistoryLocation', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should not subscribe to popstate when disabled', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    renderHook(() => useHistoryLocation(false));

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('popstate', expect.any(Function));
  });

  it('Should keep returning the initial href on popstate when disabled', () => {
    const { result } = renderHook(() => useHistoryLocation(false));
    const initialHref = result.current;

    act(() => {
      window.history.pushState({}, '', '/disabled-path?q=boots');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current).toBe(initialHref);
  });

  it('Should return the updated href on popstate when enabled', () => {
    const updatedHref = '/enabled-path?q=boots';
    const { result } = renderHook(() => useHistoryLocation(true));

    act(() => {
      window.history.pushState({}, '', updatedHref);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current).toBe(window.location.href);
    expect(result.current).toContain(updatedHref);
  });
});
