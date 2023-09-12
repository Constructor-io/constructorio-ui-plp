import type { Meta, StoryObj } from '@storybook/react';

import UseSearchPlpExample, {
  useSearchPlpExampleCode,
  useSearchPlpFeaturedCode,
} from './UseSearchPlpExample';

const meta = {
  title: 'Hooks/UseSearchPlp',
  component: UseSearchPlpExample,
  argTypes: {
    configs: { control: false },
    cioClient: { name: 'configs.cioClient', control: false },
    searchParams: { name: 'configs.searchParams' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        code: useSearchPlpExampleCode,
        language: 'jsx',
        format: true,
        type: 'code',
      },
      description: {
        story: useSearchPlpFeaturedCode,
      },
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
  // eslint-disable-next-line @cspell/spellchecker
  tags: ['autodocs'],
} satisfies Meta<typeof UseSearchPlpExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    query: 'water',
    searchParams: { resultsPerPage: 2 },
  },
};
