import type { Meta, StoryObj } from '@storybook/react';
import UseProductSwatchExample from './UseProductSwatchExample';
import { transformResultItem } from '../../../../utils/transformers';
import SampleItem from '../../../../../spec/local_examples/item.json';

const meta = {
  title: 'Hooks/UseProductSwatch',
  component: UseProductSwatchExample,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    item: {
      description: 'Constructor transformed item object',
    },
  },
} satisfies Meta<typeof UseProductSwatchExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    item: transformResultItem(SampleItem, false),
  },
};
