import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import CioPlp from '../../../components/CioPlp';
import Sort from '../../../components/Sort';
import { DEMO_API_KEY } from '../../../constants';
import { transformSearchResponse } from '../../../utils/transformers';
import mockSearchResponse from '../../../../spec/local_examples/apiSearchResponse.json';
import { PlpSearchDataResults } from '../../../types';
import '../../../styles.css';

const meta = {
  title: 'Components/Sort',
  component: Sort,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof Sort>;

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
      <Sort {...args} />
    </CioPlp>
  );
}

export const Primary: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    sortOptions: (
      transformSearchResponse(mockSearchResponse as SearchResponse) as PlpSearchDataResults
    ).response.sortOptions,
  },
};

/**
 * Accessibility regression guard (WCAG 4.1.2 / 2.4.7). These assertions need real
 * stylesheets, so they live here rather than in Jest, where `jest.config.js` maps
 * `.css` to a mock and `display: none` can never be observed.
 */
export const Accessibility: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    sortOptions: (
      transformSearchResponse(mockSearchResponse as SearchResponse) as PlpSearchDataResults
    ).response.sortOptions,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const radios = canvas.getAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);

    // The original defect: `.cio-plp-sort input { display: none }` removed the radios
    // from the accessibility tree and the focus order at every viewport.
    radios.forEach((radio) => {
      const styles = window.getComputedStyle(radio);
      expect(styles.display).not.toBe('none');
      expect(styles.visibility).not.toBe('hidden');
    });

    // All options in one group share a `name`, making them mutually exclusive and
    // arrow-navigable as a single radio group.
    const names = new Set(radios.map((radio) => radio.getAttribute('name')));
    expect(names.size).toBe(1);

    // Radios must be focusable, and selecting via keyboard must not drop focus.
    const target = radios.find((radio) => !(radio as HTMLInputElement).checked)!;
    (target as HTMLInputElement).focus();
    expect(document.activeElement).toBe(target);

    (target as HTMLInputElement).click();
    expect((target as HTMLInputElement).checked).toBe(true);
    expect(document.activeElement).toBe(target);

    // The checked visual is drawn on the adjacent span, which must still be visible.
    const proxy = target.nextElementSibling as HTMLElement;
    expect(window.getComputedStyle(proxy).display).not.toBe('none');
  },
};
