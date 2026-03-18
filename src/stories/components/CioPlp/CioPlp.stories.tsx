import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import CioPlpGrid from '../../../components/CioPlpGrid';
import { DEMO_API_KEY } from '../../../constants';
import { PlpFacetOption } from '../../../types';
import '../../../styles.css';

const COLOR_FACET_NAMES = ['color', 'Base Color'];

const colorHexMap: Record<string, string> = {
  Black: '#000000',
  Blue: '#0000FF',
  Brown: '#8B4513',
  Neutral: '#C8B89A',
  Grey: '#808080',
  Pink: '#FFC0CB',
  White: '#FFFFFF',
  Gold: '#FFD700',
  Green: '#008000',
  Multi: '#FF00FF',
  Tan: '#D2B48C',
  Silver: '#C0C0C0',
  Red: '#FF0000',
  Yellow: '#FFFF00',
  Purple: '#800080',
  Orange: '#FFA500',
  Natural: '#F5DEB3',
  Metallic: '#AAA9AD',
  Cream: '#FFFDD0',
  'No Colour': '#E0E0E0',
  'Navy Blue': '#000080',
  'N/A': '#E0E0E0',
  Khaki: '#C3B091',
};

const defaultFilterConfigs = {
  isVisualFilterFn: (facet: { name: string }) => COLOR_FACET_NAMES.includes(facet.name),
  getVisualColorHex: (option: PlpFacetOption) => colorHexMap[option.value],
};

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
        'When enabled, applies Shopify default configurations for callbacks and URL helpers. This includes onAddToCart (adds to Shopify cart), onProductCardClick (navigates to product page), and setUrl (handles Shopify collection URLs). For the bundled version, also provides a default selector: #cio-plp-ui-container.',
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
      <CioPlpGrid key={gridKey} groupsConfigs={args.groupsConfigs} filterConfigs={args.filterConfigs} />
    </CioPlp>
  );
}

export const SearchPlp: Story = {
  render: (args) => <PrimaryStory args={args} defaultUrl={`${window.location.href}&q=shirt`} />,
  args: {
    apiKey: DEMO_API_KEY,
    filterConfigs: defaultFilterConfigs,
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
    filterConfigs: defaultFilterConfigs,
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
