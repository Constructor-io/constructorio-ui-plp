/* eslint-disable react/jsx-filename-extension */
import useCioPlpProvider from '../../../src/hooks/useCioPlpProvider';
import { renderHookServerSide } from '../../test-utils.server';

describe('Testing Hook on the server: useCioPlpProvider', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should return client when custom client is provided', () => {
    const mockClient = { tracker: () => {} };
    const { result } = renderHookServerSide(({ cioClient }) => useCioPlpProvider({ cioClient }), {
      initialProps: { cioClient: mockClient },
    });

    expect(result.cioClient).toBe(mockClient);
  });

  it('Should return when clientOptions are provided', () => {
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

    const { result } = renderHookServerSide(
      ({ apiKey, options }) => useCioPlpProvider({ apiKey, options }),
      {
        initialProps: { apiKey: key, options: clientOptions },
      },
    );

    expect(result.cioClient).toBe(null);
  });
});
