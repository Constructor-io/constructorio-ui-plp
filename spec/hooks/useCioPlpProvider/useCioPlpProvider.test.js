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
});
