import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import Filters from '../../../components/Filters';
import mockTransformedFacets from '../../../../spec/local_examples/sampleFacets.json';
import { PlpFacet } from '../../../types';
import { DEMO_API_KEY } from '../../../constants';
import '../../../styles.css';

const mockFacetsWithCollapsedMetadata = (mockTransformedFacets as Array<PlpFacet>).map((facet) => {
  if (facet.name === 'color' || facet.name === 'price') {
    return { ...facet, data: { ...facet.data, cio_render_collapsed: true } };
  }
  return facet;
});

const meta = {
  title: 'Components/Filters',
  component: Filters,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    initialNumOptions: {
      table: {
        defaultValue: { summary: '10' },
      },
    },
    renderCollapsed: {
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    collapsedFacets: {
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<typeof Filters>;

export default meta;
type Story = StoryObj<typeof meta>;

function PrimaryStory({ args }: any) {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <Filters {...args} />
    </CioPlp>
  );
}

export const Primary: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
  },
};

export const AllCollapsed: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    renderCollapsed: true,
  },
};

export const SpecificFacetsCollapsed: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    collapsedFacets: ['color', 'price'],
  },
};

export const CollapsedViaMetadata: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockFacetsWithCollapsedMetadata,
  },
};
