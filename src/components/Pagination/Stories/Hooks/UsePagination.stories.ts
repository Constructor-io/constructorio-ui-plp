import type { Meta, StoryObj } from '@storybook/react';
import UsePaginationExample from './UsePaginationExample';

const meta = {
  title: 'Hooks/UsePagination',
  component: UsePaginationExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof UsePaginationExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    totalNumResults: 200,
    resultsPerPage: 10,
    windowSize: 5,
  },
};
