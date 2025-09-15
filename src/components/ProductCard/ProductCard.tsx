import React from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { useOnAddToCart, useOnProductCardClick } from '../../hooks/callbacks';
import ProductSwatch from '../ProductSwatch';
import useProductInfo from '../../hooks/useProduct';
import { concatStyles, getProductCardCnstrcDataAttributes } from '../../utils';
import RenderPropsWrapper from '../RenderPropsWrapper/RenderPropsWrapper';
import { ProductCardProps } from '../../types';

/**
 * ProductCard component that has Constructor tracking built-in.
 */
export default function ProductCard(props: ProductCardProps) {
  const { item, children } = props;
  const state = useCioPlpContext();
  const productInfo = useProductInfo({ item });
  const { productSwatch, itemName, itemPrice, itemImageUrl, itemUrl, salePrice, hasSalePrice } =
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

  return (
    <RenderPropsWrapper
      props={{
        item,
        productInfo,
        formatPrice,
        onAddToCart,
        onClick,
        productCardCnstrcDataAttributes: cnstrcData,
      }}
      override={children}
      htmlOverride={state.renderOverrides.productCard?.renderHtml}
      topLevelAttributes={{ ...cnstrcData, className: 'cio-product-card' }}>
      <a
        {...cnstrcData}
        className='cio-product-card'
        href={itemUrl}
        onClick={(e) => onClick(e, item, productSwatch?.selectedVariation?.variationId)}>
        <div className='cio-image-container'>
          <img alt={itemName} src={itemImageUrl} className='cio-image' />
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
    </RenderPropsWrapper>
  );
}
