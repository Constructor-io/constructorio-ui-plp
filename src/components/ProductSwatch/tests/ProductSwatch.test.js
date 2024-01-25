/* eslint-disable @cspell/spellchecker */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import ProductSwatch from '../ProductSwatch';
import UseProductSwatchExample from '../Stories/Hooks/UseProductSwatchExample';
import { transformResultItem } from '../../../utils/transformers';
import SampleItem from '../../../../spec/local_examples/item.json';

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
    const { container } = render(<ProductSwatch swatchObject={swatchObject} />);

    expect(container.getElementsByClassName('cio-swatch-item').length).toBe(2);
    expect(container.getElementsByClassName('cio-swatch-selected').length).toBe(1);
  });

  it('calls selectVariation on swatch click', () => {
    const mockSelectVariation = jest.fn();
    const mockSwatchObject = {
      ...swatchObject,
      selectVariation: mockSelectVariation,
    };

    const { container } = render(<ProductSwatch swatchObject={mockSwatchObject} />);

    swatchObject.swatchList.forEach((swatch) => {
      fireEvent.click(container?.querySelector(`[data-cnstrc-variation-id=${swatch.variationId}]`));
      expect(mockSelectVariation).toHaveBeenCalledWith(swatch);
    });
  });

  it('renders with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Render</div>);

    const productSwatchProps = {
      swatchObject,
      children: mockChildren,
    };

    render(<ProductSwatch {...productSwatchProps} />);
    expect(mockChildren).toHaveBeenCalled();
    expect(screen.getByText('Custom Render')).toBeInTheDocument();
  });
});

// Integration Test
describe('Test user interactions', () => {
  const props = { item: transformResultItem(SampleItem) };

  // Selected variation should change properly when swatch is clicked
  it('selected variation should change when swatch is clicked', () => {
    const { container } = render(<UseProductSwatchExample {...props} />);

    expect(container?.getElementsByClassName('cio-swatch-selected').length).toBe(1);
    expect(
      container?.getElementsByClassName('cio-swatch-selected')[0].dataset?.cnstrcVariationId,
    ).toBe(SampleItem?.variations?.[0].data.variation_id);
    fireEvent.click(
      container?.querySelector(
        `[data-cnstrc-variation-id=${SampleItem.variations[1].data.variation_id}]`,
      ),
    );
    expect(
      container?.getElementsByClassName('cio-swatch-selected')?.[0]?.dataset?.cnstrcVariationId,
    ).toBe(SampleItem.variations[1].data.variation_id);
  });
});
