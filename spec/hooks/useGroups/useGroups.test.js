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

  it('Should return groups array', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { groups },
      } = result;

      expect(groups).toHaveLength(searchData.response.groups.length);
      expect(groups).toEqual(searchData.response.groups);
    });
  });

  it('setGroup should apply group filter correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      setGroup(testGroupA);

      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
    });
  });

  it('setGroup should replace group filter if exists', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    result.current.setGroup(testGroupA);

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf(testGroupB)).toBe(-1);
      expect(window.location.href.indexOf(testGroupA)).toBeGreaterThanOrEqual(0);

      setGroup(testGroupB);
    });

    expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
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
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);

      setGroup(null);
    });

    expect(window.location.href.indexOf('groupId')).toBe(-1);
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
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
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
      expect(window.location.href.indexOf('groupId')).toBe(-1);
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
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);

      onOptionSelect(testGroupA);
    });

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(null);
      expect(window.location.href.indexOf('groupId')).toBe(-1);
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
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);

      onOptionSelect(testGroupB);
    });

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(testGroupB);
      expect(window.location.href.indexOf(testGroupB)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
    });
  });

  it('goToGroupFilter should replace the current filter given a breadcrumb', async () => {
    const { result } = renderHookWithCioPlp(() =>
      useGroups({ groups: [searchData.response.groups[0].children[0]] }),
    );

    const breadcrumb = { path: `/${currentGroup}` };
    result.current.goToGroupFilter(breadcrumb);

    await waitFor(() => {
      const {
        current: { selectedGroupId },
      } = result;

      expect(selectedGroupId).toBe(currentGroup);
      expect(window.location.href.indexOf(currentGroup)).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
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
});
