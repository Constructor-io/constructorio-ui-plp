import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import Sort from '../../../src/components/Sort';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import '@testing-library/jest-dom';
import { transformSearchResponse } from '../../../src/utils/transformers';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';

describe('Testing Component: Sort', () => {
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

  const searchData = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchData.response.sortOptions;

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => render(<Sort sortOptions={searchData.response.sortOptions} />)).toThrow();
  });

  it('Should render sort options based on search or browse response', async () => {
    const { getAllByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    await waitFor(() => {
      responseSortOptions.forEach((option) => {
        expect(getAllByText(option.displayName).at(-1)).toBeInTheDocument();
      });
    });
  });

  it('Should change selected sort option in component correctly', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    const defaultSort = responseSortOptions.find((option) => option.status === 'selected');
    expect(container.querySelector('input:checked')).toBeDefined();
    expect(container.querySelector('input:checked').value).toBe(JSON.stringify(defaultSort));

    const newSortOption = responseSortOptions.find((option) => option.status !== 'selected');
    fireEvent.click(
      container?.querySelector(`#${newSortOption.sortBy}-${newSortOption.sortOrder}`),
    );

    expect(container.querySelector('input:checked')).toBeDefined();
    expect(container.querySelector('input:checked').value).toBe(JSON.stringify(newSortOption));
  });

  it('Should change selected sort option in url correctly', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort sortOptions={searchData.response.sortOptions} />
      </CioPlp>,
    );

    const newSortOption = responseSortOptions.find((option) => option.status !== 'selected');
    fireEvent.click(
      container?.querySelector(`#${newSortOption.sortBy}-${newSortOption.sortOrder}`),
    );

    const urlObject = new URL(window.location.href);
    expect(urlObject.searchParams.get('sortBy')).toEqual(newSortOption.sortBy);
    expect(urlObject.searchParams.get('sortOrder')).toEqual(newSortOption.sortOrder);
  });

  it('Should render correctly with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Sort</div>);

    const sortProps = {
      sortOptions: searchData.response.sortOptions,
      children: mockChildren,
    };

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort {...sortProps} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(getByText('Custom Sort')).toBeInTheDocument();
  });
});
