import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useGroups from '../../../src/hooks/useGroups';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';
import { transformSearchResponse } from '../../../src/utils/transformers';
import { renderHookWithCioPlp } from '../../test-utils';

describe('Testing Hook: useGroups', () => {
  const originalWindowLocation = window.location;
  const testGroupA = 'W676714'; // Clearance
  const testGroupB = 'W127085'; // Men
  const currentGroup = 'AP01';

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const searchData = transformSearchResponse(mockSearchResponse);
  const useGroupsProps = { groups: searchData.response.groups };

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useGroups())).toThrow();
  });

  it('setGroup should apply group filter correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      setGroup(testGroupA);

      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);
    });
  });

  it('setGroup should replace group filter if exists', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.setGroup(testGroupA);

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf(testGroupB)).toBe(-1);
      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);

      setGroup(testGroupB);
    });

    expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);
    expect(window.location.href.indexOf(testGroupA)).toBe(-1);
    expect(window.location.href.indexOf(testGroupB)).toBeGreaterThanOrEqual(0);
  });

  it('setGroup should remove a filter if value == null', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.setGroup(testGroupA);

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);

      setGroup(null);
    });

    expect(window.location.href.indexOf('group_id')).toBe(-1);
    expect(window.location.href.indexOf(testGroupA)).toBe(-1);
  });

  it('Should return breadcrumbs', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { breadcrumbs },
      } = result;

      expect(breadcrumbs).not.toBeFalsy();
      // useCioBreadcrumbs currently doesn't include the current group
      expect(breadcrumbs).toHaveLength(0);
    });
  });

  it(`Should return currentGroupId as the base group (${currentGroup})`, async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { currentGroupId },
      } = result;

      expect(currentGroupId).toBe(currentGroup);
    });
  });

  it('onOptionSelect should apply group filter correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.onOptionSelect(testGroupA);

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(testGroupA);
      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);
    });
  });

  it('onOptionSelect should not add a filter if the base group is selected', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.onOptionSelect(currentGroup);

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(null);
      expect(window.location.href.indexOf('group_id')).toBe(-1);
      expect(window.location.href.indexOf(currentGroup)).toBe(-1);
    });
  });

  it('onOptionSelect should remove the current filter if passed the currentGroupId', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.onOptionSelect(testGroupA);

    await waitFor(() => {
      const {
        current: { onOptionSelect, selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(testGroupA);
      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);

      onOptionSelect(testGroupA);
    });

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(null);
      expect(window.location.href.indexOf('group_id')).toBe(-1);
      expect(window.location.href.indexOf(testGroupA)).toBe(-1);
    });
  });

  it('onOptionSelect should replace the current filter', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.onOptionSelect(testGroupA);

    await waitFor(() => {
      const {
        current: { onOptionSelect, selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(testGroupA);
      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);

      onOptionSelect(testGroupB);
    });

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(testGroupB);
      expect(window.location.href.indexOf(testGroupB)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);
    });
  });

  it('goToGroupFilter should replace the current filter given a breadcrumb', async () => {
    const { result } = renderHookWithCioPlp(() =>
      useGroups({ groups: [searchData.response.groups[0].children[0].children[0]] }),
    );

    const breadcrumb = { path: `/${currentGroup}/${testGroupA}` };
    result.current.goToGroupFilter(breadcrumb);

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(testGroupA);
      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('group_id')).toBeGreaterThanOrEqual(0);
    });
  });

  it('goToGroupFilter should omit group_id filter given the root breadcrumb', async () => {
    const { result } = renderHookWithCioPlp(() =>
      useGroups({ groups: [searchData.response.groups[0].children[0].children[0]] }),
    );

    const breadcrumb = { path: `/${currentGroup}` };
    result.current.goToGroupFilter(breadcrumb);

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(null);
      expect(window.location.href.indexOf(testGroupA)).toBe(-1);
      expect(window.location.href.indexOf('group_id')).toBe(-1);
    });
  });

  it('Should return props from useOptionsList', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: {
          initialNumOptions,
          isShowAll,
          setIsShowAll,
          optionsToRender,
          setOptionsToRender,
        },
      } = result;

      expect(initialNumOptions).not.toBeUndefined();
      expect(typeof isShowAll).not.toBeUndefined();
      expect(setIsShowAll).not.toBeUndefined();
      expect(optionsToRender).not.toBeUndefined();
      expect(setOptionsToRender).not.toBeUndefined();
    });
  });

  it('Should not return groups that are meant to be excluded via isHiddenGroupFn', async () => {
    const isHiddenGroupFn = (group) => group.groupId === 'W676714';
    const { result } = renderHookWithCioPlp(() =>
      useGroups({ ...useGroupsProps, isHiddenGroupFn }),
    );

    await waitFor(() => {
      const {
        current: { optionsToRender },
      } = result;

      expect(optionsToRender.filter((group) => !isHiddenGroupFn(group)).length).toBe(
        optionsToRender.length,
      );
      expect(optionsToRender.length).toBeLessThan(useGroupsProps.groups[0].children.length);
      const rawOptions = useGroupsProps.groups[0].children;
      const excludedGroups = rawOptions.filter((group) =>
        optionsToRender.find((option) => option.groupId !== group.groupId),
      );
      expect(excludedGroups.find((group) => group.groupId === 'W676714')).toBeTruthy();
    });
  });

  it('Should not return groups that are flagged with groups.data.cio_plp_hidden = true', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups({ ...useGroupsProps }));

    await waitFor(() => {
      const {
        current: { optionsToRender },
      } = result;

      expect(optionsToRender.length).toBeLessThan(useGroupsProps.groups[0].children.length);
      const rawOptions = useGroupsProps.groups[0].children;
      const excludedGroups = rawOptions.filter((group) =>
        optionsToRender.find((option) => option.groupId !== group.groupId),
      );
      expect(excludedGroups.find((group) => group.groupId === 'cio_plp_hidden_group')).toBeTruthy();
    });
  });

  describe('Recursive filtering of nested children', () => {
    it('Should recursively filter out nested children matching isHiddenGroupFn', async () => {
      // Create nested groups structure
      const nestedGroups = [
        {
          groupId: 'root',
          displayName: 'Root',
          count: 100,
          data: null,
          parents: [],
          children: [
            {
              groupId: 'child1',
              displayName: 'Child 1',
              count: 50,
              data: null,
              parents: [],
              children: [
                {
                  groupId: 'grandchild1',
                  displayName: 'Grandchild 1',
                  count: 25,
                  data: null,
                  parents: [],
                  children: [],
                },
                {
                  groupId: 'grandchild2-hidden',
                  displayName: 'Grandchild 2 Hidden',
                  count: 25,
                  data: null,
                  parents: [],
                  children: [],
                },
              ],
            },
            {
              groupId: 'child2',
              displayName: 'Child 2',
              count: 50,
              data: null,
              parents: [],
              children: [],
            },
          ],
        },
      ];

      const isHiddenGroupFn = (group) => group.groupId.includes('hidden');

      const { result } = renderHookWithCioPlp(() =>
        useGroups({ groups: nestedGroups, isHiddenGroupFn }),
      );

      await waitFor(() => {
        const {
          current: { optionsToRender },
        } = result;

        // Should have 2 top-level children (root is the container)
        expect(optionsToRender.length).toBe(2);

        // Find child1 and check its nested children
        const child1 = optionsToRender.find((g) => g.groupId === 'child1');
        expect(child1).toBeDefined();

        // grandchild2-hidden should be filtered out recursively
        expect(child1.children.length).toBe(1);
        expect(child1.children[0].groupId).toBe('grandchild1');
        expect(child1.children.find((g) => g.groupId === 'grandchild2-hidden')).toBeUndefined();
      });
    });

    it('Should recursively filter out nested children with data.cio_plp_hidden = true', async () => {
      const nestedGroups = [
        {
          groupId: 'root',
          displayName: 'Root',
          count: 100,
          data: null,
          parents: [],
          children: [
            {
              groupId: 'child1',
              displayName: 'Child 1',
              count: 50,
              data: null,
              parents: [],
              children: [
                {
                  groupId: 'grandchild1',
                  displayName: 'Grandchild 1',
                  count: 25,
                  data: null,
                  parents: [],
                  children: [],
                },
                {
                  groupId: 'grandchild2',
                  displayName: 'Grandchild 2',
                  count: 25,
                  data: { cio_plp_hidden: true },
                  parents: [],
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      const { result } = renderHookWithCioPlp(() => useGroups({ groups: nestedGroups }));

      await waitFor(() => {
        const {
          current: { optionsToRender },
        } = result;

        // Find child1 and check its nested children
        const child1 = optionsToRender.find((g) => g.groupId === 'child1');
        expect(child1).toBeDefined();

        // grandchild2 should be filtered out due to cio_plp_hidden flag
        expect(child1.children.length).toBe(1);
        expect(child1.children[0].groupId).toBe('grandchild1');
      });
    });
  });
});
