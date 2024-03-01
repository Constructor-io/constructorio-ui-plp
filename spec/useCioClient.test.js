import { renderHook } from '@testing-library/react';
import useCioClient from '../src/hooks/useCioClient';
import version from '../src/version';

describe('Testing Hook: useCioClient', () => {
  test('Should throw error if Api Key not provided', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useCioClient())).toThrow();
    spy.mockRestore();
  });

  test('Should return client when custom client is provided', () => {
    const mockClient = { tracker: () => {} };
    const { result } = renderHook(({ cioClient }) => useCioClient({ cioClient }), {
      initialProps: { cioClient: mockClient },
    });

    expect(result.current).toBe(mockClient);
  });

  test('Should return a ConstructorIO Client Object', () => {
    const { result } = renderHook(({ apiKey }) => useCioClient({ apiKey }), {
      initialProps: { apiKey: 'xx' },
    });
    const client = result.current;
    expect(client).not.toBeUndefined();
    expect(client.options).not.toBeUndefined();
    expect(client.options.apiKey).toBe('xx');
    expect(client.options.sendTrackingEvents).toBe(true);
    expect(client.options.version).toBe(`cio-ui-plp-${version}`);
    expect(client.browse).not.toBeUndefined();
    expect(client.search).not.toBeUndefined();
  });

  test('Should return a client with options set', () => {
    const key = 'xx';
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

    const { result } = renderHook(({ apiKey, options }) => useCioClient({ apiKey, options }), {
      initialProps: { apiKey: key, options: clientOptions },
    });

    const client = result.current;
    expect(client.options).toEqual({
      apiKey: key,
      sendTrackingEvents: true,
      version: `cio-ui-plp-${version}`,
      ...clientOptions,
    });
  });
});
