// eslint-disable-next-line import/prefer-default-export
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
