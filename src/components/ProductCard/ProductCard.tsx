import React from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { useOnAddToCart, useOnProductCardClick } from '../../hooks/callbacks';
import { IncludeRenderProps, Item, ProductInfoObject } from '../../types';
import ProductSwatch from '../ProductSwatch';
import useProductInfo from '../../hooks/useProduct';
import useProductSwatch from '../../hooks/useProductSwatch';

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
}

export type ProductCardProps = IncludeRenderProps<Props, ProductCardRenderProps>;

/**
 * ProductCard component that has Constructor tracking built-in.
 */
export default function ProductCard(props: ProductCardProps) {
  const { item, children } = props;
  const state = useCioPlpContext();
  const productSwatch = useProductSwatch({ item });
  const { selectedVariation } = productSwatch;
  const productInfo = useProductInfo({ item, selectedVariation });
  const { itemName, itemPrice, itemImageUrl, itemUrl } = productInfo;

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

  return (
    <>
      {typeof children === 'function' ? (
        children({
          item,
          productInfo,
          formatPrice,
          onAddToCart,
          onClick,
        })
      ) : (
        <a
          className='cio-product-card'
          href={itemUrl}
          onClick={(e) => onClick(e, item, productSwatch?.selectedVariation?.variationId)}>
          <div className='cio-image-container'>
            <img alt={itemName} src={itemImageUrl} className='cio-image' />
          </div>

          <div className='cio-content'>
            {Number(itemPrice) >= 0 && (
              <div className='cio-item-price'>{formatPrice(itemPrice)}</div>
            )}
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
