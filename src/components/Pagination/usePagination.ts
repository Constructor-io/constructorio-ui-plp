import { useEffect, useMemo, useState } from 'react';
import { UsePagination } from '../../types';

const usePagination: UsePagination = ({
  initialPage,
  totalNumResults,
  resultsPerPage,
  windowSize = 5,
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState<number | undefined>(initialPage);

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
