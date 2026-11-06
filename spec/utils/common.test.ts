import { isValidSalePrice, slugify } from '../../src/utils/common';

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
    // @ts-expect-error: testing runtime null behaviour
    expect(isValidSalePrice(salePrice, usualPrice)).toBe(expected);
  });
});

describe('slugify', () => {
  it.each([
    { value: 'Black', expected: 'black', desc: 'lowercases a plain value' },
    { value: 'Shirts & Blouses', expected: 'shirts-blouses', desc: 'collapses separators' },
    { value: '"4"-"inf"', expected: '4-inf', desc: 'strips quotes from a range value' },
    { value: '  Kids & Baby  ', expected: 'kids-baby', desc: 'trims leading/trailing separators' },
    { value: 'Black / Navy', expected: 'black-navy', desc: 'handles slashes' },
    { value: 'T-Shirts', expected: 't-shirts', desc: 'keeps single hyphens' },
    { value: 'Rouge Écarlate', expected: 'rouge-écarlate', desc: 'keeps non-ASCII letters' },
    { value: '赤 / 青', expected: '赤-青', desc: 'keeps non-Latin scripts' },
    { value: '+', expected: '', desc: 'returns empty when nothing usable is left' },
  ])('$desc', ({ value, expected }) => {
    expect(slugify(value)).toBe(expected);
  });

  it('Should never produce a value that breaks an id or aria-controls', () => {
    ['Shirts & Blouses', '"4"-"inf"', 'Black / Navy', '  spaced  out  '].forEach((value) => {
      const slug = slugify(value);

      expect(slug).not.toMatch(/\s/);
      expect(slug).not.toMatch(/["'/]/);
    });
  });
});
