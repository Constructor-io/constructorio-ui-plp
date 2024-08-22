/* eslint-disable react/no-array-index-key */
import React from 'react';
import { IncludeRenderProps, PaginationObject, UsePaginationProps } from '../../types';
import usePagination from '../../hooks/usePagination';

export type PaginationWithRenderProps = IncludeRenderProps<UsePaginationProps, PaginationObject>;

export default function Pagination(props: PaginationWithRenderProps) {
  const { totalNumResults, resultsPerPage, windowSize, children } = props;
  const { currentPage, goToPage, nextPage, pages, prevPage, totalPages } = usePagination({
    totalNumResults,
    resultsPerPage,
    windowSize,
  });

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
        <div className='cio-pagination'>
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
