import type { Meta, StoryObj } from '@storybook/react';
import PaginationExample from './PaginationExample';

const meta = {
  title: 'Components/Pagination',
  component: PaginationExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PaginationExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    totalNumResults: 200,
    resultsPerPage: 10,
    windowSize: 5,
  },
};
