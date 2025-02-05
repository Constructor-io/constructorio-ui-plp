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
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
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
          <span role='button' tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>
            {breadcrumb}
          </span>
        ) : (
          <span>{breadcrumb}</span>
        )}
      </li>
      {!isCurrentPage && <img src={ChevronRight} alt='chevron-right' />}
    </>
  );
}
