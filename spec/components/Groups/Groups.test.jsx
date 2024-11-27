import '@testing-library/jest-dom';
import React, { useEffect, useState } from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
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

    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
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

      const allBreadcrumbEl = container.querySelectorAll('.cio-crumb')[0];
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

      const allBreadcrumbEl = container.querySelectorAll('.cio-crumb')[0];
      expect(allBreadcrumbEl).not.toBeUndefined();
      expect(allBreadcrumbEl.textContent).toBe('All');

      const allGreetingCardsCrumbEl = container.querySelectorAll('.cio-crumb')[1];
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
        const firstLevelGroupCrumb = container.querySelectorAll('.cio-crumb')[1];
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
        const baseGroupCrumb = container.querySelectorAll('.cio-crumb')[0];

        expect(baseGroupCrumb.nodeName).toBe('BUTTON');

        if (baseGroupCrumb.nodeName === 'BUTTON') {
          // Navigate back to base group
          fireEvent.click(baseGroupCrumb);
        }
      });

      await waitFor(() => {
        const requestFilters = getRequestFilters(container);
        const breadcrumbs = container.querySelectorAll('.cio-crumb');
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
        const breadcrumbs = container.querySelectorAll('.cio-crumb');
        expect(breadcrumbs.length).toBe(3);

        if (breadcrumbs.length === 3) {
          const firstLevelBreadcrumbEl = breadcrumbs[1];

          // Navigate back to first level group
          fireEvent.click(firstLevelBreadcrumbEl);
        }
      });

      await waitFor(() => {
        const requestFilters = getRequestFilters(container);
        const breadcrumbs = container.querySelectorAll('.cio-crumb');
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
