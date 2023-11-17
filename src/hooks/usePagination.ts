import { useMemo, useState } from 'react';

const usePagination = (totalPages: number, pagesPerSection = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const pages = useMemo(() => {
    const pagesArray: number[] = [];
    const currentSection = Math.ceil(currentPage / pagesPerSection);

    const startPage = Math.max(1, (currentSection - 1) * pagesPerSection + 1);
    const endPage = Math.min(totalPages, currentSection * pagesPerSection);

    for (let i = startPage; i <= endPage; i += 1) {
      pagesArray.push(i);
    }

    return pagesArray;
  }, [currentPage, totalPages, pagesPerSection]);

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
