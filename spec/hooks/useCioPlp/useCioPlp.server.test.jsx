import useCioPlp from '../../../src/hooks/useCioPlp';
import { transformSearchResponse } from '../../../src/utils/transformers';
import { renderHookServerSideWithCioPlp } from '../../test-utils.server';
import { DEMO_API_KEY } from '../../../src/constants';
import apiSearchResponse from '../../local_examples/apiSearchResponse.json';
import apiBrowseResponse from '../../local_examples/apiBrowseResponse.json';

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

    const { data, filters, pagination, sort, refetch } = result;

    expect(data?.rawApiResponse).toBeUndefined();
    expect(data?.request).toBeUndefined();
    expect(data?.resultId).toBeUndefined();
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

  it('Should return the expected values/methods if an initialSearchResponse is passed', () => {
    const { result } = renderHookServerSideWithCioPlp(
      () => useCioPlp({ initialSearchResponse: apiSearchResponse }),
      {
        apiKey: DEMO_API_KEY,
      },
    );

    const { data, filters, pagination, sort, refetch } = result;

    expect(data?.rawApiResponse.request.term).toEqual('shoes');
    expect(data?.rawApiResponse).not.toBeUndefined();
    expect(data?.request).not.toBeUndefined();
    expect(data?.response.results.length).toBeGreaterThan(0);
    expect(data?.resultId).not.toBeUndefined();
    expect(filters.facets.length).not.toEqual(0);
    expect(sort.selectedSort).toEqual(null);

    expect(pagination.currentPage).toEqual(1);
    expect(pagination.totalPages).toEqual(0);

    expect(typeof filters.setFilter).toEqual('function');
    expect(typeof pagination.goToPage).toEqual('function');
    expect(typeof pagination.nextPage).toEqual('function');
    expect(typeof pagination.prevPage).toEqual('function');
    expect(typeof filters.setFilter).toEqual('function');
    expect(typeof refetch).toEqual('function');
  });

  it('Should return the expected values/methods if an initialBrowseResponse is passed', () => {
    const { result } = renderHookServerSideWithCioPlp(
      () => useCioPlp({ initialBrowseResponse: apiBrowseResponse }),
      {
        apiKey: DEMO_API_KEY,
      },
    );

    const { data, filters, pagination, sort, refetch } = result;

    expect(data?.rawApiResponse.request.term).toEqual('');
    expect(data?.rawApiResponse.request.browse_filter_name).toEqual('group_id');
    expect(data?.rawApiResponse.request.browse_filter_value).toEqual('1030');
    expect(data?.rawApiResponse).not.toBeUndefined();
    expect(data?.request).not.toBeUndefined();
    expect(data?.response.results.length).toBeGreaterThan(0);
    expect(data?.resultId).not.toBeUndefined();
    expect(filters.facets.length).not.toEqual(0);
    expect(sort.selectedSort).toEqual(null);

    expect(pagination.currentPage).toEqual(1);
    expect(pagination.totalPages).toEqual(0);

    expect(typeof filters.setFilter).toEqual('function');
    expect(typeof pagination.goToPage).toEqual('function');
    expect(typeof pagination.nextPage).toEqual('function');
    expect(typeof pagination.prevPage).toEqual('function');
    expect(typeof filters.setFilter).toEqual('function');
    expect(typeof refetch).toEqual('function');
  });
});
