import React from 'react';
import { MoreBreadcrumbsMenuProps } from './types';
import ChevronRightIcon from './ChevronRightIcon';
import EllipsisIcon from './EllipsisIcon';

export default function MoreBreadcrumbsMenu({ breadcrumbs }: MoreBreadcrumbsMenuProps) {
  const [expanded, setExpanded] = React.useState(false);
  const moreMenuRef = React.useRef<HTMLElement>(null);
  const openMenuRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    function handleClickOutsideMenu(event) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target) &&
        !openMenuRef.current?.contains(event.target)
      ) {
        setExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [moreMenuRef]);

  return (
    <>
      <li className='cio-plp-parent-breadcrumb cio-plp-more-breadcrumbs-menu'>
        <button
          id='cio-more-menu-button'
          data-testid='cio-more-menu-button'
          type='button'
          aria-haspopup
          aria-expanded={expanded}
          aria-controls='cio-more-menu'
          ref={openMenuRef}
          onClick={() => {
            setExpanded(!expanded);
          }}>
          <EllipsisIcon />
        </button>
        <nav
          id='cio-more-menu'
          data-testid='cio-more-menu'
          role='region'
          ref={moreMenuRef}
          aria-labelledby='cio-more-menu-button'
          aria-hidden={!expanded}>
          {expanded && (
            <ul role='menu'>
              {breadcrumbs.map((breadcrumbItem) => (
                <li key={breadcrumbItem.path}>
                  <a href={breadcrumbItem.path}>{breadcrumbItem.breadcrumb}</a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </li>
      <ChevronRightIcon />
    </>
  );
}
