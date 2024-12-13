import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import CioPlpGrid from '../../../components/CioPlpGrid';
import CioPlpBrowse from '../../../components/CioPlpBrowse';
import { DEMO_API_KEY } from '../../../constants';
import '../../../styles.css';

const meta = {
  title: 'Components/CioPlpGrid',
  component: CioPlpGrid,
  parameters: {
    layout: 'centered',
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
  },
} satisfies Meta<typeof CioPlpGrid>;

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
      <div>Example Url: https://www.example.com?q=shirt</div>
      <CioPlpGrid {...args} key={gridKey} />
    </CioPlp>
  );
}

export const Primary: Story = {
  render: (args) => <PrimaryStory args={args} />,
};

function BrowseStory({ args }: any) {
  const [currentUrl, setCurrentUrl] = useState(
    `${window.location.origin}/group_id/this-is-a-fake-group_as_recommended-by-constructor`,
  );
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
      <div>
        Example Url:
        https://www.example.com/group_id/this-is-a-fake-group_as_recommended-by-constructor
      </div>
      <CioPlpBrowse {...args} key={gridKey} />
    </CioPlp>
  );
}

export const Browse: Story = {
  render: (args) => <BrowseStory args={args} />,
};

function ZeroResultsStory({ args }: any) {
  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        // eslint-disable-next-line @cspell/spellchecker
        getUrl: () => `${window.location.href}&q=cvwdacoknqeauosd1`,
      }}>
      <div>Example Url: https://www.example.com?q=cvwdacoknqeauosd1</div>
      <CioPlpGrid {...args} />
    </CioPlp>
  );
}

export const ZeroResults: Story = {
  render: (args) => <ZeroResultsStory args={args} />,
};
