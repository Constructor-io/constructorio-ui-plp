import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CioPlp from '../../../components/CioPlp';
import mockTransformedGroups from '../../../../spec/local_examples/sampleGroups.json';
import { PlpItemGroup, GroupsRenderProps } from '../../../types';
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
  const { componentOverrides, ...groupsArgs } = args;

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      componentOverrides={componentOverrides}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <GroupsWrapper {...groupsArgs} />
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

export const IsHiddenGroupFnStory: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    isCollapsed: false,
    isHiddenGroupFn: (group) => ['2', '12'].includes(group.groupId),
  },
};

/**
 * Use `componentOverrides.groups.reactNode` on the CioPlp provider
 * to replace the entire Groups component with a custom component.
 * The render function receives `GroupsRenderProps` with full state access.
 */
export const OverrideRoot: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    componentOverrides: {
      groups: {
        reactNode: ({ groups, isCollapsed, toggleIsCollapsed }: GroupsRenderProps) => (
          <div
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              marginBottom: '8px',
            }}>
            <button
              type='button'
              onClick={toggleIsCollapsed}
              style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              Custom Groups {isCollapsed ? '▶' : '▼'}
            </button>
            {!isCollapsed && (
              <ul style={{ paddingLeft: '16px', marginTop: '8px' }}>
                {groups[0]?.children?.map((group) => (
                  <li key={group.groupId}>
                    {group.displayName} ({group.count})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ),
      },
    },
  },
};

/**
 * Use `componentOverrides.groups.header` on the CioPlp provider to replace only the header button
 * while keeping the default breadcrumbs and options list.
 */
export const OverrideHeader: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    componentOverrides: {
      groups: {
        header: {
          reactNode: ({ isCollapsed, toggleIsCollapsed }: GroupsRenderProps) => (
            <button
              type='button'
              onClick={toggleIsCollapsed}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
                borderRadius: '4px',
              }}>
              <span style={{ fontWeight: 600 }}>Product Categories</span>
              <span style={{ fontSize: '12px', color: 'blue' }}>
                {isCollapsed ? 'Show' : 'Hide'}
              </span>
            </button>
          ),
        },
      },
    },
  },
};

/**
 * Use `componentOverrides.groups.breadcrumbs` on the CioPlp provider to replace the breadcrumb navigation
 * with a custom implementation.
 */
export const OverrideBreadcrumbs: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    componentOverrides: {
      groups: {
        breadcrumbs: {
          reactNode: ({ breadcrumbs, goToGroupFilter, groups }: GroupsRenderProps) => {
            if (breadcrumbs.length === 0) return null;
            return (
              <div
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#e8f4fd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}>
                📍{' '}
                {breadcrumbs.map((crumb) => (
                  <span>
                    <button type='button' key={crumb.path} onClick={() => goToGroupFilter(crumb)}>
                      {crumb.breadcrumb}
                    </button>
                    {' >> '}
                  </span>
                ))}
                <span className='cio-groups-crumb'>{groups[0].displayName}</span>
              </div>
            );
          },
        },
      },
    },
  },
};

/**
 * Use `componentOverrides.groups.optionsList` on the CioPlp provider to replace the options list
 * with a custom implementation.
 */
export const OverrideOptionsList: Story = {
  render: (args) => <PrimaryStory args={args} />,
  args: {
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    componentOverrides: {
      groups: {
        optionsList: {
          reactNode: ({ groups, onOptionSelect }: GroupsRenderProps) => (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '8px 0',
                width: '300px',
              }}>
              {groups[0]?.children?.map((group) => (
                <button
                  key={group.groupId}
                  type='button'
                  onClick={() => onOptionSelect(group.groupId)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: '1px solid #ddd',
                    backgroundColor: '#fff',
                    color: '#333',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}>
                  {group.displayName}
                </button>
              ))}
            </div>
          ),
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
    groups: mockTransformedGroups as Array<PlpItemGroup>,
    componentOverrides: {
      groups: {
        header: {
          reactNode: (
            <div style={{ padding: '8px 12px', backgroundColor: '#e8f4fd', borderRadius: '4px' }}>
              <strong>Custom Static Header</strong>
            </div>
          ),
        },
      },
    },
  },
};
