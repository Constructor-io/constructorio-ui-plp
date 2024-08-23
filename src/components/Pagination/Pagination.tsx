/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { IncludeRenderProps, PaginationObject, UsePaginationProps } from '../../types';
import usePagination from '../../hooks/usePagination';

export type PaginationWithRenderProps = IncludeRenderProps<UsePaginationProps, PaginationObject>;

export default function Pagination(props: PaginationWithRenderProps) {
  const { totalNumResults, resultsPerPage, windowSize = 5, children } = props;
  const [pageWindowSize, setPageWindowSize] = useState(windowSize);
  const pagesRef = useRef<HTMLDivElement>(null);

  const { currentPage, goToPage, nextPage, prevPage, pages, totalPages } = usePagination({
    totalNumResults,
    resultsPerPage,
    windowSize: pageWindowSize,
  });

  useEffect(() => {
    setPageWindowSize(windowSize);
  }, [windowSize]);

  // Calculate windowSize on resize event
  useEffect(() => {
    const resize = () => {
      const parentSize = Number(pagesRef.current?.parentElement?.clientWidth) || window.innerWidth;
      setPageWindowSize(Math.max(1, Math.min(Math.floor(parentSize / 60) - 4, windowSize)));
    };
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [windowSize]);

  return (
    <>
      {typeof children === 'function' ? (
        children({
          currentPage,
          goToPage,
          nextPage,
          pages,
          prevPage,
          totalPages,
        })
      ) : (
        <div ref={pagesRef} className='cio-pagination'>
          <button onClick={() => prevPage()} type='button' data-testid='cio-pagination-prev-button'>
            &lt;
          </button>
          {pages.map((page, i) => (
            <button
              onClick={() => goToPage(page)}
              type='button'
              key={`${page},${i}`}
              className={currentPage === page ? 'selected' : ''}>
              {page === -1 ? <span>...</span> : page}
            </button>
          ))}
          <button onClick={() => nextPage()} type='button' data-testid='cio-pagination-next-button'>
            &gt;
          </button>
        </div>
      )}
    </>
  );
}

Pagination.defaultProps = {
  resultsPerPage: 20,
  windowSize: 5,
};
