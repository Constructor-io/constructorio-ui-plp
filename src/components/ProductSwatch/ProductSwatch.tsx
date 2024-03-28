/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
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
  const context = useCioPlpContext();
  const { swatchObject, children } = props;
  const { swatchList, selectVariation, selectedVariation } = swatchObject;
  if (!context) {
    throw new Error('This component is meant to be used within the context of the CioPlpProvider');
  }

  const {
    callbacks: { onSwatchClick },
  } = context;

  const swatchClickHandler = (e: React.MouseEvent, clickedSwatch: SwatchItem) => {
    selectVariation(clickedSwatch);

    if (onSwatchClick) {
      onSwatchClick(e, clickedSwatch);
    }
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
              <button
                type='button'
                key={swatch.variationId}
                data-cnstrc-variation-id={swatch.variationId}
                className={`cio-swatch-button cio-swatch-item ${
                  selectedVariation?.variationId === swatch.variationId ? 'cio-swatch-selected' : ''
                }`}
                onClick={(e) => swatchClickHandler(e, swatch)}
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