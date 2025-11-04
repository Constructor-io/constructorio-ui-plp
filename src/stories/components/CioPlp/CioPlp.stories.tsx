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
    paginationConfigs: {
      description:
        'Configuration options for pagination. Used to set windowSize of pages array and can override resultsPerPage.',
      table: {
        type: {
          summary: 'UsePaginationProps',
        },
      },
    },
    sortConfigs: {
      description: 'Configuration options for sorting functionality.',
      table: {
        type: {
          summary: 'UseSortProps',
        },
      },
    },
    filterConfigs: {
      description: 'Configuration options for filters functionality.',
      table: {
        type: {
          summary: 'UseFilterProps',
        },
      },
    },
    groupsConfigs: {
      description:
        'Configuration options for the Groups component. Controls initialNumOptions, isCollapsed, title, and hideGroups.',
      table: {
        type: {
          summary: 'GroupsProps',
        },
        defaultValue: { summary: '{}' },
      },
      control: { type: 'object' },
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
      <CioPlpGrid key={gridKey} />
    </CioPlp>
  );
}

function GroupsStory({ args, defaultUrl }: any) {
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);

  return (
    <CioPlp
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}
      {...args}
    />
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

export const CustomGroupsConfig: Story = {
  render: (args) => <GroupsStory args={args} defaultUrl={`${window.location.href}&q=shirt`} />,
  args: {
    apiKey: DEMO_API_KEY,
    groupsConfigs: {
      initialNumOptions: 3,
      title: 'Product Categories',
      isCollapsed: false,
    },
  },
  tags: ['!dev'],
};

export const CollapsedGroups: Story = {
  render: (args) => <GroupsStory args={args} defaultUrl={`${window.location.href}&q=shirt`} />,
  args: {
    apiKey: DEMO_API_KEY,
    groupsConfigs: {
      isCollapsed: true,
      title: 'Browse Categories',
    },
  },
  tags: ['!dev'],
};

export const HiddenGroups: Story = {
  render: (args) => <GroupsStory args={args} defaultUrl={`${window.location.href}&q=shirt`} />,
  args: {
    apiKey: DEMO_API_KEY,
    groupsConfigs: {
      hideGroups: true,
    },
  },
  tags: ['!dev'],
};
