import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DEMO_API_KEY } from '../../../constants';
import CioPlp from '../../../components/CioPlp';
import ProductSwatch from '../../../components/ProductSwatch';
import KitchenSinkDecorator from '../../utils/KitchenSinkDecorator';
import { SwatchItem } from '../../../types';
import '../../../styles.css';

const sampleSwatches: SwatchItem[] = [
  {
    url: 'https://example.com/product/white',
    imageUrl: 'abc.img',
    itemName: 'White',
    variationId: 'white',
    swatchPreview: '#FFFFFF',
  },
  {
    url: 'https://example.com/product/grey',
    imageUrl: 'def.img',
    itemName: 'Grey',
    variationId: 'grey',
    swatchPreview: '#AAAAAA',
  },
  {
    url: 'https://example.com/product/red',
    imageUrl: 'ghi.img',
    itemName: 'Red',
    variationId: 'red',
    swatchPreview: '#e04062',
  },
  {
    url: 'https://example.com/product/green',
    imageUrl: 'jkl.img',
    itemName: 'Green',
    variationId: 'green',
    swatchPreview: '#a3c43b',
  },
  {
    url: 'https://example.com/product/dark-green',
    imageUrl: 'mno.img',
    itemName: 'Dark Green',
    variationId: 'dark-green',
    swatchPreview: '#253d37',
  },
  {
    url: 'https://example.com/product/silver',
    imageUrl: 'pqr.img',
    itemName: 'Silver',
    variationId: 'silver',
    swatchPreview: '#bfc1bc',
  },
];

const meta = {
  title: 'Components/ProductSwatch',
  component: ProductSwatch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProductSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => (
    <CioPlp apiKey={DEMO_API_KEY}>
      <ProductSwatch {...args} />
    </CioPlp>
  ),
  args: {
    swatchObject: {
      swatchList: sampleSwatches.slice(0, 2),
      visibleSwatches: sampleSwatches.slice(0, 2),
      hiddenSwatches: undefined,
      totalSwatchCount: 2,
      hasMoreSwatches: false,
      selectedVariation: sampleSwatches[0],
      selectVariation: () => {},
    },
  },
};

export const WithViewMore: Story = {
  render: (args) => (
    <CioPlp apiKey={DEMO_API_KEY}>
      <ProductSwatch {...args} />
    </CioPlp>
  ),
  args: {
    swatchObject: {
      swatchList: sampleSwatches,
      visibleSwatches: sampleSwatches.slice(0, 3),
      hiddenSwatches: sampleSwatches.slice(3),
      totalSwatchCount: 6,
      hasMoreSwatches: true,
      selectedVariation: sampleSwatches[0],
      selectVariation: () => {},
    },
  },
};

export const WithViewMoreCustomLabel: Story = {
  render: (args) => (
    <CioPlp apiKey={DEMO_API_KEY}>
      <ProductSwatch {...args} />
    </CioPlp>
  ),
  args: {
    showMoreLabel: (count: number) => `View ${count} more`,
    swatchObject: {
      swatchList: sampleSwatches,
      visibleSwatches: sampleSwatches.slice(0, 2),
      hiddenSwatches: sampleSwatches.slice(2),
      totalSwatchCount: 6,
      hasMoreSwatches: true,
      selectedVariation: sampleSwatches[0],
      selectVariation: () => {},
    },
  },
};

export const KitchenSink: Story = {
  decorators: [KitchenSinkDecorator],
  render: (args) => (
    <CioPlp apiKey={DEMO_API_KEY}>
      <ProductSwatch {...args} />
    </CioPlp>
  ),
  args: {
    swatchObject: {
      swatchList: sampleSwatches,
      visibleSwatches: sampleSwatches.slice(0, 3),
      hiddenSwatches: sampleSwatches.slice(3),
      totalSwatchCount: 6,
      hasMoreSwatches: true,
      selectedVariation: sampleSwatches[0],
      selectVariation: () => {},
    },
  },
};
