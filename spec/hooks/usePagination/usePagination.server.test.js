import usePagination from '../../../src/hooks/usePagination';
import { DEMO_API_KEY } from '../../../src/constants';
import { renderHookServerSideWithCioPlp } from '../../test-utils.server';

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

  it('should compute totalPages synchronously', () => {
    const { result } = renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
      apiKey: DEMO_API_KEY,
    });
    // 1000 results / 20 per page = 50 pages
    expect(result.totalPages).toBe(50);
  });

  it('should compute pages array synchronously', () => {
    const { result } = renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
      apiKey: DEMO_API_KEY,
    });
    expect(result.pages.length).toBeGreaterThan(0);
    expect(result.pages[0]).toBe(1);
  });

  it('should return undefined for getPageUrl on the server', () => {
    const { result } = renderHookServerSideWithCioPlp(() => usePagination(paginationProps), {
      apiKey: DEMO_API_KEY,
    });
    expect(result.getPageUrl(1)).toBeUndefined();
  });
});
