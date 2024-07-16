import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import useSort from '../src/hooks/useSort';
import { transformSearchResponse } from '../src/utils/transformers';
import mockSearchResponse from './local_examples/apiSearchResponse.json';
import { renderHookWithCioPlp } from './test-utils';

describe('Testing Hook: useSort', () => {
  const originalWindowLocation = window.location;

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

  const searchResponse = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchResponse.sortOptions;

  it('Should throw error if called outside of PlpContext', () => {
    expect(() => renderHook(() => useSort())).toThrow();
  });

  it('Should return sortOptions array', async () => {
    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { sortOptions },
      } = result;

      expect(sortOptions).toHaveLength(responseSortOptions.length);
      expect(sortOptions).toEqual(responseSortOptions);
    });
  });

  it('Should return the default sort option if none is already selected in request configs', async () => {
    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { selectedSort },
      } = result;

      const defaultSort = responseSortOptions.find((option) => option.status === 'selected');
      expect(selectedSort).toEqual(defaultSort);
    });
  });

  it('Should return pre-selected sort option', async () => {
    const sortBy = 'item_name';
    const sortOrder = 'ascending';
    window.location.href = `https://www.example.com/group_id/test?sortBy=${sortBy}&sortOrder=${sortOrder}`;

    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { selectedSort },
      } = result;

      expect(selectedSort.sortBy).toEqual(sortBy);
      expect(selectedSort.sortOrder).toEqual(sortOrder);
    });
  });

  it('Should change selected sort option correctly', async () => {
    const { result } = renderHookWithCioPlp(() => useSort(searchResponse));

    await waitFor(() => {
      const {
        current: { selectedSort, changeSelectedSort },
      } = result;

      changeSelectedSort({
        sortBy: 'item_name',
        sortOrder: 'descending',
        displayName: 'Name Z-A',
      });

      expect(selectedSort.sortBy).toEqual('item_name');
      expect(selectedSort.sortOrder).toEqual('descending');
      expect(selectedSort.displayName).toEqual('Name Z-A');
    });
  });
});
