import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import UseCioPlpExample from './UseCioPlpExample';

const meta = {
  title: 'Hooks/UseCioPlp',
  component: UseCioPlpExample,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseCioPlpExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [
    (Story) => {
      const url = new URL(window.location as any);
      url.searchParams.set('q', 'shirt');
      window.history.pushState({}, '', url);

      return <Story />;
    },
  ],
};
