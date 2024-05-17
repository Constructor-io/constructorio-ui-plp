import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Spinner from '../../components/Spinner/Spinner';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
