import type { Meta, StoryObj } from '@storybook/react';

import UseSearchResultsExample from './UseSearchResultsExample';

const meta = {
  title: 'Hooks/UseSearchResults',
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
  decorators: [
    () => {
      const url = new URL(window.location as any);
      url.searchParams.set('q', 'shirt');
      window.history.pushState({}, '', url);

      return null;
    },
  ],
};
