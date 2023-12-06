import React from 'react';
import usePagination from '../usePagination';
import { UsePaginationProps } from '../../../types';
import Pagination from '../Pagination';

export default function PaginationExample(props: UsePaginationProps) {
  const pagination = usePagination(props);

  return <Pagination pagination={pagination} />;
}
