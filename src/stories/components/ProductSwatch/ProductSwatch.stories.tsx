import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DEMO_API_KEY } from '../../../constants';
import CioPlp from '../../../components/CioPlp';
import ProductSwatch from '../../../components/ProductSwatch';
import KitchenSinkDecorator from '../../utils/KitchenSinkDecorator';
import '../../../styles.css';

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
      selectVariation: () => {},
    },
  },
};
