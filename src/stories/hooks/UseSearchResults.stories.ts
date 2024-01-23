import type { Meta, StoryObj } from '@storybook/react';

import UseSearchResultsExample from './UseSearchResultsExample';
import { transformSearchResponse } from '../../utils/transformers';
import apiSearchResponse from '../../../spec/local_examples/apiSearchResponse.json';
import { PlpSearchResponse } from '../../types';

const meta = {
  title: 'Hooks/useSearchResults',
  component: UseSearchResultsExample,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof UseSearchResultsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    query: 'water',
    searchParams: { resultsPerPage: 2 },
    initialSearchResponse: transformSearchResponse(apiSearchResponse as any) as PlpSearchResponse,
  },
};
