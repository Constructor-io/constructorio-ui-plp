import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import Filters from '../../../components/Filters';
import mockTransformedFacets from '../../../../spec/local_examples/sampleFacets.json';
import { PlpFacet, PlpFacetOption, PlpMultipleFacet, PlpSingleFacet } from '../../../types';
import { DEMO_API_KEY } from '../../../constants';
import { colorHexMap, COLOR_FACET_NAMES } from '../../utils/colorConstants';
import '../../../styles.css';

const mockFacetsWithVisualColor = (mockTransformedFacets as Array<PlpFacet>).map((facet) => {
  if (!COLOR_FACET_NAMES.includes(facet.name) || !('options' in facet)) return facet;
  return {
    ...facet,
    data: { ...facet.data, cio_render_visual: true },
    options: (facet as PlpMultipleFacet | PlpSingleFacet).options.map((option: PlpFacetOption) => ({
      ...option,
      data: { ...option.data, hex_color: colorHexMap[option.value] },
    })),
  };
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
    facets: mockFacetsWithVisualColor,
  },
};

/**
 * Use `isHiddenFilterFn` to hide entire facet groups based on custom logic.
 * In this example, the "Price" facet is hidden.
 */
export const HiddenFilters: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockFacetsWithVisualColor,
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
    facets: mockFacetsWithVisualColor,
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
    facets: mockFacetsWithVisualColor.map((facet) => ({
      ...facet,
      data: {
        ...facet.data,
        cio_plp_hidden: facet.name === 'price', // Hide the Price facet
      },
    })),
  },
};

/**
 * Visual filters render color swatches next to each option.
 * Set `data.cio_render_visual = true` on the facet and `data.hex_color` on each option.
 */
export const VisualColorFilters: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockFacetsWithVisualColor,
    initialNumOptions: 20,
  },
};

/**
 * Use the `getVisualColorHex` callback to resolve color values dynamically
 * instead of relying on option metadata.
 * Combined with `isVisualFilterFn` to designate which facets are visual.
 */
export const VisualFilterViaCallback: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    isVisualFilterFn: (facet: PlpFacet) => COLOR_FACET_NAMES.includes(facet.name),
    getVisualColorHex: (option: PlpFacetOption) => colorHexMap[option.value],
    initialNumOptions: 20,
  },
};

/**
 * Use `perFacetConfigs` to enable visual rendering per facet.
 * This overrides both the `isVisualFilterFn` callback and `data.cio_render_visual`.
 */
export const VisualFilterViaPerFacetConfigs: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockFacetsWithVisualColor,
    perFacetConfigs: { color: { renderVisual: true } },
    initialNumOptions: 20,
  },
};
