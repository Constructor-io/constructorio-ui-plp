/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { IncludeRenderProps } from '../../types';
import usePagination, { UsePaginationProps, UsePaginationReturn } from '../../hooks/usePagination';

// Returns true for clicks that should fall through to native browser behavior
// (open in new tab/window): non-primary button or any modifier key held.
function isModifiedClick(e: React.MouseEvent): boolean {
  return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

// Renders a pagination nav arrow (prev/next) as an <a> when an href is available,
// otherwise as a <button>. Anchors enable crawler discovery; the button fallback
// covers boundary pages (no prev on page 1, no next on last page) where no valid
// URL exists
function NavArrow({
  href,
  onNavigate,
  testId,
  ariaLabel,
  children,
}: {
  href: string | undefined;
  onNavigate: () => void;
  testId: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <a
        href={href}
        onClick={(e) => {
          if (isModifiedClick(e)) return;
          e.preventDefault();
          onNavigate();
        }}
        data-testid={testId}
        aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onNavigate} type='button' data-testid={testId} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export type PaginationProps = UsePaginationProps & {
  /**
   * **⚠️ Deprecation Notice ⚠️**
   *
   * _This prop will be removed in v2. Anchor-based rendering will become the default behavior._
   *
   * When true, renders the numbered page controls and the previous/next navigation controls
   * as `<a href>` anchor elements instead of `<button>` elements.
   * On boundary pages (no previous page on page 1, no next page on the last page) the
   * corresponding prev/next control falls back to a `<button>` since no valid href exists.
   * This enables search engine crawlers (e.g., Google) to discover and index paginated content.
   * JavaScript-enabled browsers still use SPA navigation via onClick + preventDefault,
   * while modifier-clicks (Cmd/Ctrl/Shift/Alt or middle-click) fall through to native browser behavior.
   */
  useAnchors?: boolean;
};
export type PaginationWithRenderProps = IncludeRenderProps<PaginationProps, UsePaginationReturn>;

export default function Pagination(props: PaginationWithRenderProps) {
  const { totalNumResults, resultsPerPage, windowSize = 5, useAnchors, children } = props;
  const [pageWindowSize, setPageWindowSize] = useState(windowSize);
  const pagesRef = useRef<HTMLDivElement>(null);

  const { currentPage, goToPage, nextPage, prevPage, pages, totalPages, getPageUrl } =
    usePagination({
      totalNumResults,
      resultsPerPage,
      windowSize: pageWindowSize,
    });

  useEffect(() => {
    setPageWindowSize(windowSize);
  }, [windowSize]);

  // Calculate windowSize on resize event
  useEffect(() => {
    const resize = () => {
      const parentSize = Number(pagesRef.current?.parentElement?.clientWidth) || window.innerWidth;
      setPageWindowSize(Math.max(1, Math.min(Math.floor(parentSize / 60) - 4, windowSize)));
    };
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [windowSize]);

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
          getPageUrl,
        })
      ) : (
        <div ref={pagesRef} className='cio-pagination'>
          <NavArrow
            href={useAnchors && currentPage ? getPageUrl(currentPage - 1) : undefined}
            onNavigate={prevPage}
            testId='cio-pagination-prev-button'
            ariaLabel='Previous page'>
            &lt;
          </NavArrow>
          {pages.map((page, i) => {
            if (page === -1) {
              if (useAnchors) {
                return (
                  <span key={`${page},${i}`} className='cio-pagination-ellipsis'>
                    ...
                  </span>
                );
              }

              return (
                <button onClick={() => goToPage(page)} type='button' key={`${page},${i}`}>
                  <span>...</span>
                </button>
              );
            }
            const isSelected = currentPage === page;
            const className = isSelected ? 'selected' : undefined;
            const ariaCurrent = isSelected ? 'page' : undefined;

            if (useAnchors) {
              return (
                <a
                  href={getPageUrl(page)}
                  onClick={(e) => {
                    if (isModifiedClick(e)) return;
                    e.preventDefault();
                    goToPage(page);
                  }}
                  key={`${page},${i}`}
                  className={className}
                  aria-current={ariaCurrent}>
                  {page}
                </a>
              );
            }

            return (
              <button
                onClick={() => goToPage(page)}
                type='button'
                key={`${page},${i}`}
                className={className}
                aria-current={ariaCurrent}>
                {page}
              </button>
            );
          })}
          <NavArrow
            href={useAnchors && currentPage ? getPageUrl(currentPage + 1) : undefined}
            onNavigate={nextPage}
            testId='cio-pagination-next-button'
            ariaLabel='Next page'>
            &gt;
          </NavArrow>
        </div>
      )}
    </>
  );
}

Pagination.defaultProps = {
  resultsPerPage: 20,
  windowSize: 5,
};
