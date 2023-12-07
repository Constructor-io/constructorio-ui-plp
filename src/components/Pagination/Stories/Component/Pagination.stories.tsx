import type { Meta, StoryObj } from '@storybook/react';
import Pagination from '../../Pagination';
import KitchenSinkDecorator from '../../../../stories/utils/KitchenSinkDecorator';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    pagination: {
      currentPage: 1,
      goToPage: () => {},
      nextPage: () => {},
      prevPage: () => {},
      pages: [1, -1, 4, 5, 6, -1, 10],
      totalPages: 10,
    },
  },
};

export const KitchenSink: Story = {
  decorators: [KitchenSinkDecorator],
  args: {
    pagination: {
      currentPage: 1,
      goToPage: () => {},
      nextPage: () => {},
      prevPage: () => {},
      pages: [1, -1, 4, 5, 6, -1, 10],
      totalPages: 10,
    },
  },
};
