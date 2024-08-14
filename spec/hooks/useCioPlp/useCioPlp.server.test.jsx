import useCioPlp from '../../../src/hooks/useCioPlp';
import { transformSearchResponse } from '../../../src/utils/transformers';
import { renderHookServerSideWithCioPlp } from '../../test-utils.server';
import { DEMO_API_KEY } from '../../../src/constants';
import apiSearchResponse from '../../local_examples/apiSearchResponse.json';

describe('Testing Hook on the server: useCioPlp with initial search results', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  it('Should throw error if called outside of PlpContext', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    const initialSearchResponse = transformSearchResponse(apiSearchResponse);

    expect(() => useCioPlp({ initialSearchResponse })).toThrow();

    spy.mockRestore();
  });

  it('Should not break if cioClient is null', () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => useCioPlp(), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('Should return the defaults if no search term is found and no initialResponse provided', () => {
    const { result } = renderHookServerSideWithCioPlp(() => useCioPlp(), {
      apiKey: DEMO_API_KEY,
    });

    expect(() => {
      const { searchData, filters, pagination, sort, refetch } = result.current;

      expect(searchData?.rawApiResponse).toBeUndefined();
      expect(searchData?.request).toBeUndefined();
      expect(searchData?.resultId).toBeUndefined();
      expect(filters.facets).toEqual([]);
      expect(pagination.currentPage).toEqual(1);
      expect(pagination.totalPages).toEqual(0);
      expect(sort.selectedSort).toEqual(null);

      expect(typeof filters.setFilter).toEqual('function');
      expect(typeof pagination.goToPage).toEqual('function');
      expect(typeof pagination.nextPage).toEqual('function');
      expect(typeof pagination.prevPage).toEqual('function');
      expect(typeof filters.setFilter).toEqual('function');
      expect(typeof refetch).toEqual('function');
    });
  });

  it('Should return the expected values/methods if an initialSearchResponse is passed', () => {
    const initialSearchResponse = transformSearchResponse(apiSearchResponse);
    const { result } = renderHookServerSideWithCioPlp(() => useCioPlp({ initialSearchResponse }), {
      apiKey: DEMO_API_KEY,
    });

    expect(() => {
      const { searchData, filters, pagination, sort, refetch } = result.current;

      expect(searchData?.rawApiResponse.request.term).toEqual('shoes');
      expect(searchData?.rawApiResponse).not.toBeUndefined();
      expect(searchData?.request).not.toBeUndefined();
      expect(searchData?.response.results.length).toBeGreaterThan(0);
      expect(searchData?.resultId).not.toBeUndefined();
      expect(filters.facets.length).not.toEqual(0);
      expect(pagination.currentPage).toEqual(1);
      expect(pagination.totalPages).toEqual(18);
      expect(sort.selectedSort).toEqual(null);

      expect(typeof filters.setFilter).toEqual('function');
      expect(typeof pagination.goToPage).toEqual('function');
      expect(typeof pagination.nextPage).toEqual('function');
      expect(typeof pagination.prevPage).toEqual('function');
      expect(typeof filters.setFilter).toEqual('function');
      expect(typeof refetch).toEqual('function');
    });
  });
});
