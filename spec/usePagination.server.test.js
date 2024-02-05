import usePagination from '../src/components/Pagination/usePagination';
import { renderHookServerSide } from './test-utils.server';

const paginationProps = {
  initialPage: 1,
  totalNumResults: 1000,
  resultsPerPage: 10,
  windowSize: 10,
};

describe('Testing Hook on the server: usePagination', () => {
  it('Should not break', async () => {
    expect(() => renderHookServerSide(() => usePagination(paginationProps), {})).not.toThrow();
  });

  it('should initialize with the first page', () => {
    const { result } = renderHookServerSide(() => usePagination(paginationProps), {});
    expect(result.currentPage).toBe(paginationProps.initialPage);
  });

  it('should initialize with 0 total pages', () => {
    const { result } = renderHookServerSide(() => usePagination(paginationProps), {});
    expect(result.totalPages).toBe(0);
  });

  it('should initialize with an empty pages array', () => {
    const { result } = renderHookServerSide(() => usePagination(paginationProps), {});
    expect(result.pages).toEqual([]);
  });
});
