/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../../src/components/ProductCard';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import testItem from '../../local_examples/item.json';
import testItemWithRolloverImages from '../../local_examples/itemWithRolloverImages.json';
import { transformResultItem } from '../../../src/utils/transformers';

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
    fireEvent.click(screen.getByAltText('Jersey Riviera Shirt (Red Park Bench Dot)'));
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

  test('it should show the rollover image when the mouse hovers over the image', () => {
    const item = transformResultItem(testItemWithRolloverImages);
    const selectedVariation = item.variations[0];

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    const itemName = selectedVariation.itemName || item.itemName;
    const rolloverImageEl = screen.getByAltText(`${itemName} rollover`);
    fireEvent.mouseEnter(rolloverImageEl);
    expect(rolloverImageEl.src).toEqual(selectedVariation.data.rolloverImage);
    expect(rolloverImageEl.classList.contains('is-active')).toBe(true);
    fireEvent.mouseLeave(rolloverImageEl);
    expect(rolloverImageEl.classList.contains('is-active')).toBe(false);
  });

  test('it should change the rollover image if the selected variation changes', () => {
    const item = transformResultItem(testItemWithRolloverImages);
    const secondVariation = item.variations[1];

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByTestId(`cio-swatch-${secondVariation.variationId}`));
    const itemName = secondVariation.itemName || item.itemName;
    const rolloverImageEl = screen.getByAltText(`${itemName} rollover`);
    fireEvent.mouseEnter(rolloverImageEl);
    expect(rolloverImageEl.src).toEqual(secondVariation.data.rolloverImage);
    expect(rolloverImageEl.classList.contains('is-active')).toBe(true);
    fireEvent.mouseLeave(rolloverImageEl);
    expect(rolloverImageEl.classList.contains('is-active')).toBe(false);
  });

  test('it should fallback to the item rollover image if all variations don\'t have a rollover image', () => {
    const clonedItemWithRolloverImages = JSON.parse(JSON.stringify(testItemWithRolloverImages));
    clonedItemWithRolloverImages.data.rolloverImage = clonedItemWithRolloverImages.variations[0].data.rolloverImage;
    clonedItemWithRolloverImages.variations.forEach((variation) => {
      variation.data.rolloverImage = null;
    });
    const item = transformResultItem(clonedItemWithRolloverImages);
    const thirdVariation = item.variations[3];

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByTestId(`cio-swatch-${thirdVariation.variationId}`));
    const itemName = thirdVariation.itemName || item.itemName;
    const rolloverImageEl = screen.getByAltText(`${itemName} rollover`);
    fireEvent.mouseEnter(rolloverImageEl);
    expect(rolloverImageEl.src).toEqual(item.data.rolloverImage);
    expect(rolloverImageEl.classList.contains('is-active')).toBe(true);
    fireEvent.mouseLeave(rolloverImageEl);
    expect(rolloverImageEl.classList.contains('is-active')).toBe(false);
  });

  test('it should not fallback to the item rollover image if some variations have a rollover image', () => {
    const clonedItemWithRolloverImages = JSON.parse(JSON.stringify(testItemWithRolloverImages));
    clonedItemWithRolloverImages.data.rolloverImage = clonedItemWithRolloverImages.variations[0].data.rolloverImage;
    const item = transformResultItem(clonedItemWithRolloverImages);
    const thirdVariation = item.variations[3];

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.click(screen.getByTestId(`cio-swatch-${thirdVariation.variationId}`));
    const itemName = thirdVariation.itemName || item.itemName;
    const rolloverImageEl = screen.queryByAltText(`${itemName} rollover`);
    expect(rolloverImageEl).toBeNull();
  });

  test('it should pass the correct props to the mouse events callbacks if they are defined', () => {
    const item = transformResultItem(testItemWithRolloverImages);
    const selectedVariation = item.variations[0];
    const mouseEnterFn = jest.fn();
    const mouseLeaveFn = jest.fn();

    render(
      <CioPlp apiKey={DEMO_API_KEY}
        callbacks={{
          onProductCardMouseEnter: mouseEnterFn,
          onProductCardMouseLeave: mouseLeaveFn
        }}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    const itemName = selectedVariation.itemName || item.itemName;
    const rolloverImageEl = screen.getByAltText(`${itemName} rollover`);
    fireEvent.mouseEnter(rolloverImageEl);
    expect(mouseEnterFn).toHaveBeenCalledWith(expect.any(Object), item);
    fireEvent.mouseLeave(rolloverImageEl);
    expect(mouseLeaveFn).toHaveBeenCalledWith(expect.any(Object), item);
  });

  test.only('should dispatch the "cio.ui-plp.productCardImageRollover" event when the rollover image is shown', () => {
    const item = transformResultItem(testItemWithRolloverImages);
    const selectedVariation = item.variations[0];
    const dispatchEvent = jest.spyOn(document, 'dispatchEvent');

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductCard item={item} />
      </CioPlp>,
    );

    fireEvent.mouseEnter(screen.getByAltText(`${selectedVariation.itemName} rollover`));
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({
      type: 'cio.ui-plp.productCardImageRollover',
      detail: expect.objectContaining({
        item,
      }),
    }));
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
});
