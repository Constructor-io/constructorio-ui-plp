import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SearchResults from '../../../components/SearchResults';
import { DEMO_API_KEY } from '../../../constants';
import { CioPlpContext } from '../../../PlpContext';

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
    <CioPlpContext apiKey={DEMO_API_KEY}>
      <SearchResults {...args} />
    </CioPlpContext>
  ),
  args: {
    initialQuery: 'red',
    searchParams: {
      page: 1,
      resultsPerPage: 6,
      sortBy: 'relevance',
      sortOrder: 'descending',
      section: 'Products',
    },
  },
};
