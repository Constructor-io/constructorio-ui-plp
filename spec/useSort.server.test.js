import '@testing-library/jest-dom';
import useSort from '../src/hooks/useSort';
import { transformSearchResponse } from '../src/utils/transformers';
import mockSearchResponse from './local_examples/apiSearchResponse.json';
import { renderHookServerSide, renderHookServerSideWithCioPlp } from './test-utils.server';
import { DEMO_API_KEY } from '../src/constants';

describe('Testing Hook on the server: useSort', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const searchResponse = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchResponse.sortOptions;

  it('Should throw an error if called outside of PlpContext', () => {
    expect(() => renderHookServerSide(() => useSort(searchResponse))).toThrow();
  });

  it('Should not break if window is undefined', async () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => useSort(searchResponse), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return sortOptions array', async () => {
    const {
      result: { sortOptions },
    } = renderHookServerSideWithCioPlp(() => useSort(searchResponse), {
      apiKey: DEMO_API_KEY,
    });

    expect(sortOptions).toHaveLength(responseSortOptions.length);
    expect(sortOptions).toEqual(responseSortOptions);
  });

  it('Should return null sort option', async () => {
    const {
      result: { selectedSort },
    } = renderHookServerSideWithCioPlp(() => useSort(searchResponse), {
      apiKey: DEMO_API_KEY,
    });

    expect(selectedSort).toBeNull();
  });

  it('Should return a function to change selected sort', async () => {
    const {
      result: { changeSelectedSort },
    } = renderHookServerSideWithCioPlp(() => useSort(searchResponse), {
      apiKey: DEMO_API_KEY,
    });

    expect(typeof changeSelectedSort).toBe('function');
  });
});
