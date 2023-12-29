import React from 'react';
import { ProductSwatchObject, SwatchItem } from '../../types';
import './ProductSwatch.css';

type ProductSwatchProps = {
  swatchObject: ProductSwatchObject;
};

// Todo:
//   Pagination component should get PaginationProps from context and accept configuration props same as usePagination
export default function ProductSwatch(props: ProductSwatchProps) {
  const { swatchObject } = props;
  const { swatchList, selectVariation, selectedVariation } = swatchObject;

  const swatchClickHandler = (clickedSwatch: SwatchItem) => {
    selectVariation(clickedSwatch);
  };

  console.log(selectedVariation);
  return (
    <div>
      <ul>
        {swatchList?.map((swatch) => (
          <li
            className={
              selectedVariation?.variationId === swatch.variationId ? 'cio-swatch-selected' : ''
            }>
            <button
              className='cio-swatch-button'
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
