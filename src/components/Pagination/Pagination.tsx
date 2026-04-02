/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { IncludeRenderProps } from '../../types';
import usePagination, { UsePaginationProps, UsePaginationReturn } from '../../hooks/usePagination';

export type PaginationProps = UsePaginationProps & {
  /**
   * **⚠️ Deprecation Notice ⚠️**
   *
   * _This prop will be removed in v2. Anchor-based rendering will become the default behavior._
   *
   * When true, renders pagination controls as `<a href>` anchor elements instead of `<button>` elements.
   * This enables search engine crawlers (e.g., Google) to discover and index paginated content.
   * JavaScript-enabled browsers still use SPA navigation via onClick + preventDefault.
   */
  useAnchors?: boolean;
};
export type PaginationWithRenderProps = IncludeRenderProps<PaginationProps, UsePaginationReturn>;

export default function Pagination(props: PaginationWithRenderProps) {
  const { totalNumResults, resultsPerPage, windowSize = 5, useAnchors, children } = props;
  const [pageWindowSize, setPageWindowSize] = useState(windowSize);
  const pagesRef = useRef<HTMLDivElement>(null);

  const { currentPage, goToPage, nextPage, prevPage, pages, totalPages, getPageUrl } = usePagination({
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
          <button onClick={() => prevPage()} type='button' data-testid='cio-pagination-prev-button'>
            &lt;
          </button>
          {useAnchors
            ? pages.map((page, i) =>
                page === -1 ? (
                  <span key={`${page},${i}`} className='cio-pagination-ellipsis'>...</span>
                ) : (
                  <a
                    href={getPageUrl(page)}
                    onClick={(e) => { e.preventDefault(); goToPage(page); }}
                    key={`${page},${i}`}
                    className={currentPage === page ? 'selected' : ''}
                    aria-current={currentPage === page ? 'page' : undefined}>
                    {page}
                  </a>
                ),
              )
            : pages.map((page, i) => (
                <button
                  onClick={() => goToPage(page)}
                  type='button'
                  key={`${page},${i}`}
                  className={currentPage === page ? 'selected' : ''}>
                  {page === -1 ? <span>...</span> : page}
                </button>
              ))}
          <button onClick={() => nextPage()} type='button' data-testid='cio-pagination-next-button'>
            &gt;
          </button>
        </div>
      )}
    </>
  );
}

Pagination.defaultProps = {
  resultsPerPage: 20,
  windowSize: 5,
};
