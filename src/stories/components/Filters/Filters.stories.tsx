import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import CioPlpGrid from '../../../components/CioPlpGrid';
import Filters from '../../../components/Filters';
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
  const [currentUrl, setCurrentUrl] = useState(`${window.location.href}&q=shirt`);
  // This is used for reactivity, updating this key will force CioPlpGrid to re-render
  const [gridKey, setGridKey] = useState(1);

  useEffect(() => {
    setGridKey(gridKey + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl]);

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <CioPlpGrid {...args} key={gridKey}>
        {(props) => {
          const { facets } = props.filters;
          return <Filters facets={facets} {...props} />;
        }}
      </CioPlpGrid>
    </CioPlp>
  );
}

export const Primary: Story = {
  args: { facets: [] },
  render: (args) => <PrimaryStory {...args} />,
};
