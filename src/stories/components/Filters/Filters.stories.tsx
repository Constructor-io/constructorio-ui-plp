import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DEMO_API_KEY } from '../../../constants';
import CioPlp from '../../../components/CioPlp';
import Filters from '../../../components/Filters';
import mockTransformedFacets from '../../../../spec/local_examples/sampleFacets.json';
import { PlpSearchResponse } from '../../../types';
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
    response: { facets: mockTransformedFacets } as unknown as PlpSearchResponse,
  },
};

// export const KitchenSink: Story = {
//   decorators: [KitchenSinkDecorator],
//   render: (args) => (
//     <CioPlp apiKey={DEMO_API_KEY}>
//       <ProductSwatch {...args} />
//     </CioPlp>
//   ),
//   args: {
//     swatchObject: {
//       swatchList: [
//         {
//           url: 'abc.com',
//           imageUrl: 'abc.img',
//           itemName: 'abc',
//           variationId: 'abc',
//           swatchPreview: '#FFFFFF',
//         },
//         {
//           url: 'def.com',
//           imageUrl: 'def.img',
//           itemName: 'def',
//           variationId: 'def',
//           swatchPreview: '#AAAAAA',
//         },
//       ],
//       selectedVariation: {
//         url: 'abc.com',
//         imageUrl: 'abc.img',
//         itemName: 'abc',
//         variationId: 'abc',
//         swatchPreview: '#FFFFFF',
//       },
//       selectVariation: () => {},
//     },
//   },
// };
