/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { useOnShowMoreSwatches } from '../../hooks/callbacks';
import { IncludeRenderProps, ProductSwatchObject, SwatchItem } from '../../types';
import { isHexColor, cnstrcDataAttrs } from '../../utils';

export type ProductSwatchRenderProps = ProductSwatchObject;

export type ProductSwatchProps = IncludeRenderProps<
  {
    swatchObject: ProductSwatchObject;
    showMoreLabel?: string | ((count: number) => string);
  },
  ProductSwatchRenderProps
>;

export default function ProductSwatch(props: ProductSwatchProps) {
  const context = useCioPlpContext();
  const { swatchObject, children, showMoreLabel } = props;
  const {
    swatchList,
    selectVariation,
    selectedVariation,
    visibleSwatches,
    hiddenSwatches,
    totalSwatchCount,
    hasMoreSwatches,
  } = swatchObject;
  if (!context) {
    throw new Error('This component is meant to be used within the context of the CioPlpProvider');
  }

  const {
    callbacks: { onSwatchClick, onShowMoreSwatches },
    urlHelpers: { setUrl },
  } = context;

  const showMoreClickHandler = useOnShowMoreSwatches(
    selectedVariation,
    hiddenSwatches ?? [],
    setUrl,
    onShowMoreSwatches,
  );

  const swatchClickHandler = (e: React.MouseEvent, clickedSwatch: SwatchItem) => {
    selectVariation(clickedSwatch);

    if (onSwatchClick) {
      onSwatchClick(e, clickedSwatch);
    }
  };

  const swatchContainerClickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const getShowMoreLabel = () => {
    const hiddenCount = hiddenSwatches?.length ?? 0;
    if (typeof showMoreLabel === 'function') {
      return showMoreLabel(hiddenCount);
    }
    return showMoreLabel ?? `View more >`;
  };

  return (
    <>
      {typeof children === 'function' ? (
        children({
          swatchList,
          selectVariation,
          selectedVariation,
          visibleSwatches,
          hiddenSwatches,
          totalSwatchCount,
          hasMoreSwatches,
        })
      ) : (
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        <div onClick={swatchContainerClickHandler}>
          <ul className='cio-swatch-container'>
            {visibleSwatches?.map((swatch) => {
              const isSelected = selectedVariation?.variationId === swatch.variationId;
              const color = isHexColor(swatch?.swatchPreview)
                ? swatch?.swatchPreview
                : `url(${swatch?.swatchPreview})`;
              const variationIdAttr = {
                [cnstrcDataAttrs.common.variationId]: swatch.variationId,
              };

              return (
                <button
                  type='button'
                  key={swatch.variationId}
                  data-testid={`cio-swatch-${swatch.variationId}`}
                  className='cio-swatch-button cio-swatch-item'
                  onClick={(e) => swatchClickHandler(e, swatch)}
                  style={{
                    background: color,
                  }}
                  {...variationIdAttr}>
                  {isSelected && (
                    <div
                      className='cio-swatch-selected'
                      style={{ outline: `3px solid ${color}` }}
                      {...variationIdAttr}
                    />
                  )}
                </button>
              );
            })}
          </ul>
          {hasMoreSwatches && (
            <button
              type='button'
              data-testid='cio-swatch-show-more'
              className='cio-swatch-show-more'
              onClick={showMoreClickHandler}
              aria-label={getShowMoreLabel()}>
              {getShowMoreLabel()}
            </button>
          )}
        </div>
      )}
    </>
  );
}
