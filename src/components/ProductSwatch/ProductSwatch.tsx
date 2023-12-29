import React from 'react';
import { IncludeRenderProps, ProductSwatchObject, SwatchItem } from '../../types';
import './ProductSwatch.css';

type ProductSwatchProps = IncludeRenderProps<
  {
    swatchObject: ProductSwatchObject;
  },
  ProductSwatchObject
>;

export default function ProductSwatch(props: ProductSwatchProps) {
  const { swatchObject, children } = props;
  const { swatchList, selectVariation, selectedVariation } = swatchObject;

  const swatchClickHandler = (clickedSwatch: SwatchItem) => {
    selectVariation(clickedSwatch);
  };

  return (
    <>
      {typeof children === 'function' ? (
        children({
          swatchList,
          selectVariation,
          selectedVariation,
        })
      ) : (
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
      )}
    </>
  );
}
