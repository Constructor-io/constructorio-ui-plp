import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import CioPlpGrid from '../../../components/CioPlpGrid';
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
      description: 'The Constructor client instance',
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
    useShopifyDefaults: {
      description:
        'When enabled, applies Shopify default configurations for callbacks and URL helpers. This includes onAddToCart (adds to Shopify cart), onProductCardClick (navigates to product page), and setUrl (handles Shopify collection URLs).',
      table: {
        type: {
          summary: 'boolean',
        },
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
} satisfies Meta<typeof CioPlp>;

export default meta;
type Story = StoryObj<typeof meta>;

function PrimaryStory({ args, defaultUrl }: any) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
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
      <CioPlpGrid key={gridKey} groupsConfigs={args.groupsConfigs} />
    </CioPlp>
  );
}

export const SearchPlp: Story = {
  render: (args) => <PrimaryStory args={args} defaultUrl={`${window.location.href}&q=shirt`} />,
  args: {
    apiKey: DEMO_API_KEY,
  },
};

export const BrowsePlp: Story = {
  render: (args) => (
    <PrimaryStory
      args={args}
      defaultUrl={`${window.location.href.replace('/iframe.html', '/group_id/1035')}`}
    />
  ),
  args: {
    apiKey: DEMO_API_KEY,
  },
};

export const GroupConfigsIsHiddenGroupFn: Story = {
  render: (args) => <PrimaryStory args={args} defaultUrl={`${window.location.href}&q=shirt`} />,
  args: {
    apiKey: DEMO_API_KEY,
    groupsConfigs: {
      isHiddenGroupFn: (group) => ['2541', '1027', '63'].includes(group.groupId),
    },
  },
};
