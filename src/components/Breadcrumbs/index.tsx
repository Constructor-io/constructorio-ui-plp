import React from 'react';
import useCioBreadcrumb from '../../hooks/useCioBreadcrumb';

import { splitBreadcrumbs } from './utils';
import { type BreadcrumbsProps } from './types';
import BreadcrumbElement from './BreadcrumbElement';
import MoreBreadcrumbsMenu from './MoreBreadcrumbsMenu';

export default function Breadcrumbs(props: BreadcrumbsProps) {
  const { breadcrumbs = [], currentPage, onClickHandler } = useCioBreadcrumb(props);
  if (!currentPage && (!breadcrumbs || breadcrumbs.length === 0)) return null;

  const { firstItems, middle, lastItems } = splitBreadcrumbs(breadcrumbs);
  return (
    <nav aria-label='plp-breadcrumbs'>
      <ul className='cio-breadcrumbs-container'>
        {firstItems.map((breadcrumb) => (
          <BreadcrumbElement
            key={breadcrumb.path}
            {...breadcrumb}
            onClickHandler={onClickHandler}
          />
        ))}
        {middle.length > 0 && <MoreBreadcrumbsMenu breadcrumbs={middle} />}
        {lastItems.map((breadcrumb) => (
          <BreadcrumbElement
            key={breadcrumb.path}
            {...breadcrumb}
            onClickHandler={onClickHandler}
          />
        ))}
        <BreadcrumbElement breadcrumb={currentPage} isCurrentPage />
      </ul>
    </nav>
  );
}
