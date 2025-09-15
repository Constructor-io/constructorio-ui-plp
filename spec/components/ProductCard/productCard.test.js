/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductCard from '../../../src/components/ProductCard';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import testItem from '../../local_examples/item.json';
import testItemWithSalePrice from '../../local_examples/itemWithSalePrice.json';
import { transformResultItem } from '../../../src/utils/transformers';
import { copyItemWithNewSalePrice } from '../../test-utils';
import mockApiSearchResponse from '../../local_examples/apiSearchResponse.json';

const originalWindowLocation = window.location;

jest.mock('@constructor-io/constructorio-client-javascript/lib/modules/search.js', () => {
  const Search = class {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
    constructor() {}

    getSearchResults = jest.fn().mockImplementation(() => mockApiSearchResponse);
  };

  return Search;
});

describe('Testing Component: ProductCard', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com?q=red'),
    });

    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });

    jest.resetAllMocks();
  });

  test('Should throw error if used outside the CioPlp', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => render(<ProductCard />)).toThrow();
    spy.mockRestore();
  });

  test("Should throw error if item isn't provided", () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() =>
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductCard />
        </CioPlp>,
      ),
    ).toThrow();
    spy.mockRestore();
  });

  test('Should render default price formatting if not overridden', () => {
    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlp>,
    );
    screen.getByText('$90.00');
  });

  test('Should render custom price formatting if overridden at the CioPlp provider level', () => {
    const contextPriceFormatter = (price) => `USD$${price.toFixed(2)}`;
    render(
      <CioPlp apiKey={DEMO_API_KEY} formatters={{ formatPrice: contextPriceFormatter }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlp>,
    );
    screen.getByText('USD$90.00');
  });

  test('Should retrieve custom price if overridden at the CioPlp provider level', () => {
    const contextPriceGetter = (item) => item.data.altPrice;
    render(
      <CioPlp apiKey={DEMO_API_KEY} itemFieldGetters={{ getPrice: contextPriceGetter }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlp>,
    );
    screen.getByText('$69.00');
  });

  test('Should run custom onclick handler if overridden at the CioPlp provider level', () => {
    const contextOnClickHandler = jest.fn();
    render(
      <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onProductCardClick: contextOnClickHandler }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlp>,
    );
    // Click the title
    fireEvent.click(screen.getByText('Jersey Riviera Shirt (Red Park Bench Dot)'));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(1);

    // Click the image
    fireEvent.click(screen.getByRole('img'));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(2);

    // Click the price
    fireEvent.click(screen.getByText('$90.00'));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(3);

    // Click the ATC Button should not trigger the handler
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(3);
  });

  test('Should run custom onAddToCart handler if overridden at the CioPlp provider level', () => {
    const contextOnAddToCart = jest.fn();
    render(
      <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onAddToCart: contextOnAddToCart }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnAddToCart).toHaveBeenCalledTimes(1);
  });

  test('Should pass the expected props to the custom onAddToCart handler if defined', () => {
    const contextOnAddToCart = jest.fn();
    const item = transformResultItem(testItem);
    const testSelectedVariation = item.variations[0];

    render(
      <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onAddToCart: contextOnAddToCart }}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnAddToCart).toHaveBeenCalledTimes(1);
    expect(contextOnAddToCart).toHaveBeenCalledWith(
      expect.any(Object), // Event
      expect.objectContaining(item),
      expect.objectContaining(testSelectedVariation),
    );
  });

  test('Should pass expected props, including the updated selectedVariation when a swatch has been selected, to the custom onAddToCart handler if defined', () => {
    const contextOnAddToCart = jest.fn();
    const item = transformResultItem(testItem);
    const testSelectedVariation = item.variations[1];

    render(
      <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onAddToCart: contextOnAddToCart }}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByTestId(`cio-swatch-${testSelectedVariation.variationId}`));
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnAddToCart).toHaveBeenCalledTimes(1);
    expect(contextOnAddToCart).toHaveBeenCalledWith(
      expect.any(Object), // Event
      expect.objectContaining(item),
      expect.objectContaining(testSelectedVariation),
    );
  });

  test('Should not throw an error when calling the custom onAddToCart handler if no variations exist', () => {
    const contextOnAddToCart = jest.fn();
    const { variations, variationId, ...item } = transformResultItem(testItem);

    render(
      <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onAddToCart: contextOnAddToCart }}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnAddToCart).toHaveBeenCalledTimes(1);
    expect(contextOnAddToCart).toHaveBeenCalledWith(
      expect.any(Object), // Event
      expect.objectContaining(item),
      undefined,
    );
  });

  test('Should render renderProps argument', () => {
    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItem)}>
          {(props) => (
            // Custom Rendered Price
            <div>My Rendered Price: {props.formatPrice(props.productInfo.itemPrice)}</div>
          )}
        </ProductCard>
      </CioPlp>,
    );

    screen.getByText('My Rendered Price: $90.00');
  });

  test('Should render the custom html render function if provided at the CioPlp level', async () => {
    const renderOverrides = {
      productCard: {
        renderHtml: ({ productInfo, item }) => {
          const itemId = document.createElement('div');
          itemId.textContent = productInfo.itemId;
          itemId.classList.add('cio-item-name');

          const itemDescription = document.createElement('div');
          itemDescription.textContent = item.description;

          const itemContainer = document.createElement('div');
          itemContainer.appendChild(itemId);
          itemContainer.appendChild(itemDescription);

          return itemContainer;
        },
      },
    };

    render(<CioPlp apiKey={DEMO_API_KEY} renderOverrides={renderOverrides} />);

    await waitFor(() => {
      expect(screen.getByText(mockApiSearchResponse.response.results[0].data.id));
      expect(screen.getByText(mockApiSearchResponse.response.results[0].data.description));
    });
  });

  test('Should prefer render props over top-level custom html render function', () => {
    const renderOverrides = {
      productCard: {
        renderHtml: ({ productInfo }) => {
          const itemName = document.createElement('div');
          itemName.textContent = productInfo.itemName;
          itemName.classList.add('cio-item-name');

          return itemName;
        },
      },
    };

    render(
      <CioPlp apiKey={DEMO_API_KEY} renderOverrides={renderOverrides}>
        <ProductCard item={transformResultItem(testItem)}>
          {(props) => (
            // Custom Rendered Price
            <div>My Rendered Price: {props.formatPrice(props.productInfo.itemPrice)}</div>
          )}
        </ProductCard>
      </CioPlp>,
    );

    screen.getByText('My Rendered Price: $90.00');
  });

  test('Should render sale price when salePrice is present and valid', () => {
    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItemWithSalePrice)} />
      </CioPlp>,
    );

    screen.getByText('$21.00');
  });

  test('Should not render sale price when salePrice is undefined', () => {
    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard
          item={transformResultItem(copyItemWithNewSalePrice(testItemWithSalePrice, undefined))}
        />
      </CioPlp>,
    );

    expect(screen.queryByTestId('cio-sale-price')).toBeNull();
  });
});
