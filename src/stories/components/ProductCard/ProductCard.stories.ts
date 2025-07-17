import type { Meta, StoryObj } from '@storybook/react';
import { transformResultItem } from '../../../utils/transformers';
import SampleItem from '../../../../spec/local_examples/item.json';
import SampleItemWithSalePrice from '../../../../spec/local_examples/itemWithSalePrice.json';
import ProductCardExample from './ProductCardExample';
import '../../../styles.css';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/ProductCard',
  component: ProductCardExample,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof ProductCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    item: transformResultItem(SampleItem, false),
  },
};

export const WithSalePrice: Story = {
  args: {
    item: transformResultItem(SampleItemWithSalePrice, false),
  },
};
