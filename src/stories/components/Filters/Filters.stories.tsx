import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import Filters from '../../../components/Filters';
import mockTransformedFacets from '../../../../spec/local_examples/sampleFacets.json';
import { PlpFacet } from '../../../types';
import { DEMO_API_KEY } from '../../../constants';
import '../../../styles.css';

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

/**
 * Use `isHiddenFilterFn` to hide entire facet groups based on custom logic.
 * In this example, the "Price" facet is hidden.
 */
export const HiddenFilters: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    isHiddenFilterFn: (facet: PlpFacet) => facet.name === 'price',
  },
};

/**
 * Use `isHiddenFilterOptionFn` to hide specific options within facets.
 * In this example, the "Black" and "Blue" color options are hidden.
 */
export const HiddenFilterOptions: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    isHiddenFilterOptionFn: (option) => option.value === 'Black' || option.value === 'Blue',
    initialNumOptions: 20,
  },
};

/**
 * Facets and options with `data.cio_plp_hidden = true` in their metadata
 * are automatically hidden without needing custom functions.
 * This example shows facets with the hidden metadata flag.
 */
export const HiddenViaMetadata: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: (mockTransformedFacets as Array<PlpFacet>).map((facet) => ({
      ...facet,
      data: {
        ...facet.data,
        cio_plp_hidden: facet.name === 'price', // Hide the Price facet
      },
    })),
  },
};
