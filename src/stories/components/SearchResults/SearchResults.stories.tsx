import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchResults from '../../../components/SearchResults';
import { DEMO_API_KEY } from '../../../constants';
import CioPlp from '../../../components/CioPlp';

const meta = {
  title: 'Components/SearchResults',
  component: SearchResults,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => (
    <CioPlp apiKey={DEMO_API_KEY}>
      <div>Example Url: https://www.example.com?q=shirt</div>
      <br />
      <SearchResults {...args} />
    </CioPlp>
  ),
  decorators: [
    (Story) => {
      const url = new URL(window.location as any);
      url.searchParams.set('q', 'shirt');
      window.history.pushState({}, '', url);

      return <Story />;
    },
  ],
};
