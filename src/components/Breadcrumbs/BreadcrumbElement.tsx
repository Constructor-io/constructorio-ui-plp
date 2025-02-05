import React from 'react';
import { concatStyles } from '../../utils/styleHelpers';
import { BreadcrumbProps } from './types';
import ChevronRight from '../../icons/chevron-right.svg';

export default function BreadcrumbElement({
  path,
  breadcrumb,
  isCurrentPage = false,
  onClickHandler,
}: BreadcrumbProps) {
  // If it's a parent breadcrumb but doesn't have a path and label OR
  // It is a current page and it doesn't have a label, don't render.
  if ((!isCurrentPage && !path && !breadcrumb) || (isCurrentPage && !breadcrumb)) {
    return null;
  }

  const handleClick = () => {
    if (onClickHandler && path) {
      onClickHandler(path);
    }
  }

  return (
    <>
      <li
        className={concatStyles(
          'cio-plp-breadcrumb',
          !isCurrentPage && 'cio-plp-parent-breadcrumb',
        )}>
        {/* {!isCurrentPage ? <a href={path}>{breadcrumb}</a> : <span>{breadcrumb}</span>} */}
        {!isCurrentPage ? <span onClick={handleClick}>{breadcrumb}</span> : <span>{breadcrumb}</span>}
      </li>
      {!isCurrentPage && <img src={ChevronRight} alt='chevron-right' />}
    </>
  );
}
