import React from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import useOnAddToCart from '../../hooks/callbacks/useOnAddToCart';
import useOnProductCardClick from '../../hooks/callbacks/useOnProductCardClick';
import { getPrice as defaultGetPrice } from '../../utils/getters';
import { formatPrice as defaultFormatPrice } from '../../utils/formatters';
import { PropsWithChildrenRenderProps, Item } from '../../types';

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
   * Set globally at the PlpContext level.
   */
  formatPrice: (price: number) => string;
  /**
   * Function to retrieve the price. Defaults to `item.data.price`.
   * Set globally at the PlpContext level.
   */
  getPrice: (item: Item) => number;
  /**
   * Callback to run on add-to-cart event.
   * Set globally at the PlpContext level.
   */
  onAddToCart: (event: React.MouseEvent, item: Item) => void;
  /**
   * Callback to run on Product Card Click.
   * Set globally at the PlpContext level.
   */
  onClick: (event: React.MouseEvent, item: Item) => void;
}

export type ProductCardProps = PropsWithChildrenRenderProps<Props, ProductCardRenderProps>;

/**
 * ProductCard component that has ConstructorIO tracking built-in.
 */
export default function ProductCard(props: ProductCardProps) {
  const { item, children } = props;

  const state = useCioPlpContext();
  if (!state) {
    throw new Error('This component is meant to be used within the CioPlpContext.');
  }

  const client = state.cioClient;
  const getPrice = state.getters.getPrice || defaultGetPrice;
  const formatPrice = state.formatters.formatPrice || defaultFormatPrice;
  const onAddToCart = useOnAddToCart(client, getPrice, state.callbacks.onAddToCart);
  const onClick = useOnProductCardClick(client, state.callbacks.onProductCardClick);

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
