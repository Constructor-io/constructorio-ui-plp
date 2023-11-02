import React from 'react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { usePlpState } from '../../PlpContext';
import useOnAddToCart from '../../hooks/callbacks/useOnAddToCart';
import { getPrice as defaultGetPrice } from '../../utils/getters';
import { formatPrice as defaultFormatPrice } from '../../utils/formatters';
import { Item } from '../../types';

export interface ProductCardProps {
  item: Item;
  cioClient?: ConstructorIO;
  imageSlot?: React.ReactNode;
  contentSlot?: React.ReactNode;
  formatPrice?: (price: number) => string;
  getPrice?: (item: Item) => number;
  onAddToCart?: (event: React.MouseEvent, item: Item) => void;
  onClick?: (event: React.MouseEvent, item: Item) => void;
}

/**
 * ProductCard component for rendering purposes. Does not include ConstructorIO tracking.
 */
export function ProductCardComponent(props: Omit<ProductCardProps, 'cioClient'>) {
  const {
    item,
    imageSlot,
    contentSlot,
    formatPrice = defaultFormatPrice,
    getPrice = defaultGetPrice,
    onAddToCart = () => {},
    onClick = () => {},
  } = props;

  return (
    <a className='cio-product-card' href={item.url} onClick={(e) => onClick(e, item)}>
      {imageSlot || (
        <div className='cio-image-container'>
          <img alt={item.itemName} src={item.imageUrl} className='cio-image' />
        </div>
      )}
      {contentSlot || (
        <div className='cio-content'>
          <div className='cio-item-price'>{formatPrice(getPrice(item))}</div>
          <div className='cio-item-name'>{item.itemName}</div>
          <div className='cio-item-swatches'>Here lie the swatches</div>
          <div>
            <button type='button' onClick={(e) => onAddToCart(e, item)}>
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </a>
  );
}

/**
 * ProductCard component that has ConstructorIO tracking in-built.
 */
export default function ProductCard(props: ProductCardProps) {
  const {
    cioClient,
    formatPrice: localFormatPrice,
    getPrice: localGetPrice,
    onAddToCart: localOnAddToCart,
    onClick: localOnClick,
    ...otherProps
  } = props;

  const state = usePlpState();
  const client = cioClient || state?.cioClient;
  if (!client) {
    throw new Error(
      'CioClient required for click-stream tracking. Use `ProductCardComponent` if you wish to use the component without ConstructorIO tracking (not recommended).',
    );
  }

  const getPrice = localGetPrice || state?.getters.getPrice || defaultGetPrice;
  const formatPrice = localFormatPrice || state?.formatters.formatPrice || defaultFormatPrice;
  const addToCart = useOnAddToCart(
    client,
    getPrice,
    localOnAddToCart || state?.callbacks.onAddToCart || (() => {}),
  );
  const clickHandler = localOnClick || state?.callbacks.onProductCardClick || (() => {});

  return (
    <ProductCardComponent
      getPrice={getPrice}
      formatPrice={formatPrice}
      onAddToCart={addToCart}
      onClick={clickHandler}
      {...otherProps}
    />
  );
}
