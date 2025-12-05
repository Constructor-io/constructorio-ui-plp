import type { Callbacks, UrlHelpers, Item, Variation } from '../types';

export interface ShopifyDefaults {
  urlHelpers: Pick<UrlHelpers, 'setUrl'>;
  callbacks: Pick<Callbacks, 'onAddToCart' | 'onProductCardClick'>;
}

// eslint-disable-next-line import/prefer-default-export
export function getShopifyDefaults(): ShopifyDefaults {
  return {
    urlHelpers: {
      setUrl(url: string) {
        const modifiedUrl = url.replace('/group_id', '/collections');

        if (typeof window !== 'undefined') {
          window.location.href = modifiedUrl;
        }
      },
    },
    callbacks: {
      onAddToCart(_event: React.MouseEvent, item: Item, selectedVariation?: Variation) {
        // eslint-disable-next-line no-underscore-dangle
        const shopifyId = item.data?.__shopify_id || selectedVariation?.variationId || item.itemId;

        if (typeof window !== 'undefined') {
          fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: shopifyId,
              quantity: 1,
            }),
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Failed to add item to cart:', error);
          });
        }
      },
      onProductCardClick(_event: React.MouseEvent, item: Item) {
        if (typeof window !== 'undefined') {
          const url = new URL(`/products/${item.itemId}`, window.location.origin);

          window.location.href = url.href;
        }
      },
    },
  };
}
