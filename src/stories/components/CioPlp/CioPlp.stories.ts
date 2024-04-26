import type { Meta, StoryObj } from '@storybook/react';

import CioPlp from '../../../components/CioPlp';
import { DEMO_API_KEY } from '../../../constants';
import '../../../styles.css';

const meta = {
  title: 'Components/CioPlp',
  component: CioPlp,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    apiKey: {
      description: 'The index API key',
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    cioClient: {
      description: 'The Constructor IO client instance',
      table: {
        type: {
          summary: 'Nullable<ConstructorIOClient>',
        },
      },
    },
    callbacks: {
      description: 'Callback functions',
      table: {
        type: {
          summary: 'Callbacks',
        },
      },
    },
    formatters: {
      description: 'Data formatter functions for things like price, description, etc',
      table: {
        type: {
          summary: 'Formatters',
        },
      },
    },
    itemFieldGetters: {
      description: 'Data getter functions for things like price, description, etc',
      table: {
        type: {
          summary: 'ItemFieldGetters',
        },
      },
    },
    urlHelpers: {
      description:
        'Url Helpers for getting, setting and parsing request configurations from the url.',
      table: {
        type: {
          summary: 'UrlHelpers',
        },
      },
    },
  },
} satisfies Meta<typeof CioPlp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { apiKey: DEMO_API_KEY },
};
