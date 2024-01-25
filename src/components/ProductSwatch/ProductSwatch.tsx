/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { IncludeRenderProps, ProductSwatchObject, SwatchItem } from '../../types';
import { isHexColor } from '../../utils';
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
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={swatch.variationId}
                data-cnstrc-variation-id={swatch.variationId}
                className={`cio-swatch-item ${
                  selectedVariation?.variationId === swatch.variationId ? 'cio-swatch-selected' : ''
                }`}
                onClick={() => swatchClickHandler(swatch)}
                style={{
                  background: isHexColor(swatch?.swatchPreview)
                    ? swatch?.swatchPreview
                    : `url(${swatch?.swatchPreview})`,
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
