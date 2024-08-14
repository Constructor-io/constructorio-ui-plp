import { renderHook, waitFor } from '@testing-library/react';
import useCioPlp from '../../../src/hooks/useCioPlp';
import { mockConstructorIOClient, renderHookWithCioPlp } from '../../test-utils';
import { PlpSearchDataResults, PlpSortOption } from '../../../src/types';
import apiSearchResponse from '../../local_examples/apiSearchResponse.json';

const originalWindowLocation = window.location;

describe('Testing Hook: useCioPlp', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });

    jest.clearAllMocks();

    window.location.href = 'https://example.com?q=shirts';
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
  });

  it('Should throw error if called outside of PlpContext', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useCioPlp())).toThrow();
    spy.mockRestore();
  });

  it('Should return the defaults if no search term is found', async () => {
    window.location.href = 'https://example.com';

    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
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

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(0);
    });
  });

  it('Should return the expected values/methods if the query === shoes (mocked)', async () => {
    window.location.href = 'https://example.com?q=shirts';
    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { searchData, filters, pagination, sort, refetch } = result.current;

      expect(searchData?.rawApiResponse.request.term).toEqual('shoes');
      expect(searchData?.rawApiResponse).not.toBeUndefined();
      expect(searchData?.request).not.toBeUndefined();
      expect((searchData as PlpSearchDataResults)?.response.results.length).toBeGreaterThan(0);
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

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(1);
    });
  });

  it('Should call getSearchResults if refetch is used', async () => {
    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { searchData, refetch } = result.current;
      expect(searchData?.request.term).toEqual('shoes');

      refetch();

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(2);
    });
  });

  it('Should pass paginationConfigs to the pagination hook', async () => {
    const windowSize = 2;
    const resultsPerPage = 1;
    const paginationConfigs = { windowSize, resultsPerPage };
    const { result } = renderHookWithCioPlp(() => useCioPlp({ paginationConfigs }));

    await waitFor(() => {
      const { pagination } = result.current;

      expect(pagination.totalPages).toBe(
        apiSearchResponse.response.total_num_results / resultsPerPage,
      );

      expect(pagination.pages.length).toBe(windowSize + 2);
    });
  });

  it('Should set to the url if set options are used', async () => {
    const { result } = renderHookWithCioPlp(() => useCioPlp(), {
      initialProps: { staticRequestConfigs: { resultsPerPage: 1 } },
    });

    await waitFor(() => {
      const { searchData, sort, pagination, filters } = result.current;
      expect(searchData?.request.term).toEqual('shoes');

      sort.changeSelectedSort({ sortBy: 'price', sortOrder: 'descending' } as PlpSortOption);

      expect(window.location.href.indexOf('sortBy=price')).toBeGreaterThan(-1);
      expect(window.location.href.indexOf('sortOrder=descending')).toBeGreaterThan(-1);

      pagination.goToPage(4);

      expect(window.location.href.indexOf('page=4')).toBeGreaterThan(-1);

      filters.setFilter('color', 'red');
      expect(decodeURI(window.location.href).indexOf('filters[color]=red')).toBeGreaterThan(-1);
    });
  });
});
