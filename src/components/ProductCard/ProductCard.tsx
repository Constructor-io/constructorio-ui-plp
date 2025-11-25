import React, { useState, useRef } from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { useOnAddToCart, useOnProductCardClick } from '../../hooks/callbacks';
import ProductSwatch from '../ProductSwatch';
import useProductInfo from '../../hooks/useProduct';
import {
  concatStyles,
  getProductCardCnstrcDataAttributes,
  getConversionButtonCnstrcDataAttributes,
} from '../../utils';
import RenderPropsWrapper from '../RenderPropsWrapper/RenderPropsWrapper';
import { ProductCardProps } from '../../types';
import { EMITTED_EVENTS } from '../../constants';

/**
 * ProductCard component that has Constructor tracking built-in.
 */
export default function ProductCard(props: ProductCardProps) {
  const [isRolloverImageShown, setIsRolloverImageShown] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { item, children } = props;
  const state = useCioPlpContext();
  const productInfo = useProductInfo({ item });
  const {
    productSwatch,
    itemName,
    itemPrice,
    itemImageUrl,
    itemUrl,
    salePrice,
    hasSalePrice,
    rolloverImage,
  } = productInfo;

  if (!state) {
    throw new Error('This component is meant to be used within the CioPlp provider.');
  }

  if (!item.data || !item.itemId || !item.itemName) {
    throw new Error('data, itemId, or itemName are required.');
  }

  const client = state.cioClient;
  const onAddToCart = useOnAddToCart(client, state.callbacks.onAddToCart);
  const { formatPrice } = state.formatters;
  const onClick = useOnProductCardClick(client, state.callbacks.onProductCardClick);

  const cnstrcDataAttributes = getProductCardCnstrcDataAttributes(productInfo, {
    labels: item.labels,
  });
  const addToCartBtnAttrs = getConversionButtonCnstrcDataAttributes('add_to_cart');

  const handleRolloverImageState = (isShown: boolean) => {
    setIsRolloverImageShown(isShown);
    if (isShown && rolloverImage) {
      const event = new CustomEvent(EMITTED_EVENTS.PRODUCT_CARD_IMAGE_ROLLOVER, {
        detail: { item },
        bubbles: true,
      });
      cardRef.current?.dispatchEvent(event);
    }
  };

  const onMouseEnter = (event: React.MouseEvent) => {
    if (state.callbacks.onProductCardMouseEnter) {
      state.callbacks.onProductCardMouseEnter(event, item);
    }
    handleRolloverImageState(true);
  };

  const onMouseLeave = (event: React.MouseEvent) => {
    if (state.callbacks.onProductCardMouseLeave) {
      state.callbacks.onProductCardMouseLeave(event, item);
    }
    handleRolloverImageState(false);
  };

  return (
    <RenderPropsWrapper
      props={{
        item,
        productInfo,
        formatPrice,
        onAddToCart,
        onClick,
        onMouseEnter,
        onMouseLeave,
        isRolloverImageShown,
        productCardCnstrcDataAttributes: cnstrcDataAttributes,
      }}
      override={children}
      htmlOverride={state.renderOverrides.productCard?.renderHtml}
      topLevelAttributes={{ ...cnstrcDataAttributes, className: 'cio-product-card' }}>
      <a
        {...cnstrcDataAttributes}
        className='cio-product-card'
        href={itemUrl}
        ref={cardRef}
        onClick={(e) => onClick(e, item, productSwatch?.selectedVariation?.variationId)}>
        <div
          className='cio-image-container'
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}>
          <img alt={itemName} src={itemImageUrl} className='cio-image' />
          {rolloverImage && (
            <img
              alt={`${itemName} rollover`}
              src={rolloverImage}
              loading='lazy'
              className={concatStyles(
                'cio-image cio-rollover-image',
                isRolloverImageShown && 'is-active',
              )}
            />
          )}
        </div>

        <div className='cio-content'>
          <div className='cio-item-prices-container'>
            {hasSalePrice && (
              <div className='cio-item-price' id='cio-sale-price'>
                {formatPrice(salePrice)}
              </div>
            )}
            {Number(itemPrice) >= 0 && (
              <div
                className={concatStyles(
                  'cio-item-price',
                  hasSalePrice && 'cio-item-price-strikethrough',
                )}>
                {formatPrice(itemPrice)}
              </div>
            )}
          </div>
          <div className='cio-item-name'>{itemName}</div>
          {productSwatch && <ProductSwatch swatchObject={productSwatch} />}
        </div>
        <button
          {...addToCartBtnAttrs}
          className='cio-add-to-cart-button'
          type='button'
          onClick={(e) =>
            onAddToCart(e, item, itemPrice, productSwatch?.selectedVariation?.variationId)
          }>
          Add to Cart
        </button>
      </a>
    </RenderPropsWrapper>
  );
}
