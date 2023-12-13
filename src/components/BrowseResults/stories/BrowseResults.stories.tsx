import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BrowseResults from '../index';
import { CioPlpContext } from '../../../PlpContext';
import { DEMO_API_KEY } from '../../../constants';

const meta = {
  title: 'Components/BrowseResults',
  component: BrowseResults,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof BrowseResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => (
    <CioPlpContext apiKey={DEMO_API_KEY}>
      <BrowseResults {...args} />
    </CioPlpContext>
  ),
  args: {
    filterName: 'group_id',
    filterValue: '70',
    browseParams: {
      page: 1,
      resultsPerPage: 6,
      sortBy: 'relevance',
      sortOrder: 'descending',
      section: 'Products',
    },
  },
};
