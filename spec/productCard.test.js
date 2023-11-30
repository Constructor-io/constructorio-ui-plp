/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard';
import { CioPlpContext } from '../src/PlpContext';
import { DEMO_API_KEY } from '../src/constants';
import testItem from './local_examples/item.json';
import { transformResultItem } from '../src/utils/transformers';

describe('Testing Component: ProductCard', () => {
  test('Should throw error if used outside the CioPlpContext', () => {
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
        <CioPlpContext apiKey={DEMO_API_KEY}>
          <ProductCard />
        </CioPlpContext>,
      ),
    ).toThrow();
    spy.mockRestore();
  });

  test('Should render default price formatting if not overridden', () => {
    render(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    screen.getByText('$79.00');
  });

  test('Should render custom price formatting if overridden at the PlpContext level', () => {
    const contextPriceFormatter = (price) => `USD$${price.toFixed(2)}`;
    render(
      <CioPlpContext apiKey={DEMO_API_KEY} formatters={{ formatPrice: contextPriceFormatter }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    screen.getByText('USD$79.00');
  });

  test('Should retrieve custom price if overridden at the PlpContext level', () => {
    const contextPriceGetter = (item) => item.data.altPrice;
    render(
      <CioPlpContext apiKey={DEMO_API_KEY} getters={{ getPrice: contextPriceGetter }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    screen.getByText('$69.00');
  });

  test('Should run custom onclick handler if overridden at the PlpContext level', () => {
    const contextOnClickHandler = jest.fn();
    render(
      <CioPlpContext
        apiKey={DEMO_API_KEY}
        callbacks={{ onProductCardClick: contextOnClickHandler }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );
    // Click the title
    fireEvent.click(screen.getByText('Jersey Riviera Shirt (Park Bench Dot)'));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(1);

    // Click the image
    fireEvent.click(screen.getByRole('img'));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(2);

    // Click the price
    fireEvent.click(screen.getByText('$79.00'));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(3);

    // Click the ATC Button should not trigger the handler
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(3);
  });

  test('Should run custom onAddToCart handler if overridden at the PlpContext level', () => {
    const contextOnAddToCart = jest.fn();
    render(
      <CioPlpContext apiKey={DEMO_API_KEY} callbacks={{ onAddToCart: contextOnAddToCart }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlpContext>,
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(contextOnAddToCart).toHaveBeenCalledTimes(1);
  });

  test('Should render renderProps argument', () => {
    render(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <ProductCard item={transformResultItem(testItem)}>
          {(props) => (
            // Custom Rendered Price
            <div>My Rendered Price: {props.formatPrice(props.getPrice(props.item))}</div>
          )}
        </ProductCard>
      </CioPlpContext>,
    );

    screen.getByText('My Rendered Price: $79.00');
  });
});
