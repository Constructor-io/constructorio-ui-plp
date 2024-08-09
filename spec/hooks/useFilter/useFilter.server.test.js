import { transformSearchResponse } from '../../../src/utils/transformers';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';
import { renderHookServerSide, renderHookServerSideWithCioPlp } from '../../test-utils.server';
import { DEMO_API_KEY } from '../../../src/constants';
import useFilter from '../../../src/hooks/useFilter';

describe('Testing Hook on the server: useFilter', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const searchData = transformSearchResponse(mockSearchResponse);
  const useFilterProps = { facets: searchData.response.facets };

  it('Should throw an error if called outside of PlpContext', () => {
    expect(() => renderHookServerSide(() => useFilter(useFilterProps))).toThrow();
  });

  it('Should not break if window is undefined', async () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => useFilter(useFilterProps), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return facets array', async () => {
    const {
      result: { facets },
    } = renderHookServerSideWithCioPlp(() => useFilter(useFilterProps), {
      apiKey: DEMO_API_KEY,
    });

    expect(facets).toHaveLength(searchData.response.facets.length);
    expect(facets).toEqual(searchData.response.facets);
  });

  it('Should return a function to apply a filter', async () => {
    const {
      result: { setFilter },
    } = renderHookServerSideWithCioPlp(() => useFilter(useFilterProps), {
      apiKey: DEMO_API_KEY,
    });

    expect(typeof setFilter).toBe('function');
  });
});
