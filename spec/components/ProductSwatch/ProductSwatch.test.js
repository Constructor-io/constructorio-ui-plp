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
  const swatchObject = {
    swatchList: [
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
    ],
    selectedVariation: {
      url: 'abc.com',
      imageUrl: 'abc.img',
      itemName: 'abc',
      variationId: 'abc',
      swatchPreview: '#FFFFFF',
    },
    selectVariation: jest.fn(),
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
