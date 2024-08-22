import type { Meta, StoryObj } from '@storybook/react';
import UsePaginationExample from './UsePaginationExample';
import '../../../styles.css';

const meta = {
  title: 'Hooks/UsePagination',
  component: UsePaginationExample,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    totalNumResults: {
      description: 'Total number of results for all pages',
      control: {
        type: 'number',
      },
    },
    resultsPerPage: {
      description: 'Number of results to be returned per page',
      control: {
        type: 'number',
      },
    },
    windowSize: {
      description: 'Number of pages to display in the pagination window',
      control: {
        type: 'number',
      },
    },
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
