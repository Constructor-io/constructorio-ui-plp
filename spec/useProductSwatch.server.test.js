import '@testing-library/jest-dom';
import useProductSwatch from '../src/components/ProductSwatch/useProductSwatch';
import { transformResultItem } from '../src/utils/transformers';
import mockItem from './local_examples/item.json';
import { renderHookServerSide, renderHookServerSideWithCioPlp } from './test-utils.server';

describe('Testing Hook on the server: useProductSwatch', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const transformedItem = transformResultItem(mockItem);

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHookServerSide(() => useProductSwatch())).toThrow();
  });

  it('Should return swatchList, selectedVariation, selectVariation', async () => {
    const {
      result: { swatchList, selectedVariation, selectVariation },
    } = renderHookServerSideWithCioPlp(() => useProductSwatch({ item: transformedItem }));

    expect(typeof selectVariation).toBe('function');
    expect(selectedVariation).toBeUndefined();
    expect(swatchList).toBeUndefined();
  });
});
