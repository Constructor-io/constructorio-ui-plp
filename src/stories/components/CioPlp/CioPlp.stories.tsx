import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';

import CioPlp from '../../../components/CioPlp';
import { DEMO_API_KEY } from '../../../constants';
import '../../../styles.css';
import CioPlpGrid from '../../../components/CioPlpGrid/CioPlpGrid';

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

function PrimaryStory({ args }: any) {
  const [currentUrl, setCurrentUrl] = useState(`${window.location.href}&q=shirt`);
  // This is used for reactivity, updating this key will force CioPlpGrid to re-render
  const [gridKey, setGridKey] = useState(1);

  useEffect(() => {
    setGridKey(gridKey + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  return (
    <CioPlp
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}
      {...args}>
      <CioPlpGrid key={gridKey} />
    </CioPlp>
  );
}

export const Primary: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    apiKey: DEMO_API_KEY,
  },
};
