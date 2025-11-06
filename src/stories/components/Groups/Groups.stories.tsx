import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import mockTransformedGroups from '../../../../spec/local_examples/sampleGroups.json';
import { PlpItemGroup } from '../../../types';
import { DEMO_API_KEY } from '../../../constants';
import useRequestConfigs from '../../../hooks/useRequestConfigs';
import Groups, { GroupsProps } from '../../../components/Groups';
import '../../../styles.css';

const meta = {
  title: 'Components/Groups',
  component: Groups,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    initialNumOptions: {
      table: {
        defaultValue: { summary: 10 },
      },
    },
    isCollapsed: {
      table: {
        defaultValue: { summary: false },
      },
    },
  },
} satisfies Meta<typeof Groups>;

export default meta;
type Story = StoryObj<typeof meta>;

// Function to emulate filtering down
function findGroup(groups: Array<PlpItemGroup>, groupId: string) {
  if (groups.length === 0) {
    return null;
  }

  const [currentGroup, ...remainingGroups] = groups;

  if (!currentGroup) {
    return findGroup(remainingGroups, groupId);
  }

  if (currentGroup.groupId === groupId) {
    return currentGroup;
  }

  return findGroup([...remainingGroups, ...currentGroup.children], groupId);
}

// Wrapper Group used to access request configs to emulate filtering down
function GroupsWrapper(props: GroupsProps) {
  const { getRequestConfigs } = useRequestConfigs();
  const requestConfigs = getRequestConfigs();
  const currentGroupId = requestConfigs.filters?.group_id?.toString() || 'all';

  // Use mocks instead of relying on API requests for demo
  let mockedGroups = mockTransformedGroups as Array<PlpItemGroup>;
  if (currentGroupId) {
    const currentGroup = findGroup(mockedGroups, currentGroupId);

    if (currentGroup) {
      mockedGroups = [currentGroup];
    } else {
      mockedGroups = [];
    }
  }

  const args = {
    ...props,
    groups: mockedGroups,
  };

  return <Groups {...args} />;
}

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
      <GroupsWrapper {...args} />
    </CioPlp>
  );
}

export const Primary: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    isCollapsed: false,
  },
};

export const LimitedOptions: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    initialNumOptions: 2,
    isCollapsed: false,
  },
};

export const CollapsedByDefault: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    isCollapsed: true,
  },
};

export const CustomTitle: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    title: 'Product Categories',
    isCollapsed: false,
  },
};

export const HiddenGroups: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    hideGroups: true,
  },
  tags: ['!dev'],
};
