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

  it('Should return the defaults if no search term or browse filter is found', async () => {
    window.location.href = 'https://example.com';

    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { data, filters, pagination, sort, groups, refetch } = result.current;

      expect(data?.rawApiResponse).toBeUndefined();
      expect(data?.request).toBeUndefined();
      expect(data?.resultId).toBeUndefined();
      expect(filters.facets).toEqual([]);
      expect(groups.groupOptions).toEqual([]);
      expect(groups.optionsToRender).toEqual([]);
      expect(groups.groupOptions).toEqual([]);
      expect(groups.optionsToRender).toEqual([]);
      expect(groups.breadcrumbs).toEqual([]);
      expect(groups.initialNumOptions).toEqual(5);
      expect(pagination.currentPage).toEqual(1);
      expect(pagination.totalPages).toEqual(0);
      expect(sort.selectedSort).toEqual(null);

      expect(typeof filters.setFilter).toEqual('function');
      expect(typeof groups.onOptionSelect).toEqual('function');
      expect(typeof groups.goToGroupFilter).toEqual('function');
      expect(typeof groups.setOptionsToRender).toEqual('function');
      expect(typeof pagination.goToPage).toEqual('function');
      expect(typeof pagination.nextPage).toEqual('function');
      expect(typeof pagination.prevPage).toEqual('function');
      expect(typeof filters.setFilter).toEqual('function');
      expect(typeof refetch).toEqual('function');

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(0);
      expect(mockConstructorIOClient?.browse.getBrowseResults).toHaveBeenCalledTimes(0);
    });
  });

  it('Should return the expected values/methods if the query === shoes (mocked)', async () => {
    window.location.href = 'https://example.com?q=shirts';
    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { data, filters, pagination, sort, groups, refetch } = result.current;

      expect(data?.rawApiResponse?.request?.term).toEqual('shoes');
      expect(data?.rawApiResponse).not.toBeUndefined();
      expect(data?.request).not.toBeUndefined();
      expect((data as PlpSearchDataResults)?.response.results.length).toBeGreaterThan(0);
      expect(data?.resultId).not.toBeUndefined();
      expect(filters.facets.length).not.toEqual(0);
      expect(groups.optionsToRender.length).not.toEqual(0);
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

  it('Should call getSearchResults if refetch is used and it is a search page', async () => {
    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { data, refetch } = result.current;
      expect(data?.request.term).toEqual('shoes');

      refetch();

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(2);
      expect(mockConstructorIOClient?.browse.getBrowseResults).toHaveBeenCalledTimes(0);
    });
  });

  it('Should call getBrowseResults if refetch is used and it is a browse page', async () => {
    window.location.href = 'https://example.com/group_id/1030';
    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { data, refetch } = result.current;

      expect(data?.request.term).toEqual('');
      expect(data?.request.browse_filter_name).toEqual('group_id');
      expect(data?.request.browse_filter_value).toEqual('1030');

      refetch();

      expect(mockConstructorIOClient?.browse.getBrowseResults).toHaveBeenCalledTimes(2);
      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(0);
    });
  });

  it('Should use the right refetch if the page has been reloaded', async () => {
    const { result } = renderHookWithCioPlp(() => useCioPlp());

    await waitFor(() => {
      const { data } = result.current;

      expect(data?.request.term).toEqual('shoes');
      expect(data?.request.browse_filter_name).toEqual(undefined);
      expect(data?.request.browse_filter_value).toEqual(undefined);

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(1);
      expect(mockConstructorIOClient?.browse.getBrowseResults).toHaveBeenCalledTimes(0);
    });

    let count = 0;
    window.location.href = 'https://example.com/group_id/1030';

    await waitFor(() => {
      const { data, refetch } = result.current;

      if (count === 0) {
        refetch();
        count += 1;
      }

      expect(data?.request.term).toEqual('');
      expect(data?.request.browse_filter_name).toEqual('group_id');
      expect(data?.request.browse_filter_value).toEqual('1030');

      expect(mockConstructorIOClient?.search.getSearchResults).toHaveBeenCalledTimes(1);
      expect(mockConstructorIOClient?.browse.getBrowseResults).toHaveBeenCalledTimes(1);
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
      const { data, sort, pagination, groups, filters } = result.current;
      expect(data?.request.term).toEqual('shoes');

      sort.changeSelectedSort({ sortBy: 'price', sortOrder: 'descending' } as PlpSortOption);

      expect(window.location.href.indexOf('sortBy=price')).toBeGreaterThan(-1);
      expect(window.location.href.indexOf('sortOrder=descending')).toBeGreaterThan(-1);

      pagination.goToPage(4);

      expect(window.location.href.indexOf('page=4')).toBeGreaterThan(-1);

      filters.setFilter('color', 'red');
      expect(decodeURI(window.location.href).indexOf('filters[color]=red')).toBeGreaterThan(-1);

      groups.setGroup('123-ab');
      expect(decodeURI(window.location.href).indexOf('filters[group_id]=123-ab')).toBeGreaterThan(
        -1,
      );

      groups.onOptionSelect('6');
      expect(decodeURI(window.location.href).indexOf('filters[group_id]=6')).toBeGreaterThan(-1);
    });
  });
});
