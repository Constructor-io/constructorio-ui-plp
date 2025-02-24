import React from 'react';
import { concatStyles } from '../../utils/styleHelpers';
import { BreadcrumbProps } from './types';
import ChevronRightIcon from './ChevronRightIcon';

export default function BreadcrumbElement({
  path,
  breadcrumb,
  isCurrentPage = false,
}: BreadcrumbProps) {
  // If it's a parent breadcrumb but doesn't have a path and label OR
  // It is a current page and it doesn't have a label, don't render.
  if ((!isCurrentPage && !path && !breadcrumb) || (isCurrentPage && !breadcrumb)) {
    return null;
  }
  return (
    <>
      <li
        className={concatStyles(
          'cio-plp-breadcrumb',
          !isCurrentPage && 'cio-plp-parent-breadcrumb',
        )}>
        {!isCurrentPage ? <a href={path}>{breadcrumb}</a> : <span>{breadcrumb}</span>}
      </li>
      {!isCurrentPage && <ChevronRightIcon />}
    </>
  );
}
