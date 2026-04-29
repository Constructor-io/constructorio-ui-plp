import '@testing-library/jest-dom';
import useOnShowMoreSwatches from '../../../src/hooks/callbacks/useOnShowMoreSwatches';
import { renderHookWithCioPlp } from '../../test-utils';

describe('Testing Hook: useOnShowMoreSwatches', () => {
  const mockSetUrl = jest.fn();

  const selectedSwatch = {
    url: 'https://example.com/product/red',
    itemName: 'Red',
    variationId: 'red',
    swatchPreview: '#e04062',
  };

  const hiddenSwatches = [
    {
      url: 'https://example.com/product/green',
      itemName: 'Green',
      variationId: 'green',
      swatchPreview: '#a3c43b',
    },
  ];

  const mockEvent = {
    stopPropagation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return a function', () => {
    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(selectedSwatch, hiddenSwatches, mockSetUrl),
    );

    expect(typeof result.current).toBe('function');
  });

  it('Should call setUrl with selectedSwatch url by default', () => {
    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(selectedSwatch, hiddenSwatches, mockSetUrl),
    );

    result.current(mockEvent);
    expect(mockSetUrl).toHaveBeenCalledWith('https://example.com/product/red');
  });

  it('Should not call setUrl when selectedSwatch has no url', () => {
    const swatchWithoutUrl = { ...selectedSwatch, url: undefined };

    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(swatchWithoutUrl, hiddenSwatches, mockSetUrl),
    );

    result.current(mockEvent);
    expect(mockSetUrl).not.toHaveBeenCalled();
  });

  it('Should not call setUrl when selectedSwatch is undefined', () => {
    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(undefined, hiddenSwatches, mockSetUrl),
    );

    result.current(mockEvent);
    expect(mockSetUrl).not.toHaveBeenCalled();
  });

  it('Should call custom callback instead of default when provided', () => {
    const mockCallback = jest.fn();

    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(selectedSwatch, hiddenSwatches, mockSetUrl, mockCallback),
    );

    result.current(mockEvent);
    expect(mockCallback).toHaveBeenCalledWith(
      mockEvent,
      selectedSwatch,
      hiddenSwatches,
      mockSetUrl,
    );
    expect(mockSetUrl).not.toHaveBeenCalled();
  });

  it('Should not trigger default navigation when custom callback is provided', () => {
    const mockCallback = jest.fn();

    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(selectedSwatch, hiddenSwatches, mockSetUrl, mockCallback),
    );

    result.current(mockEvent);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockSetUrl).not.toHaveBeenCalled();
  });

  it('Should call stopPropagation on the event', () => {
    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(selectedSwatch, hiddenSwatches, mockSetUrl),
    );

    result.current(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('Should call stopPropagation even when custom callback is provided', () => {
    const mockCallback = jest.fn();

    const { result } = renderHookWithCioPlp(() =>
      useOnShowMoreSwatches(selectedSwatch, hiddenSwatches, mockSetUrl, mockCallback),
    );

    result.current(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
