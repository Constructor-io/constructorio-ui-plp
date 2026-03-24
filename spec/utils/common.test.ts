import { isValidSalePrice } from '../../src/utils/common';

describe('isValidSalePrice', () => {
  it.each([
    { salePrice: 10, usualPrice: 90, expected: true, desc: 'salePrice less than usualPrice' },
    { salePrice: 0, usualPrice: 90, expected: true, desc: 'zero salePrice with positive usualPrice' },
    { salePrice: 0, usualPrice: 0, expected: false, desc: 'both salePrice and usualPrice are zero' },
    { salePrice: 90, usualPrice: 90, expected: false, desc: 'salePrice equal to usualPrice' },
    { salePrice: 100, usualPrice: 90, expected: false, desc: 'salePrice greater than usualPrice' },
    { salePrice: -5, usualPrice: 90, expected: false, desc: 'negative salePrice' },
    { salePrice: undefined, usualPrice: 90, expected: false, desc: 'undefined salePrice' },
    { salePrice: 10, usualPrice: undefined, expected: false, desc: 'undefined usualPrice' },
    { salePrice: undefined, usualPrice: undefined, expected: false, desc: 'both undefined' },
    { salePrice: null, usualPrice: 90, expected: false, desc: 'null salePrice' },
    { salePrice: 10, usualPrice: null, expected: false, desc: 'null usualPrice' },
  ])('returns $expected when $desc', ({ salePrice, usualPrice, expected }) => {
    // here are "any" assertions because we have similar in codebase
    expect(isValidSalePrice(salePrice as any, usualPrice as any)).toBe(expected);
  });
});
