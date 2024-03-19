import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import UseBrowseResultsExample from './UseBrowseResultsExample';

const meta = {
  title: 'Hooks/UseBrowseResults',
  component: UseBrowseResultsExample,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseBrowseResultsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [
    (Story) => {
      const url = new URL(window.location as any);
      url.pathname += '/70';
      window.history.pushState({}, '', url);

      return <Story />;
    },
  ],
};
