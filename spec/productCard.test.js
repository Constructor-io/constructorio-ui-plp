/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard';
import CioPlp from '../src/components/CioPlp';
import { DEMO_API_KEY } from '../src/constants';
import testItem from './local_examples/item.json';
import { transformResultItem } from '../src/utils/transformers';

describe('Testing Component: ProductCard', () => {
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
    fireEvent.click(screen.getByRole('button', { name: /add to basket/i }));
    expect(contextOnClickHandler).toHaveBeenCalledTimes(3);
  });

  test('Should run custom onAddToCart handler if overridden at the CioPlp provider level', () => {
    const contextOnAddToCart = jest.fn();
    render(
      <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onAddToCart: contextOnAddToCart }}>
        <ProductCard item={transformResultItem(testItem)} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByRole('button', { name: /add to basket/i }));
    expect(contextOnAddToCart).toHaveBeenCalledTimes(1);
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
});
