// eslint-disable-next-line import/prefer-default-export
export function formatPrice(price?: number): string {
  if (price) {
    return `$${price.toFixed(2)}`;
  }

  return '';
}
