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
        defaultValue: { summary: 10 },
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
