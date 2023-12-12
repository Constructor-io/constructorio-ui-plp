import React from 'react';
import { IncludeRenderProps, PaginationObject } from '../../types';

type PaginationWithRenderProps = IncludeRenderProps<
  { pagination: PaginationObject },
  PaginationObject
>;

// Todo:
//   Pagination component should get PaginationProps from context and accept configuration props same as usePagination
export default function Pagination(props: PaginationWithRenderProps) {
  const { pagination, children } = props;
  const { currentPage, goToPage, nextPage, pages, prevPage, totalPages } = pagination;
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
        <div>
          <button onClick={() => prevPage()} type='button'>
            Previous
          </button>

          {pages.map((page) => (
            <button onClick={() => goToPage(page)} type='button'>
              {page === -1 ? <span>...</span> : page}
            </button>
          ))}
          <button onClick={() => nextPage()} type='button'>
            Next
          </button>
        </div>
      )}
    </>
  );
}
