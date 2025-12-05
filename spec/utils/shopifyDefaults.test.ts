import { shopifyDefaults } from '../../src/utils/shopifyDefaults';
import type { Item, Variation } from '../../src/types';

describe('shopifyDefaults', () => {
  const originalWindowLocation = window.location;
  const mockUrl = 'https://example.com/a/random/path?q=3&randomQuery=[true,%20false]';

  beforeEach(() => {
    const freshMockLocation = new URL(mockUrl);

    Object.defineProperty(window, 'location', {
      value: freshMockLocation,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
  });

  describe('shopifyDefaults', () => {
    it('should return an object with urlHelpers and callbacks', () => {
      expect(shopifyDefaults).toHaveProperty('urlHelpers');
      expect(shopifyDefaults).toHaveProperty('callbacks');
      expect(shopifyDefaults.urlHelpers).toHaveProperty('setUrl');
      expect(shopifyDefaults.callbacks).toHaveProperty('onAddToCart');
      expect(shopifyDefaults.callbacks).toHaveProperty('onProductCardClick');
    });
  });

  describe('urlHelpers.setUrl', () => {
    it('should replace /group_id with /collections in URL', () => {
      const testUrl = 'https://example.com/group_id/test-collection';

      shopifyDefaults.urlHelpers.setUrl(testUrl);

      expect(window.location.href).toBe('https://example.com/collections/test-collection');
    });

    it('should handle URLs without /group_id', () => {
      const testUrl = 'https://example.com/other-path';

      shopifyDefaults.urlHelpers.setUrl(testUrl);

      expect(window.location.href).toBe(testUrl);
    });
  });

  describe('callbacks.onAddToCart', () => {
    let fetchMock: jest.Mock;

    beforeEach(() => {
      fetchMock = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({}),
        }),
      ) as jest.Mock;
      global.fetch = fetchMock;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call Shopify cart API with __shopify_id if available', () => {
      const mockItem = {
        itemId: 'item-123',
        itemName: 'Test Product',
        data: { __shopify_id: 'shopify-456' },
        matchedTerms: [],
        isSlotted: false,
        labels: {},
      } as Item;
      const mockEvent = {} as React.MouseEvent;

      shopifyDefaults.callbacks.onAddToCart?.(mockEvent, mockItem);

      expect(fetchMock).toHaveBeenCalledWith('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'shopify-456',
          quantity: 1,
        }),
      });
    });

    it('should fallback to variationId if __shopify_id is not available', () => {
      const mockItem = {
        itemId: 'item-123',
        itemName: 'Test Product',
        data: {},
        matchedTerms: [],
        isSlotted: false,
        labels: {},
      } as Item;
      const mockVariation: Partial<Variation> = {
        variationId: 'variation-789',
        itemName: 'Test Variation',
        data: {},
      };
      const mockEvent = {} as React.MouseEvent;

      shopifyDefaults.callbacks.onAddToCart?.(mockEvent, mockItem, mockVariation as Variation);

      expect(fetchMock).toHaveBeenCalledWith('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'variation-789',
          quantity: 1,
        }),
      });
    });

    it('should fallback to itemId if neither __shopify_id nor variationId is available', () => {
      const mockItem = {
        itemId: 'item-123',
        itemName: 'Test Product',
        data: {},
      } as Item;
      const mockEvent = {} as React.MouseEvent;

      shopifyDefaults.callbacks.onAddToCart?.(mockEvent, mockItem);

      expect(fetchMock).toHaveBeenCalledWith('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'item-123',
          quantity: 1,
        }),
      });
    });

    it('should handle fetch errors gracefully', async () => {
      const mockItem = {
        itemId: 'item-123',
        itemName: 'Test Product',
        data: {},
      } as Item;
      const mockEvent = {} as React.MouseEvent;

      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      // Should not throw
      expect(() => {
        shopifyDefaults.callbacks.onAddToCart?.(mockEvent, mockItem);
      }).not.toThrow();
    });
  });

  describe('callbacks.onProductCardClick', () => {
    it('should navigate to /products/:itemId', () => {
      const mockItem = {
        itemId: 'test-product-123',
        itemName: 'Test Product',
        data: {},
      } as Item;
      const mockEvent = {} as React.MouseEvent;

      shopifyDefaults.callbacks.onProductCardClick?.(mockEvent, mockItem);

      expect(window.location.href).toBe('https://example.com/products/test-product-123');
    });

    it('should replace existing path when navigating to product', () => {
      const mockItem = {
        itemId: 'product-456',
        itemName: 'Another Product',
        data: {},
      } as Item;
      const mockEvent = {} as React.MouseEvent;

      const currentPath = window.location.pathname;

      expect(currentPath).toBe('/a/random/path');

      shopifyDefaults.callbacks.onProductCardClick?.(mockEvent, mockItem);

      expect(window.location.href).toBe('https://example.com/products/product-456');
      expect(window.location.pathname).toBe('/products/product-456');
    });
  });
});
