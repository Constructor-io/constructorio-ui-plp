/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import ProductSwatch from '../../../src/components/ProductSwatch';
import UseProductSwatchExample from '../../../src/stories/hooks/UseProductSwatch/UseProductSwatchExample';
import { transformResultItem } from '../../../src/utils/transformers';
import SampleItem from '../../local_examples/item.json';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import { cnstrcDataAttrs, setUrl, setUrlWithPushState } from '../../../src/utils';

describe('Product Swatch Component', () => {
  const swatchList = [
    {
      url: 'abc.com',
      imageUrl: 'abc.img',
      itemName: 'abc',
      variationId: 'abc',
      swatchPreview: '#FFFFFF',
    },
    {
      url: 'def.com',
      imageUrl: 'def.img',
      itemName: 'def',
      variationId: 'def',
      swatchPreview: '#AAAAAA',
    },
  ];

  const swatchObject = {
    swatchList,
    selectedVariation: swatchList[0],
    selectVariation: jest.fn(),
    visibleSwatches: swatchList,
    hiddenSwatches: undefined,
    totalSwatchCount: 2,
    hasMoreSwatches: false,
  };

  const hiddenSwatches = [
    {
      url: 'ghi.com',
      imageUrl: 'ghi.img',
      itemName: 'ghi',
      variationId: 'ghi',
      swatchPreview: '#333333',
    },
  ];

  const swatchObjectWithMore = {
    ...swatchObject,
    visibleSwatches: swatchList,
    hiddenSwatches,
    totalSwatchCount: 3,
    hasMoreSwatches: true,
  };

  it('renders a swatch for each variation with swatchPreview', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductSwatch swatchObject={swatchObject} />
      </CioPlp>,
    );

    expect(container.getElementsByClassName('cio-swatch-item').length).toBe(2);
    expect(container.getElementsByClassName('cio-swatch-selected').length).toBe(1);
  });

  it('calls selectVariation on swatch click', () => {
    const mockSelectVariation = jest.fn();
    const mockSwatchObject = {
      ...swatchObject,
      selectVariation: mockSelectVariation,
    };

    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductSwatch swatchObject={mockSwatchObject} />
      </CioPlp>,
    );

    swatchObject.swatchList.forEach((swatch) => {
      const swatchSelector = `[${cnstrcDataAttrs.common.variationId}=${swatch.variationId}]`;
      fireEvent.click(container?.querySelector(swatchSelector));
      expect(mockSelectVariation).toHaveBeenCalledWith(swatch);
    });
  });

  it('renders with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Render</div>);

    const productSwatchProps = {
      swatchObject,
      children: mockChildren,
    };

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductSwatch {...productSwatchProps} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(screen.getByText('Custom Render')).toBeInTheDocument();
  });

  describe('View More button', () => {
    it('does not render when hasMoreSwatches is false', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObject} />
        </CioPlp>,
      );

      expect(screen.queryByTestId('cio-swatch-show-more')).not.toBeInTheDocument();
    });

    it('renders when hasMoreSwatches is true', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toBeInTheDocument();
    });

    it('renders only visible swatches, not hidden ones', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} />
        </CioPlp>,
      );

      expect(container.getElementsByClassName('cio-swatch-item').length).toBe(2);
    });

    it('displays default label', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toHaveTextContent('View more >');
    });

    it('displays custom string label', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} showMoreLabel='See all colors' />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toHaveTextContent('See all colors');
    });

    it('displays custom function label using number of hidden swatches', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch
            swatchObject={swatchObjectWithMore}
            showMoreLabel={(count) => `+${count} more`}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toHaveTextContent('+1 more');
    });

    it('calls onShowMoreSwatches callback when provided', () => {
      const mockOnShowMore = jest.fn();

      render(
        <CioPlp apiKey={DEMO_API_KEY} callbacks={{ onShowMoreSwatches: mockOnShowMore }}>
          <ProductSwatch swatchObject={swatchObjectWithMore} />
        </CioPlp>,
      );

      fireEvent.click(screen.getByTestId('cio-swatch-show-more'));
      expect(mockOnShowMore).toHaveBeenCalledTimes(1);
      expect(mockOnShowMore).toHaveBeenCalledWith(
        expect.any(Object),
        swatchObjectWithMore.selectedVariation,
        hiddenSwatches,
        expect.any(Function),
      );
    });
  });

  describe('View More navigation', () => {
    const originalLocation = window.location;
    const productUrl = 'https://example.com/product/red';
    const productSwatchObject = {
      ...swatchObjectWithMore,
      selectedVariation: { ...swatchList[0], url: productUrl },
    };
    let pushStateSpy;

    beforeEach(() => {
      delete window.location;
      window.location = {
        href: 'https://example.com/shoes?q=shoes',
        origin: 'https://example.com',
      };
      pushStateSpy = jest.spyOn(window.history, 'pushState');
    });

    afterEach(() => {
      window.location = originalLocation;
      pushStateSpy.mockRestore();
    });

    const clickShowMore = (providerProps) => {
      render(
        <CioPlp apiKey={DEMO_API_KEY} {...providerProps}>
          <ProductSwatch swatchObject={productSwatchObject} />
        </CioPlp>,
      );
      fireEvent.click(screen.getByTestId('cio-swatch-show-more'));
    };

    it('does a full navigation to the swatch url by default', () => {
      clickShowMore({});

      expect(window.location.href).toBe(productUrl);
      expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('does not pushState to the swatch url when enableSpaNavigation is true', () => {
      window.location = originalLocation;
      const sameOriginSwatch = { ...swatchList[0], url: `${originalLocation.origin}/product/red` };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <CioPlp apiKey={DEMO_API_KEY} enableSpaNavigation>
          <ProductSwatch
            swatchObject={{ ...productSwatchObject, selectedVariation: sameOriginSwatch }}
          />
        </CioPlp>,
      );
      fireEvent.click(screen.getByTestId('cio-swatch-show-more'));

      expect(pushStateSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('calls a custom urlHelpers.setUrl with the swatch url', () => {
      const customSetUrl = jest.fn();

      clickShowMore({ urlHelpers: { setUrl: customSetUrl } });

      expect(customSetUrl).toHaveBeenCalledWith(productUrl);
      expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('calls a custom urlHelpers.setUrl over the pushState setUrl when enableSpaNavigation is true', () => {
      const customSetUrl = jest.fn();

      clickShowMore({ enableSpaNavigation: true, urlHelpers: { setUrl: customSetUrl } });

      expect(customSetUrl).toHaveBeenCalledWith(productUrl);
      expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('hands a custom onShowMoreSwatches callback the full-navigation setUrl when enableSpaNavigation is true', () => {
      const onShowMoreSwatches = jest.fn();

      clickShowMore({ enableSpaNavigation: true, callbacks: { onShowMoreSwatches } });

      const callbackSetUrl = onShowMoreSwatches.mock.calls[0][3];
      expect(callbackSetUrl).toBe(setUrl);
      expect(callbackSetUrl).not.toBe(setUrlWithPushState);
    });

    it('hands a custom onShowMoreSwatches callback the custom urlHelpers.setUrl', () => {
      const onShowMoreSwatches = jest.fn();
      const customSetUrl = jest.fn();

      clickShowMore({
        enableSpaNavigation: true,
        urlHelpers: { setUrl: customSetUrl },
        callbacks: { onShowMoreSwatches },
      });

      expect(onShowMoreSwatches.mock.calls[0][3]).toBe(customSetUrl);
    });
  });
});

// Interaction Test
describe('Test user interactions', () => {
  const props = { item: transformResultItem(SampleItem) };

  // Selected variation should change properly when swatch is clicked
  it('selected variation should change when swatch is clicked', () => {
    const { container } = render(<UseProductSwatchExample {...props} />);
    const secondSwatchSelector = `[${cnstrcDataAttrs.common.variationId}=${SampleItem.variations[1].data.variation_id}]`;

    expect(container?.getElementsByClassName('cio-swatch-selected').length).toBe(1);
    expect(
      container?.getElementsByClassName('cio-swatch-selected')[0].dataset?.cnstrcItemVariationId,
    ).toBe(SampleItem?.variations?.[0].data.variation_id);
    fireEvent.click(container?.querySelector(secondSwatchSelector));
    expect(
      container?.getElementsByClassName('cio-swatch-selected')?.[0]?.dataset?.cnstrcItemVariationId,
    ).toBe(SampleItem.variations[1].data.variation_id);
  });
});
