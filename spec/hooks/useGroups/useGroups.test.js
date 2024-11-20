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

  it('Should apply group filter correctly', async () => {
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

  it('Should replace group filter if exists', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      setGroup(testGroupA);
      setGroup(testGroupB);

      expect(window.location.href.indexOf('groupId')).toBeGreaterThanOrEqual(0);
      expect(window.location.href.indexOf(testGroupA)).toBe(-1);
      expect(window.location.href.indexOf(testGroupB)).toBeGreaterThanOrEqual(0);
    });
  });

  it('Should remove a filter if value == null', async () => {
    const { result } = renderHookWithCioPlp(() => useGroups(useGroupsProps));

    await waitFor(() => {
      const {
        current: { setGroup },
      } = result;

      setGroup(testGroupA);
      setGroup(null);

      expect(window.location.href.indexOf('groupId')).toBe(-1);
      expect(window.location.href.indexOf(testGroupA)).toBe(-1);
    });
  });
});
