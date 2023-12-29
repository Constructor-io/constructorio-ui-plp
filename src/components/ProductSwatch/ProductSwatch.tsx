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
      <ul className='cio-swatch-container'>
        {swatchList?.map((swatch) => (
          <li
            key={swatch.variationId}
            className={`cio-swatch-item ${
              selectedVariation?.variationId === swatch.variationId ? 'cio-swatch-selected' : ''
            }`}
            onClick={() => swatchClickHandler(swatch)}
            style={{ background: swatch?.previewHexCode }}
          />
        ))}
      </ul>
    </div>
  );
}
