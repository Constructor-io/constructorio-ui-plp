import { useEffect, useMemo, useState } from 'react';
import useRequestConfigs from './useRequestConfigs';

export interface UsePaginationProps {
  /**
   * Total number of results returned by the API response
   */
  totalNumResults: number;
  /**
   * Number of results returned per page
   */
  resultsPerPage?: number;
  /**
   * Number of pages to display in the pagination window
   */
  windowSize?: number;
}

export interface UsePaginationReturn {
  // Represents the current page number in the pagination
  // It's typically used to highlight the current page in the UI and to determine which set of data to fetch or display
  currentPage: number | undefined;

  // Allows you to navigate to a specific page and takes a page number as an argument
  goToPage: (page: number) => void;

  // Navigate to the next page. Used to implement "Next" button in a pagination control.
  nextPage: () => void;

  // Navigate to the previous page. Used to implement "Previous" button in a pagination control.
  prevPage: () => void;

  // The total number of pages available in the pagination object
  totalPages: number;

  /**
   *  Returns an array of numbers [1,2,3,4,-1,10]
   *  1,10 are first and last page
   *  -1 indicates a break (e.g., to show "...")
   *  [1, 2, 3, 4, ..., 10] */
  pages: number[];
}

export type UsePagination = (props: UsePaginationProps) => UsePaginationReturn;

const usePagination: UsePagination = ({
  totalNumResults,
  resultsPerPage: resultsPerPageFromProps,
  windowSize = 5,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  const { getRequestConfigs, setRequestConfigs } = useRequestConfigs();
  const { page: currentPage, resultsPerPage: resultsPerPageFromConfigs } = getRequestConfigs();

  const resultsPerPage = resultsPerPageFromProps || resultsPerPageFromConfigs || 20;

  const setCurrentPage = (page: number) => setRequestConfigs({ page, resultsPerPage });

  // Calculate total number of pages
  useEffect(() => {
    if (totalNumResults && resultsPerPage) {
      setTotalPages(Math.ceil(totalNumResults / resultsPerPage));
    }
  }, [totalNumResults, resultsPerPage]);

  const goToPage = (page: number) => {
    if (currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pages = useMemo(() => {
    const pagesArray: number[] = [];

    if (currentPage) {
      let startPage: number;
      let endPage: number;

      if (totalPages <= windowSize) {
        // fewer than windowSize total pages so show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // more than windowSize total pages so calculate start and end pages
        const maxPagesBeforeCurrentPage = Math.floor(windowSize / 2);
        const maxPagesAfterCurrentPage = Math.ceil(windowSize / 2) - 1;

        if (currentPage <= maxPagesBeforeCurrentPage) {
          // near the start
          startPage = 1;
          endPage = windowSize;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
          // near the end
          startPage = totalPages - windowSize + 1;
          endPage = totalPages;
        } else {
          // somewhere in the middle
          startPage = currentPage - maxPagesBeforeCurrentPage;
          endPage = currentPage + maxPagesAfterCurrentPage;
        }
      }

      // add start page and end page to the array if they are not included
      if (startPage > 1) {
        pagesArray.push(1);

        if (startPage > 2) {
          pagesArray.push(-1); // -1 indicates a break (e.g., to show "...")
        }
      }

      for (let i = startPage; i <= endPage; i += 1) {
        pagesArray.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pagesArray.push(-1); // -1 indicates a break (e.g., to show "...")
        }
        pagesArray.push(totalPages);
      }
    }

    return pagesArray;
  }, [currentPage, totalPages, windowSize]);

  return {
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    totalPages,
    pages,
  };
};

export default usePagination;
