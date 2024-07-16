import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import CioPlp from '../../../components/CioPlp';
import Sort from '../../../components/Sort/Sort';
import { DEMO_API_KEY } from '../../../constants';
import { transformSearchResponse } from '../../../utils/transformers';
import mockSearchResponse from '../../../../spec/local_examples/apiSearchResponse.json';
import { PlpSearchResponse } from '../../../types';
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
    searchOrBrowseResponse: transformSearchResponse(
      mockSearchResponse as SearchResponse,
    ) as PlpSearchResponse,
  },
};
