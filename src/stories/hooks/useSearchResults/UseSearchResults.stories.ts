import type { Meta, StoryObj } from '@storybook/react';

import UseSearchResultsExample from './UseSearchResultsExample';

const meta = {
  title: 'Hooks/useSearchResults',
  component: UseSearchResultsExample,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseSearchResultsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    query: 'water',
    searchParams: { resultsPerPage: 2 },
  },
};
