import type { Meta, StoryObj } from '@storybook/react';
import { DEMO_API_KEY } from '../../constants';

import UseCioClientExample from './UseCioClientExample';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Hooks/UseCioClient',
  component: UseCioClientExample,
  parameters: {
    layout: 'centered',
  },
  // eslint-disable-next-line @cspell/spellchecker
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof UseCioClientExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    apiKey: DEMO_API_KEY,
    searchQuery: 'Shirt',
  },
};
