import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Pagination from '../../../components/Pagination/Pagination';
import KitchenSinkDecorator from '../../utils/KitchenSinkDecorator';
import CioPlp from '../../../components/CioPlp/CioPlp';
import { DEMO_API_KEY } from '../../../constants';
import '../../../styles.css';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PrimaryStory({ args }: any) {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);
  // This is used for reactivity, updating this key will force CioPlpGrid to re-render
  const [paginationKey, setPaginationKey] = useState(1);

  useEffect(() => {
    setPaginationKey(paginationKey + 1);
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
      <Pagination {...args} key={paginationKey} />
    </CioPlp>
  );
}

export const Primary: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    totalNumResults: 200,
    resultsPerPage: 10,
  },
};

export const KitchenSink: Story = {
  decorators: [
    () =>
      KitchenSinkDecorator(() =>
        PrimaryStory({ args: { totalNumResults: 200, resultsPerPage: 10 } }),
      ),
  ],
  args: {
    totalNumResults: 200,
    resultsPerPage: 10,
  },
};
