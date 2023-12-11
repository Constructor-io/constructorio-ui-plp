import React from 'react';

// Todo:
//   Pagination component should get PaginationProps from context and accept configuration props same as usePagination
export default function ProductSwatch({ swatch }) {
  const { swatchList, selectVariation, selectedVariation } = swatch;

  const swatchClickHandler = (clickedSwatch) => {
    selectVariation(clickedSwatch);
  };

  console.log(swatchList);
  return (
    <div>
      <ul>
        {swatchList?.map((swatch) => (
          <li
            className={
              selectedVariation?.variationId === swatch.variationId ? 'cio-swatch-selected' : ''
            }>
            <button
              type='button'
              onClick={() => swatchClickHandler(swatch)}
              style={{ color: swatch?.previewHexCode }}>
              {swatch.variationId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
