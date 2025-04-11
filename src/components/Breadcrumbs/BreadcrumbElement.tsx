import React from 'react';
import { concatStyles } from '../../utils/styleHelpers';
import { BreadcrumbProps } from './types';
import ChevronRightIcon from './ChevronRightIcon';

export default function BreadcrumbElement({
  path,
  groupId,
  breadcrumb,
  isCurrentPage = false,
  onClick,
}: BreadcrumbProps) {
  // If it's a parent breadcrumb but doesn't have a path and label OR
  // It is a current page and it doesn't have a label, don't render.
  if ((!isCurrentPage && !path && !breadcrumb) || (isCurrentPage && !breadcrumb)) {
    return null;
  }

  const handleClick = () => {
    if (onClick && groupId) {
      onClick(groupId);
    }
  };

  return (
    <>
      <li
        className={concatStyles(
          'cio-plp-breadcrumb',
          !isCurrentPage && 'cio-plp-parent-breadcrumb',
        )}>
        {!isCurrentPage ? (
          <button type='button' onClick={handleClick}>
            {breadcrumb}
          </button>
        ) : (
          <span>{breadcrumb}</span>
        )}
      </li>
      {!isCurrentPage && <ChevronRightIcon />}
    </>
  );
}
