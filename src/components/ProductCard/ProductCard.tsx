import React, { useState, useRef } from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { useOnAddToCart, useOnProductCardClick } from '../../hooks/callbacks';
import { CnstrcData, IncludeRenderProps, Item, ProductInfoObject } from '../../types';
import ProductSwatch from '../ProductSwatch';
import useProductInfo from '../../hooks/useProduct';
import { concatStyles, getProductCardCnstrcDataAttributes } from '../../utils';
import { EMITTED_EVENTS } from '../../constants';

interface Props {
  /**
   * Constructor's Transformed API Item Object.
   */
  item: Item;
}

/**
 * Props that will be passed to the renderProps function
 */
export interface ProductCardRenderProps extends ProductCardProps {
  /**
   * Function to format the price. Defaults to "$0.00".
   * Set globally at the CioPlp provider level.
   */
  formatPrice: (price: number) => string;
  /**
   * Object containing information about the current product, variation
   */
  productInfo: ProductInfoObject;
  /**
   * Callback to run on add-to-cart event.
   * Set globally at the CioPlp provider level.
   */
  onAddToCart: (
    event: React.MouseEvent,
    item: Item,
    revenue: number,
    selectedVariation: string,
  ) => void;
  /**
   * Callback to run on Product Card Click.
   * Set globally at the CioPlp provider level.
   */
  onClick: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Mouse Enter.
   * Set globally at the CioPlp provider level.
   */
  onMouseEnter: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Mouse Leave.
   * Set globally at the CioPlp provider level.
   */
  onMouseLeave: (event: React.MouseEvent, item: Item) => void;
  /**
   * Boolean to show/hide the rollover image.
   */
  isRolloverImageShown: boolean;
  /**
   * Data Attributes to surface on parent div of product card.
   */
  productCardCnstrcDataAttributes: CnstrcData;
}

export type ProductCardProps = IncludeRenderProps<Props, ProductCardRenderProps>;

/**
 * ProductCard component that has Constructor tracking built-in.
 */
export default function ProductCard(props: ProductCardProps) {
  const [isRolloverImageShown, setIsRolloverImageShown] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { item, children } = props;
  const state = useCioPlpContext();
  const productInfo = useProductInfo({ item });
  const { productSwatch, itemName, itemPrice, itemImageUrl, itemUrl, salePrice, hasSalePrice, rolloverImage } =
    productInfo;

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

  const cnstrcData = getProductCardCnstrcDataAttributes(productInfo);

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
    <>
      {typeof children === 'function' ? (
        children({
          item,
          productInfo,
          formatPrice,
          onAddToCart,
          onClick,
          onMouseEnter,
          onMouseLeave,
          isRolloverImageShown,
          productCardCnstrcDataAttributes: cnstrcData,
        })
      ) : (
        <a
          {...cnstrcData}
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
            className='cio-add-to-cart-button'
            type='button'
            onClick={(e) =>
              onAddToCart(e, item, itemPrice, productSwatch?.selectedVariation?.variationId)
            }>
            Add to Cart
          </button>
        </a>
      )}
    </>
  );
}
