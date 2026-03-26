import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import Filters from '../../../components/Filters';
import mockTransformedFacets from '../../../../spec/local_examples/sampleFacets.json';
import { PlpFacet, PlpMultipleFacet, FilterGroupRenderProps } from '../../../types';
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

/**
 * Use `filterGroupOverrides.root.reactNode` to replace the entire FilterGroup with a custom component.
 * The render function receives `FilterGroupRenderProps` with full state access.
 */
export const OverrideRoot: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    filterGroupOverrides: {
      root: {
        reactNode: ({
          facet,
          isCollapsed,
          toggleIsCollapsed,
          onFilterSelect,
        }: FilterGroupRenderProps) => (
          <li
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              marginBottom: '8px',
              listStyle: 'none',
            }}>
            <button
              type='button'
              onClick={toggleIsCollapsed}
              style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              {facet.displayName} {isCollapsed ? '▶' : '▼'}
            </button>
            {!isCollapsed && facet.type !== 'range' && 'options' in facet && (
              <ul style={{ paddingLeft: '16px', marginTop: '8px' }}>
                {(facet as PlpMultipleFacet).options.map((option) => (
                  <li key={option.value}>
                    <div>
                      <input type='checkbox' onChange={() => onFilterSelect([option.value])} />
                      {option.displayName} ({option.count})
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ),
      },
    },
  },
};

/**
 * Use `filterGroupOverrides.header` to replace only the header button
 * while keeping the default options list and range slider.
 */
export const OverrideHeader: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    filterGroupOverrides: {
      header: {
        reactNode: ({ facet, isCollapsed, toggleIsCollapsed }: FilterGroupRenderProps) => (
          <div
            role='button'
            tabIndex={0}
            onClick={toggleIsCollapsed}
            onKeyDown={(e) => e.key === 'Enter' && toggleIsCollapsed()}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              cursor: 'pointer',
              borderRadius: '4px',
            }}>
            <span style={{ fontWeight: 600 }}>{facet.displayName}</span>
            <span style={{ fontSize: '12px', color: 'blue' }}>{isCollapsed ? 'Show' : 'Hide'}</span>
          </div>
        ),
      },
    },
  },
};

/**
 * Use `filterGroupOverrides.optionsList` to replace the checkbox options list
 * with a custom implementation. Only affects multiple/single facets.
 */
export const OverrideOptionsList: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    filterGroupOverrides: {
      optionsList: {
        reactNode: ({ facet, isCollapsed, onFilterSelect }: FilterGroupRenderProps) => {
          if (isCollapsed || facet.type === 'range' || !('options' in facet)) return null;
          const multipleFacet = facet as PlpMultipleFacet;
          return (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '8px 0',
                width: '300px',
              }}>
              {multipleFacet.options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => onFilterSelect([option.value])}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: '1px solid #ddd',
                    backgroundColor: option.status === 'selected' ? '#333' : '#fff',
                    color: option.status === 'selected' ? '#fff' : '#333',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}>
                  {option.displayName}
                </button>
              ))}
            </div>
          );
        },
      },
    },
  },
};

/**
 * Use `filterGroupOverrides.rangeSlider` to replace the range slider
 * with a custom implementation. Only affects range-type facets.
 */
export const OverrideRangeSlider: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    filterGroupOverrides: {
      rangeSlider: {
        reactNode: ({ facet, isCollapsed, onFilterSelect }: FilterGroupRenderProps) => {
          if (isCollapsed || facet.type !== 'range') return null;
          const rangeFacet = facet as PlpFacet & { min: number; max: number };
          return (
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span>${rangeFacet.min}</span>
                <input
                  type='range'
                  min={rangeFacet.min}
                  max={rangeFacet.max}
                  style={{ flex: 1 }}
                  onChange={(e) => onFilterSelect(`${rangeFacet.min}-${e.target.value}`)}
                />
                <span>${rangeFacet.max}</span>
              </div>
            </div>
          );
        },
      },
    },
  },
};

/**
 * Use a static `ReactNode` instead of a render function
 * to replace a sub-component with fixed content.
 */
export const OverrideHeaderStatic: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    facets: mockTransformedFacets as Array<PlpFacet>,
    filterGroupOverrides: {
      header: {
        reactNode: (
          <div style={{ padding: '8px 12px', backgroundColor: '#e8f4fd', borderRadius: '4px' }}>
            <strong>Custom Static Header</strong>
          </div>
        ),
      },
    },
  },
};
