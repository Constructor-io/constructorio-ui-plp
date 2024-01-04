import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CioPlpContext } from '../src/PlpContext';
import { DEMO_API_KEY } from '../src/constants';
import ProductCard from '../src/components/ProductCard';
import testItem from './local_examples/item.json';
import { transformResultItem } from '../src/utils/transformers';

describe('ProductCard: React Server-Side Rendering', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('Should throw error if used outside the CioPlpContext', () => {
    expect(() => ReactDOMServer.renderToString(<ProductCard />)).toThrow();
  });

  test("Should throw error if item isn't provided", () => {
    expect(() =>
      ReactDOMServer.renderToString(
        <CioPlpContext apiKey={DEMO_API_KEY}>
          <ProductCard />
        </CioPlpContext>,
      ),
    ).toThrow();
  });

  test('Should render default price formatting if not overridden', () => {
    const html = ReactDOMServer.renderToString(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    expect(html).toContain('$79.00');
  });

  test('Should render custom price formatting if overridden at the PlpContext level', () => {
    const customPriceFormatter = (price) => `USD$${price.toFixed(2)}`;
    const html = ReactDOMServer.renderToString(
      <CioPlpContext apiKey={DEMO_API_KEY} formatters={{ formatPrice: customPriceFormatter }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    expect(html).toContain('USD$79.00');
  });

  test('Should retrieve custom price if overridden at the PlpContext level', () => {
    const customPriceGetter = (item) => item.data.altPrice;
    const html = ReactDOMServer.renderToString(
      <CioPlpContext apiKey={DEMO_API_KEY} getters={{ getPrice: customPriceGetter }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    expect(html).toContain('$69.00');
  });

  test('Should renders custom children correctly', () => {
    const html = ReactDOMServer.renderToString(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItem)}>
          {({ formatPrice, getPrice, item }) => (
            // Custom Rendered Price
            <div>My Rendered Price: {formatPrice(getPrice(item))}</div>
          )}
        </ProductCard>
      </CioPlpContext>,
    );

    // React injects <!-- --> on the server to mark dynamic content for rehydration
    expect(html).toContain('My Rendered Price: <!-- -->$79.00');
  });

  test('Should throw error for invalid item format', () => {
    const invalidItem = {};
    expect(() =>
      ReactDOMServer.renderToString(
        <CioPlpContext apiKey={DEMO_API_KEY}>
          <ProductCard item={invalidItem} />
        </CioPlpContext>,
      ),
    ).toThrow('data, itemId, or itemName are required.');
  });
});
