/* eslint-disable import/no-extraneous-dependencies */
import { act, waitFor } from '@testing-library/react';
import usePagination from '../../../src/hooks/usePagination';
import { renderHookWithCioPlp } from '../../test-utils';

const paginationProps = {
  resultsPerPage: 10,
  totalNumResults: 1000,
  windowSize: 10,
};

const originalWindowLocation = window.location;

describe('usePagination', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
  });

  it('should initialize with the first page', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));
    expect(result.current.currentPage).toBe(1);
  });

  it('should handle page changes', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.goToPage(5);
    });

    waitFor(() => expect(result.current.currentPage).toBe(5));
  });

  it('should not exceed total pages', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.goToPage(101);
    });

    waitFor(() => expect(result.current.currentPage).toBe(1)); // because page 101 does not exist
  });

  it('should not go below the first page', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.goToPage(-1);
    });

    waitFor(() => expect(result.current.currentPage).toBe(1)); // because there is no page 0 or -1
  });

  it('should go to next and previous page', async () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.nextPage();
    });

    waitFor(() => expect(result.current.currentPage).toBe(2));

    act(() => {
      result.current.prevPage();
    });

    waitFor(() => expect(result.current.currentPage).toBe(1));
  });

  it('should generate correct number of pages', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.goToPage(50);
    });

    waitFor(() =>
      expect(result.current.pages).toEqual([
        1, -1, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, -1, 100,
      ]),
    );
  });

  it('should include the first and last page when near the start', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.goToPage(1);
    });

    waitFor(() => expect(result.current.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, 100]));
  });

  it('should include the first and last page when near the end', () => {
    const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));

    act(() => {
      result.current.goToPage(100);
    });

    waitFor(() =>
      expect(result.current.pages).toEqual([1, -1, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]),
    );
  });

  describe('getPageUrl', () => {
    it('should return a URL with the correct page parameter', () => {
      const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));
      const url = result.current.getPageUrl(3);
      expect(url).toBeDefined();
      expect(url).toContain('page=3');
    });

    it('should return undefined for page 0', () => {
      const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));
      expect(result.current.getPageUrl(0)).toBeUndefined();
    });

    it('should return undefined for negative pages', () => {
      const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));
      expect(result.current.getPageUrl(-1)).toBeUndefined();
    });

    it('should return undefined for pages beyond totalPages', () => {
      const { result } = renderHookWithCioPlp(() => usePagination(paginationProps));
      expect(result.current.getPageUrl(9999)).toBeUndefined();
    });
  });
});
