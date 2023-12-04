import { renderHook, act } from '@testing-library/react';
import usePagination from '../src/hooks/usePagination'; // Assume your hook is exported from here

describe('usePagination', () => {
  it('should initialize with the first page', () => {
    const { result } = renderHook(() => usePagination(10));
    expect(result.current.currentPage).toBe(1);
  });

  it('should handle page changes', () => {
    const { result } = renderHook(() => usePagination(10));

    act(() => {
      result.current.goToPage(5);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('should not exceed total pages', () => {
    const { result } = renderHook(() => usePagination(10));

    act(() => {
      result.current.goToPage(11);
    });

    expect(result.current.currentPage).toBe(1); // because page 11 does not exist
  });

  it('should not go below the first page', () => {
    const { result } = renderHook(() => usePagination(10));

    act(() => {
      result.current.goToPage(-1);
    });

    expect(result.current.currentPage).toBe(1); // because there is no page 0 or -1
  });

  it('should go to next and previous page', () => {
    const { result } = renderHook(() => usePagination(10));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should generate correct number of pages', () => {
    const { result } = renderHook(() => usePagination(100, 10));

    act(() => {
      result.current.goToPage(50);
    });

    expect(result.current.pages).toEqual([1, -1, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, -1, 100]);
  });

  it('should include the first and last page when near the start', () => {
    const { result } = renderHook(() => usePagination(100, 10));

    act(() => {
      result.current.goToPage(1);
    });

    expect(result.current.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, 100]);
  });

  it('should include the first and last page when near the end', () => {
    const { result } = renderHook(() => usePagination(100, 10));

    act(() => {
      result.current.goToPage(100);
    });

    expect(result.current.pages).toEqual([1, -1, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
  });
});
