import React from 'react';
import { PaginationProps } from '../../types';

// Todo:
//   Pagination component should get PaginationProps from context and accept configuration props same as usePagination
export default function Pagination(props: { pagination: PaginationProps }) {
  const { pagination } = props;
  return (
    <div>
      <div>Current Page: {pagination.currentPage}</div>
      <div>Total: {pagination.totalPages}</div>
      <button onClick={() => pagination.prevPage()} type='button'>
        Previous
      </button>

      {pagination.pages.map((page) => (
        <button onClick={() => pagination.goToPage(page)} type='button'>
          {page}
        </button>
      ))}
      <button onClick={() => pagination.nextPage()} type='button'>
        Next
      </button>
    </div>
  );
}