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
import { cnstrcDataAttrs } from '../../../src/utils';

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

  const item = {
    itemName: 'Test Product',
    itemId: 'test-1',
    url: 'https://example.com/product',
    matchedTerms: [],
    isSlotted: false,
    labels: {},
    data: {},
  };

  it('renders a swatch for each variation with swatchPreview', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductSwatch swatchObject={swatchObject} item={item} />
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
        <ProductSwatch swatchObject={mockSwatchObject} item={item} />
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
      item,
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

  it('passes item to render props children', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Render</div>);

    render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ProductSwatch swatchObject={swatchObject} item={item}>
          {mockChildren}
        </ProductSwatch>
      </CioPlp>,
    );

    expect(mockChildren).toHaveBeenCalledWith(expect.objectContaining({ item }));
  });

  describe('View More button', () => {
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

    it('does not render when hasMoreSwatches is false', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObject} item={item} />
        </CioPlp>,
      );

      expect(screen.queryByTestId('cio-swatch-show-more')).not.toBeInTheDocument();
    });

    it('renders when hasMoreSwatches is true', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} item={item} />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toBeInTheDocument();
    });

    it('renders only visible swatches, not hidden ones', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} item={item} />
        </CioPlp>,
      );

      expect(container.getElementsByClassName('cio-swatch-item').length).toBe(2);
    });

    it('displays default label', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch swatchObject={swatchObjectWithMore} item={item} />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toHaveTextContent('View more >');
    });

    it('displays custom string label', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch
            swatchObject={swatchObjectWithMore}
            item={item}
            showMoreLabel='See all colors'
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('cio-swatch-show-more')).toHaveTextContent('See all colors');
    });

    it('displays custom function label using the count of hidden swatches', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <ProductSwatch
            swatchObject={swatchObjectWithMore}
            item={item}
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
          <ProductSwatch swatchObject={swatchObjectWithMore} item={item} />
        </CioPlp>,
      );

      fireEvent.click(screen.getByTestId('cio-swatch-show-more'));
      expect(mockOnShowMore).toHaveBeenCalledTimes(1);
      expect(mockOnShowMore).toHaveBeenCalledWith(
        expect.any(Object),
        item,
        swatchObjectWithMore.selectedVariation,
        hiddenSwatches,
        expect.any(Function),
      );
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
