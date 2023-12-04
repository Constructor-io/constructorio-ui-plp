import type { Meta, StoryObj } from '@storybook/react';

import UseBrowseResultsExample from './UseBrowseResultsExample';

const meta = {
  title: 'Hooks/UseBrowseResults',
  component: UseBrowseResultsExample,
  argTypes: {
    configs: { control: false },
    cioClient: { name: 'configs.cioClient', control: false },
    browseParams: { name: 'configs.browseParams' },
  },
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
  args: {
    filterName: 'group_id',
    filterValue: '70',
    browseParams: { resultsPerPage: 2 },
  },
};
