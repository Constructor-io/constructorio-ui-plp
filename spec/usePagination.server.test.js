import usePagination from '../src/components/Pagination/usePagination';
import { DEMO_API_KEY } from '../src/constants';
import { renderHookServerSideWithCioPlp } from './test-utils.server';

const paginationProps = {
  totalNumResults: 1000,
  windowSize: 10,
};

describe('Testing Hook on the server: usePagination', () => {
  it('Should not break', async () => {
    expect(() =>
      renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
        apiKey: DEMO_API_KEY,
      }),
    ).not.toThrow();
  });

  it('should initialize with the first page', () => {
    const { result } = renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
      apiKey: DEMO_API_KEY,
    });
    expect(result.currentPage).toBe(1);
  });

  it('should initialize with 0 total pages', () => {
    const { result } = renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
      apiKey: DEMO_API_KEY,
    });
    expect(result.totalPages).toBe(0);
  });

  it('should initialize with an empty pages array', () => {
    const { result } = renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
      apiKey: DEMO_API_KEY,
    });
    expect(result.pages).toEqual([]);
  });
});
