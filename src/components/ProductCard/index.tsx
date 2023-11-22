import React from 'react';
import { usePlpState } from '../../PlpContext';
import useOnAddToCart from '../../hooks/callbacks/useOnAddToCart';
import { getPrice as defaultGetPrice } from '../../utils/getters';
import { formatPrice as defaultFormatPrice } from '../../utils/formatters';
import { IncludeRenderProps, Item } from '../../types';

export interface ProductCardProps {
  item: Item;
}
/**
 * Props that will be passed to the renderProps function
 */
export interface ProductCardDerivedProps extends ProductCardProps {
  formatPrice: (price: number) => string;
  getPrice: (item: Item) => number;
  onAddToCart: (event: React.MouseEvent, item: Item) => void;
  onClick: (event: React.MouseEvent, item: Item) => void;
}

/**
 * ProductCard component that has ConstructorIO tracking in-built.
 */
export default function ProductCard(
  props: IncludeRenderProps<ProductCardProps, ProductCardDerivedProps>,
) {
  const { item, children } = props;

  const state = usePlpState();
  if (!state) {
    throw new Error('This component is meant to be used within the CioPlpContextProvider.');
  }

  const client = state?.cioClient;
  const getPrice = state?.getters.getPrice || defaultGetPrice;
  const formatPrice = state?.formatters.formatPrice || defaultFormatPrice;
  const onAddToCart = useOnAddToCart(client, getPrice, state?.callbacks.onAddToCart);
  const onClick = state?.callbacks.onProductCardClick || (() => {});

  return (
    <>
      {typeof children === 'function' ? (
        children({ item, getPrice, formatPrice, onAddToCart, onClick })
      ) : (
        <a className='cio-product-card' href={item.url} onClick={(e) => onClick(e, item)}>
          <div className='cio-image-container'>
            <img alt={item.itemName} src={item.imageUrl} className='cio-image' />
          </div>

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
        </a>
      )}
    </>
  );
}
