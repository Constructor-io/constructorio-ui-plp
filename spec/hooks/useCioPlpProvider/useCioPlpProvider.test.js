import { renderHook, waitFor } from '@testing-library/react';
import useCioPlpProvider from '../../../src/hooks/useCioPlpProvider';

describe('Testing Hook: useCioPlpProvider', () => {
  it('Should return client when custom client is provided', () => {
    const mockClient = { tracker: () => {} };
    const { result } = renderHook(({ cioClient }) => useCioPlpProvider({ cioClient }), {
      initialProps: { cioClient: mockClient },
    });

    expect(result.current.cioClient).toBe(mockClient);
  });

  test('Should pass custom client options if set', () => {
    const key = 'test-key';
    const clientOptions = {
      serviceUrl: 'https://special.cnstrc.com',
      quizzesServiceUrl: 'https://quizzes.cnstrc.com',
      sessionId: 1,
      clientId: 'id-1',
      userId: 'ui-1',
      segments: ['segment-1', 'segment-2'],
      testCells: { test: 'cell' },
      fetch: 'mock-fetch-fn',
      trackingSendDelay: 400,
      sendReferrerWithTrackingEvents: true,
      beaconMode: false,
      eventDispatcher: undefined,
      networkParameters: { timeout: 1000 },
    };

    const { result } = renderHook(
      ({ apiKey, options }) => useCioPlpProvider({ apiKey, cioClientOptions: options }),
      {
        initialProps: { apiKey: key, options: clientOptions },
      },
    );

    const { cioClientOptions } = result.current;
    expect(cioClientOptions).toEqual({
      ...clientOptions,
    });
  });

  test('Should update client if setCioClientOptions is called', async () => {
    const key = 'test-key';

    const { result } = renderHook(({ apiKey }) => useCioPlpProvider({ apiKey }), {
      initialProps: { apiKey: key },
    });

    let firstRun = true;
    await waitFor(() => {
      const { cioClientOptions, setCioClientOptions, cioClient } = result.current;

      if (firstRun) {
        setCioClientOptions({ userId: 'test' });
        firstRun = false;
      }

      expect(cioClientOptions.userId).toEqual('test');
      expect(cioClient.options.userId).toEqual('test');
    });
  });

  describe('Shopify Defaults', () => {
    test('Should apply Shopify defaults when useShopifyDefaults is true', () => {
      const key = 'test-key';
      const { result } = renderHook(
        ({ apiKey, useShopifyDefaults }) => useCioPlpProvider({ apiKey, useShopifyDefaults }),
        {
          initialProps: { apiKey: key, useShopifyDefaults: true },
        },
      );

      const { callbacks, urlHelpers } = result.current;

      // Verify Shopify callbacks are set as functions
      expect(typeof callbacks.onAddToCart).toBe('function');
      expect(typeof callbacks.onProductCardClick).toBe('function');
    });

    test('Should not apply Shopify defaults when useShopifyDefaults is false', () => {
      const key = 'test-key';
      const { result } = renderHook(
        ({ apiKey, useShopifyDefaults }) => useCioPlpProvider({ apiKey, useShopifyDefaults }),
        {
          initialProps: { apiKey: key, useShopifyDefaults: false },
        },
      );

      const { callbacks } = result.current;

      // Callbacks should be empty object when no custom callbacks and no Shopify defaults
      expect(Object.keys(callbacks).length).toBe(0);
    });

    test('Should allow custom callbacks to override Shopify defaults', () => {
      const key = 'test-key';
      const customOnAddToCart = jest.fn();
      const customOnProductCardClick = jest.fn();

      const { result } = renderHook(
        ({ apiKey, useShopifyDefaults, callbacks }) =>
          useCioPlpProvider({ apiKey, useShopifyDefaults, callbacks }),
        {
          initialProps: {
            apiKey: key,
            useShopifyDefaults: true,
            callbacks: {
              onAddToCart: customOnAddToCart,
              onProductCardClick: customOnProductCardClick,
            },
          },
        },
      );

      const { callbacks } = result.current;

      // Verify custom callbacks are set (not Shopify defaults)
      expect(callbacks.onAddToCart).toBe(customOnAddToCart);
      expect(callbacks.onProductCardClick).toBe(customOnProductCardClick);
    });

    test('Should allow custom urlHelpers to override Shopify defaults', () => {
      const key = 'test-key';
      const customSetUrl = jest.fn();

      const { result } = renderHook(
        ({ apiKey, useShopifyDefaults, urlHelpers }) =>
          useCioPlpProvider({ apiKey, useShopifyDefaults, urlHelpers }),
        {
          initialProps: {
            apiKey: key,
            useShopifyDefaults: true,
            urlHelpers: {
              setUrl: customSetUrl,
            },
          },
        },
      );

      const { urlHelpers } = result.current;

      // Verify custom urlHelper is set (not Shopify default)
      expect(urlHelpers.setUrl).toBe(customSetUrl);
    });
  });
});
