import useRequestConfigs from '../src/hooks/useRequestConfigs';
import { DEMO_API_KEY } from '../src/constants';
import { renderHookServerSideWithCioPlp } from './test-utils.server';

describe('Testing Hook on the server: useRequestConfigs', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should not break if window is undefined', async () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => useRequestConfigs(), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return any empty object', async () => {
    const { result } = renderHookServerSideWithCioPlp(() => useRequestConfigs(), {
      apiKey: DEMO_API_KEY,
    });

    expect(result).toEqual({});
  });
});