import type { Meta, StoryObj } from '@storybook/react';
import ProductSwatch from '../../ProductSwatch';
import KitchenSinkDecorator from '../../../../stories/utils/KitchenSinkDecorator';

const meta = {
  title: 'Components/ProductSwatch',
  component: ProductSwatch,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProductSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Todo: Add wrapper context that returns pagination controls
export const Primary: Story = {
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
