import '@testing-library/jest-dom';
import React, { useEffect, useState } from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { DEMO_API_KEY } from '../../../src/constants';
import CioPlp from '../../../src/components/CioPlp';
import Groups from '../../../src/components/Groups';
import mockTransformedGroups from '../../local_examples/sampleGroups.json';
import testJsonEncodedUrl from '../../local_examples/testJsonEncodedUrl.json';
import { getStateFromUrl } from '../../../src/utils/urlHelpers';

const groupsProps = { groups: mockTransformedGroups };

describe('Testing Component: Groups', () => {
  const originalWindowLocation = window.location;

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    window.location = 'https://example.com';
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  describe(' - Rendering Tests', () => {
    it('Should throw error if used outside the CioPlp', () => {
      expect(() => render(<Groups facets={mockTransformedGroups} />)).toThrow();
    });

    it('Should render options list based on list of groups', async () => {
      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        const showAllButtons = container.querySelectorAll('.cio-see-all');
        if (showAllButtons) {
          showAllButtons.forEach((btn) => fireEvent.click(btn));
        }

        mockTransformedGroups.forEach((group) => {
          expect(getByText(group.displayName).toBeInTheDocument);
        });
      });
    });

    it('Should show only specified number of options on render', async () => {
      const initialNumOptions = 2;
      const { queryByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} initialNumOptions={initialNumOptions} />
        </CioPlp>,
      );

      await waitFor(() => {
        const showAllButton = queryByText('Show All');
        const allGreetingCardsGroup = queryByText('All Greeting Cards');
        const souvenirsGroup = queryByText('Souvenirs');
        const dealsGroup = queryByText('Deals');

        expect(showAllButton).not.toBeNull();
        expect(allGreetingCardsGroup).not.toBeNull();
        expect(souvenirsGroup).not.toBeNull();
        expect(dealsGroup).toBeNull();
      });
    });

    it('Should render current group as a breadcrumb', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      const allBreadcrumbEl = container.querySelectorAll('.cio-groups-crumb')[0];
      expect(allBreadcrumbEl).not.toBeUndefined();
      expect(allBreadcrumbEl.textContent).toBe('All');
    });

    it('Should render nested breadcrumbs', async () => {
      const emulateFilteredGroupsProps = {
        ...groupsProps,
        groups: [groupsProps.groups[0].children[0]],
      };
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...emulateFilteredGroupsProps} />
        </CioPlp>,
      );

      const allBreadcrumbEl = container.querySelectorAll('.cio-groups-crumb')[0];
      expect(allBreadcrumbEl).not.toBeUndefined();
      expect(allBreadcrumbEl.textContent).toBe('All');

      const allGreetingCardsCrumbEl = container.querySelectorAll('.cio-groups-crumb')[1];
      expect(allGreetingCardsCrumbEl).not.toBeUndefined();
      expect(allGreetingCardsCrumbEl.textContent).toBe('All Greeting Cards');
    });

    it('Should render correctly with render props', () => {
      const mockChildren = jest.fn().mockReturnValue(<div>Custom Filters</div>);

      const filtersPropsWithChildren = {
        ...groupsProps,
        children: mockChildren,
      };

      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...filtersPropsWithChildren} />
        </CioPlp>,
      );
      expect(mockChildren).toHaveBeenCalled();
      expect(getByText('Custom Filters')).toBeInTheDocument();
    });

    it('Should not render groups when hideGroups is true', async () => {
      const groupsPropsWithHideGroups = {
        ...groupsProps,
        hideGroups: true,
      };

      const { container, queryByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsPropsWithHideGroups} />
        </CioPlp>,
      );

      await waitFor(() => {
        mockTransformedGroups.forEach((group) => {
          expect(queryByText(group.displayName)).not.toBeInTheDocument();
        });
        expect(container.querySelector('.cio-groups')).not.toBeInTheDocument();
      });
    });

    it('Should render groups when hideGroups is false', async () => {
      const groupsPropsWithHideGroups = {
        ...groupsProps,
        hideGroups: false,
      };

      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsPropsWithHideGroups} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(getByText(mockTransformedGroups[0].displayName)).toBeInTheDocument();
      });
    });

    it('Should exclude groups excluded by isHiddenGroupFn', () => {
      const filtersPropsWithChildren = {
        ...groupsProps,
        isHiddenGroupFn: (group) => ['2', '12'].includes(group.groupId),
      };

      const { getByText, queryByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...filtersPropsWithChildren} />
        </CioPlp>,
      );
      expect(queryByText('Souvenirs')).toBeNull();
      expect(getByText('Deals')).toBeInTheDocument();
    });

    it('Should exclude groups excluded by group.data.cio_plp_hidden', () => {
      const { getByText, queryByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );
      expect(queryByText('Hidden Group')).toBeNull();
      expect(getByText('Deals')).toBeInTheDocument();
    });
  });

  describe(' - Default rendering without componentOverrides', () => {
    it('Should render default header, breadcrumbs, options list, and structure when no overrides provided', async () => {
      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        // Default header with title should render
        expect(getByText('Categories')).toBeInTheDocument();

        // Default arrow icon should be present
        const header = getByText('Categories').closest('.cio-filter-header');
        expect(header).toBeInTheDocument();
        expect(header.querySelector('.cio-arrow')).toBeInTheDocument();

        // Default breadcrumbs should render
        const breadcrumbs = container.querySelectorAll('.cio-groups-crumb');
        expect(breadcrumbs.length).toBeGreaterThan(0);

        // Default options list should render
        expect(container.querySelector('.cio-filter-groups-options-list')).toBeInTheDocument();
      });
    });

    it('Should render currentPage as the trailing breadcrumb span', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        const breadcrumbsWrapper = container.querySelector('.cio-groups-breadcrumbs');
        expect(breadcrumbsWrapper).toBeInTheDocument();
        // Trailing <span> (not <button>) is the current-page label and should match
        // the current rendered group label for this state.
        const tail = breadcrumbsWrapper.querySelector('span.cio-groups-crumb');
        expect(tail).toBeInTheDocument();
        expect(tail.textContent).toBe(mockTransformedGroups[0].displayName);
      });
    });

    it('Should pass currentPage through renderProps to breadcrumbs override', () => {
      const spy = jest.fn().mockReturnValue(<div>Override</div>);

      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{ breadcrumbs: { reactNode: spy } }}
          />
        </CioPlp>,
      );

      const props = spy.mock.calls[0][0];
      expect(props.currentPage).toBe(mockTransformedGroups[0].displayName);
    });
  });

  describe(' - componentOverrides', () => {
    const overrideSlots = [
      {
        key: 'root',
        buildOverrides: (fn) => ({ reactNode: fn }),
      },
      {
        key: 'header',
        buildOverrides: (fn) => ({ header: { reactNode: fn } }),
      },
      {
        key: 'breadcrumbs',
        buildOverrides: (fn) => ({ breadcrumbs: { reactNode: fn } }),
      },
      {
        key: 'optionsList',
        buildOverrides: (fn) => ({ optionsList: { reactNode: fn } }),
      },
    ];

    describe.each(overrideSlots)('override: $key', ({ key, buildOverrides }) => {
      it(`Should replace ${key} with custom content`, () => {
        const overrideFn = () => <div data-testid={`custom-${key}`}>Custom {key}</div>;

        render(
          <CioPlp apiKey={DEMO_API_KEY}>
            <Groups {...groupsProps} componentOverrides={buildOverrides(overrideFn)} />
          </CioPlp>,
        );

        expect(screen.getByTestId(`custom-${key}`)).toBeInTheDocument();
      });

      it(`Should pass correct render props to ${key} override`, () => {
        const spy = jest.fn().mockReturnValue(<div>Override</div>);

        render(
          <CioPlp apiKey={DEMO_API_KEY}>
            <Groups {...groupsProps} componentOverrides={buildOverrides(spy)} />
          </CioPlp>,
        );

        expect(spy).toHaveBeenCalled();
        const props = spy.mock.calls[0][0];
        expect(props.groups).toEqual(mockTransformedGroups);
        expect(props.isCollapsed).toBe(false);
        expect(typeof props.toggleIsCollapsed).toBe('function');
        expect(typeof props.onOptionSelect).toBe('function');
        expect(typeof props.goToGroupFilter).toBe('function');
      });
    });

    it('Should accept static ReactNode as override (not a function) for header', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              header: {
                reactNode: <div data-testid='static-header'>Static Header Content</div>,
              },
            }}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('static-header')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Categories/ })).not.toBeInTheDocument();
    });

    it('Should accept static ReactNode as override (not a function) for breadcrumbs', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              breadcrumbs: {
                reactNode: <div data-testid='static-breadcrumbs'>Static Breadcrumbs</div>,
              },
            }}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('static-breadcrumbs')).toBeInTheDocument();
      expect(container.querySelector('.cio-groups-breadcrumbs')).not.toBeInTheDocument();
    });

    it('Should accept static ReactNode as override (not a function) for optionsList', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              optionsList: {
                reactNode: <div data-testid='static-options'>Static Options</div>,
              },
            }}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('static-options')).toBeInTheDocument();
      expect(container.querySelector('.cio-filter-groups-options-list ul')).not.toBeInTheDocument();
    });

    it('Should accept static ReactNode as override (not a function) for root', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              reactNode: <div data-testid='static-root'>Static Root</div>,
            }}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('static-root')).toBeInTheDocument();
      expect(container.querySelector('.cio-groups-container')).not.toBeInTheDocument();
    });

    it('Should suppress all nested slot renders when a root override is supplied', () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              reactNode: () => <div data-testid='root-override'>Root</div>,
            }}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('root-override')).toBeInTheDocument();
      expect(container.querySelector('.cio-groups-container')).not.toBeInTheDocument();
      expect(container.querySelector('.cio-filter-header')).not.toBeInTheDocument();
      expect(container.querySelector('.cio-groups-breadcrumbs')).not.toBeInTheDocument();
      expect(container.querySelector('.cio-filter-groups-options-list')).not.toBeInTheDocument();
    });

    it('Should support toggleIsCollapsed via override render props', () => {
      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              header: {
                reactNode: ({ isCollapsed, toggleIsCollapsed }) => (
                  <button data-testid='custom-toggle' type='button' onClick={toggleIsCollapsed}>
                    {isCollapsed ? 'closed' : 'open'}
                  </button>
                ),
              },
            }}
          />
        </CioPlp>,
      );

      const toggle = screen.getByTestId('custom-toggle');
      expect(toggle).toHaveTextContent('open');

      fireEvent.click(toggle);
      expect(toggle).toHaveTextContent('closed');

      fireEvent.click(toggle);
      expect(toggle).toHaveTextContent('open');
    });

    describe('isolation - overriding one slot should not affect others', () => {
      const isolationCases = [
        {
          overrideKey: 'header',
          expectPresent: ['.cio-groups-breadcrumbs', '.cio-filter-groups-options-list'],
          description: 'breadcrumbs and optionsList still render when only header is overridden',
        },
        {
          overrideKey: 'breadcrumbs',
          expectPresent: ['.cio-filter-header', '.cio-filter-groups-options-list'],
          description: 'header and optionsList still render when only breadcrumbs is overridden',
        },
        {
          overrideKey: 'optionsList',
          expectPresent: ['.cio-filter-header', '.cio-groups-breadcrumbs'],
          description: 'header and breadcrumbs still render when only optionsList is overridden',
        },
      ];

      it.each(isolationCases)('$description', ({ overrideKey, expectPresent }) => {
        const overrides = { [overrideKey]: { reactNode: () => <div>Custom</div> } };

        const { container } = render(
          <CioPlp apiKey={DEMO_API_KEY}>
            <Groups {...groupsProps} componentOverrides={overrides} />
          </CioPlp>,
        );

        expectPresent.forEach((selector) => {
          expect(container.querySelector(selector)).toBeInTheDocument();
        });
      });
    });
  });

  describe(' - componentOverrides.groups Tests (via provider)', () => {
    it('Should render default Groups when no componentOverrides provided', async () => {
      const { container, getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(getByText('Categories')).toBeInTheDocument();
        const header = container.querySelector('.cio-filter-header');
        expect(header).toBeInTheDocument();
        expect(header.querySelector('.cio-arrow')).toBeInTheDocument();
      });
    });

    it('Should replace entire Groups via root reactNode override from provider', async () => {
      const { container } = render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{
            groups: {
              reactNode: ({ groups }) => (
                <div data-testid='custom-root'>{groups[0].displayName} Override</div>
              ),
            },
          }}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-root')).toBeInTheDocument();
        expect(container.querySelector('.cio-groups-container')).not.toBeInTheDocument();
      });
    });

    it('Should replace header via header override from provider', async () => {
      const { container } = render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{
            groups: {
              header: {
                reactNode: ({ toggleIsCollapsed }) => (
                  <div data-testid='custom-header' onClick={toggleIsCollapsed}>
                    Custom Header
                  </div>
                ),
              },
            },
          }}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-header')).toBeInTheDocument();
        expect(container.querySelector('.cio-filter-header')).not.toBeInTheDocument();
      });
    });

    it('Should replace breadcrumbs via breadcrumbs override from provider', async () => {
      const { container } = render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{
            groups: {
              breadcrumbs: {
                reactNode: () => <div data-testid='custom-breadcrumbs'>Custom Breadcrumbs</div>,
              },
            },
          }}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-breadcrumbs')).toBeInTheDocument();
        expect(container.querySelector('.cio-groups-breadcrumbs')).not.toBeInTheDocument();
      });
    });

    it('Should replace optionsList via optionsList override from provider', async () => {
      render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{
            groups: {
              optionsList: {
                reactNode: () => <div data-testid='custom-options'>Custom Options</div>,
              },
            },
          }}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-options')).toBeInTheDocument();
      });
    });

    it('Should pass GroupsRenderProps to override functions from provider', async () => {
      const renderFn = jest.fn().mockReturnValue(<div>Override</div>);

      render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{
            groups: {
              header: { reactNode: renderFn },
            },
          }}>
          <Groups {...groupsProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(renderFn).toHaveBeenCalled();
        const renderProps = renderFn.mock.calls[0][0];

        expect(renderProps.groups).toBeDefined();
        expect(Array.isArray(renderProps.groups)).toBe(true);
        expect(typeof renderProps.isCollapsed).toBe('boolean');
        expect(typeof renderProps.toggleIsCollapsed).toBe('function');
        expect(typeof renderProps.onOptionSelect).toBe('function');
        expect(typeof renderProps.goToGroupFilter).toBe('function');
      });
    });

    it('Should prefer direct prop overrides over provider overrides', () => {
      render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          componentOverrides={{
            groups: {
              header: {
                reactNode: () => <div data-testid='provider-header'>Provider Header</div>,
              },
            },
          }}>
          <Groups
            {...groupsProps}
            componentOverrides={{
              header: {
                reactNode: () => <div data-testid='prop-header'>Prop Header</div>,
              },
            }}
          />
        </CioPlp>,
      );

      expect(screen.getByTestId('prop-header')).toBeInTheDocument();
      expect(screen.queryByTestId('provider-header')).not.toBeInTheDocument();
    });
  });

  describe(' - Behavior Tests', () => {
    // Function to emulate filtering down
    function findGroup(groups, groupId) {
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

    function TestGroups() {
      const [currentUrl, setCurrentUrl] = useState(testJsonEncodedUrl);
      const [filters, setFilters] = useState('');

      useEffect(() => {
        if (currentUrl !== '') {
          const { filters: requestFilters } = getStateFromUrl(currentUrl);
          setFilters(JSON.stringify(requestFilters));
        }
      }, [currentUrl]);

      // Use mocks instead of relying on API requests for demo
      const { filters: requestFilters } = getStateFromUrl(currentUrl);
      const currentGroupId = requestFilters?.group_id?.[0]?.toString() || 'all';
      let mockedGroups = groupsProps.groups;
      if (currentGroupId) {
        const currentGroup = findGroup(mockedGroups, currentGroupId);

        if (currentGroup) {
          mockedGroups = [currentGroup];
        } else {
          mockedGroups = [];
        }
      }

      return (
        <CioPlp
          apiKey={DEMO_API_KEY}
          urlHelpers={{ setUrl: setCurrentUrl, getUrl: () => currentUrl }}>
          <Groups groups={mockedGroups} />
          <div id='request-filters'>{filters}</div>;
        </CioPlp>
      );
    }

    const getRequestFilters = (container) =>
      JSON.parse(container.querySelector(`#request-filters`).textContent);

    const currentGroup = { displayName: 'All', groupId: 'all' };
    const firstLevelGroup = { displayName: 'All Greeting Cards', groupId: '1' };
    const secondLevelGroup = { displayName: 'Halloween Greeting Cards', groupId: '12' };

    it('Upon clicking a selected option, should navigate to the next level hierarchy', async () => {
      const { container, getByText } = render(<TestGroups />);

      fireEvent.click(getByText(firstLevelGroup.displayName));

      await waitFor(() => {
        const requestFilters = getRequestFilters(container);
        expect(requestFilters.group_id[0]).toBe(firstLevelGroup.groupId);
        const firstLevelGroupCrumb = container.querySelectorAll('.cio-groups-crumb')[1];
        const secondLevelGroupEl = container.querySelectorAll('.cio-filter-option-name')[0];

        expect(firstLevelGroupCrumb).not.toBeUndefined();
        expect(firstLevelGroupCrumb.textContent).toBe(firstLevelGroup.displayName);
        expect(secondLevelGroupEl).not.toBeUndefined();
        expect(secondLevelGroupEl.textContent).toBe(secondLevelGroup.displayName);
      });
    });

    it('Upon clicking base breadcrumb, should navigate back to base group with no filters', async () => {
      const { container, getByText } = render(<TestGroups />);

      // Navigate to first level group
      fireEvent.click(getByText(firstLevelGroup.displayName));

      await waitFor(() => {
        const baseGroupCrumb = container.querySelectorAll('.cio-groups-crumb')[0];

        expect(baseGroupCrumb.nodeName).toBe('BUTTON');

        if (baseGroupCrumb.nodeName === 'BUTTON') {
          // Navigate back to base group
          fireEvent.click(baseGroupCrumb);
        }
      });

      await waitFor(() => {
        const requestFilters = getRequestFilters(container);
        const breadcrumbs = container.querySelectorAll('.cio-groups-crumb');
        const firstLevelOptionEl = container.querySelectorAll('.cio-filter-option-name')[0];

        expect(requestFilters.group_id).toBeUndefined();
        expect(breadcrumbs.length).toBe(1);
        expect(breadcrumbs[0].textContent).toBe(currentGroup.displayName);
        expect(firstLevelOptionEl).not.toBeUndefined();
        expect(firstLevelOptionEl.textContent).toBe(firstLevelGroup.displayName);
      });
    });

    it('Upon clicking nested breadcrumb, should navigate back to group with correct groupId filters', async () => {
      const { container, getByText } = render(<TestGroups />);

      // Navigate to first level group
      fireEvent.click(getByText(firstLevelGroup.displayName));

      await waitFor(() => {
        const secondLevelGroupEl = container.querySelectorAll('.cio-filter-option-name')[0];

        expect(secondLevelGroupEl.textContent).toBe(secondLevelGroup.displayName);

        if (secondLevelGroupEl.textContent === secondLevelGroup.displayName) {
          // Navigate to second level group
          fireEvent.click(secondLevelGroupEl);
        }
      });

      await waitFor(() => {
        const breadcrumbs = container.querySelectorAll('.cio-groups-crumb');
        expect(breadcrumbs.length).toBe(3);

        if (breadcrumbs.length === 3) {
          const firstLevelBreadcrumbEl = breadcrumbs[1];

          // Navigate back to first level group
          fireEvent.click(firstLevelBreadcrumbEl);
        }
      });

      await waitFor(() => {
        const requestFilters = getRequestFilters(container);
        const breadcrumbs = container.querySelectorAll('.cio-groups-crumb');
        const secondLevelGroupEl = container.querySelectorAll('.cio-filter-option-name')[0];

        expect(requestFilters.group_id[0]).not.toBeUndefined();
        expect(requestFilters.group_id[0]).toBe(firstLevelGroup.groupId);
        expect(breadcrumbs.length).toBe(2);
        expect(breadcrumbs[0].textContent).toBe(currentGroup.displayName);
        expect(breadcrumbs[1].textContent).toBe(firstLevelGroup.displayName);
        expect(secondLevelGroupEl).not.toBeUndefined();
        expect(secondLevelGroupEl.textContent).toBe(secondLevelGroup.displayName);
      });
    });
  });
});
