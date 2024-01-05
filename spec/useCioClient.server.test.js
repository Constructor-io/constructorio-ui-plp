/* eslint-disable react/jsx-filename-extension */
import useCioClient from '../src/hooks/useCioClient';
import { renderHookServerSide } from './test-utils.server';

describe('Testing Hook on the server: useCioClient', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should throw error if Api Key not provided', () => {
    expect(() =>
      renderHookServerSide(() => useCioClient(), {
        initialProps: {},
      }),
    ).toThrow('Api Key required');
  });

  it('Should return null when apiKey is provided', () => {
    const { result } = renderHookServerSide(({ apiKey }) => useCioClient(apiKey), {
      initialProps: { apiKey: 'xx' },
    });

    expect(result).toBe(null);
  });

  it('Should return when clientOptions are provided', () => {
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

    const { result } = renderHookServerSide(
      ({ apiKey, options }) => useCioClient(apiKey, options),
      {
        initialProps: { apiKey: key, options: clientOptions },
      },
    );

    expect(result).toBe(null);
  });
});
