import React from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import useOnAddToCart from '../../hooks/callbacks/useOnAddToCart';
import useOnProductCardClick from '../../hooks/callbacks/useOnProductCardClick';
import { getPrice as defaultGetPrice } from '../../utils/getters';
import { formatPrice as defaultFormatPrice } from '../../utils/formatters';
import { IncludeRenderProps, Item } from '../../types';
import ProductSwatch from '../ProductSwatch/ProductSwatch';
import useProductSwatch from '../ProductSwatch/useProductSwatch';

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
   * Function to retrieve the price. Defaults to `item.data.price`.
   * Set globally at the CioPlp provider level.
   */
  getPrice: (item: Item) => number;
  /**
   * Callback to run on add-to-cart event.
   * Set globally at the CioPlp provider level.
   */
  onAddToCart: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Click.
   * Set globally at the CioPlp provider level.
   */
  onClick: (event: React.MouseEvent, item: Item) => void;
}

export type ProductCardProps = IncludeRenderProps<Props, ProductCardRenderProps>;

/**
 * ProductCard component that has ConstructorIO tracking built-in.
 */
export default function ProductCard(props: ProductCardProps) {
  const { item, children } = props;

  const productSwatch = useProductSwatch({ item });
  const state = useCioPlpContext();

  if (!state) {
    throw new Error('This component is meant to be used within the CioPlp provider.');
  }

  if (!item.data || !item.itemId || !item.itemName) {
    throw new Error('data, itemId, or itemName are required.');
  }

  const client = state.cioClient;
  const getPrice = state.getters.getPrice || defaultGetPrice;
  const formatPrice = state.formatters.formatPrice || defaultFormatPrice;
  const onAddToCart = useOnAddToCart(client, getPrice, state.callbacks.onAddToCart);
  const onClick = useOnProductCardClick(client, state.callbacks.onProductCardClick);

  const itemName = productSwatch?.selectedVariation?.itemName || item.itemName;
  const itemPrice =
    formatPrice(productSwatch?.selectedVariation?.price) || formatPrice(getPrice(item));
  const itemImageUrl = productSwatch?.selectedVariation?.imageUrl || item.imageUrl;
  const itemUrl = productSwatch?.selectedVariation?.url || item.url;

  return (
    <>
      {typeof children === 'function' ? (
        children({ item, getPrice, formatPrice, onAddToCart, onClick })
      ) : (
        <a
          className='cio-product-card'
          href={itemUrl}
          onClick={(e) => onClick(e, item, productSwatch?.selectedVariation?.variationId)}>
          <div className='cio-image-container'>
            <img alt={itemName} src={itemImageUrl} className='cio-image' />
          </div>

          <div className='cio-content'>
            <div className='cio-item-price'>{itemPrice}</div>
            <div className='cio-item-name'>{itemName}</div>
            <div className='cio-item-swatches'>Here lie the swatches</div>
            <ProductSwatch swatchObject={productSwatch} />
            <div>
              <button
                type='button'
                onClick={(e) =>
                  onAddToCart(e, item, productSwatch?.selectedVariation?.variationId)
                }>
                Add to Cart
              </button>
            </div>
          </div>
        </a>
      )}
    </>
  );
}
