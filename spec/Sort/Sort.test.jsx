import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import Sort from '../../src/components/Sort/Sort';
import CioPlp from '../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../src/constants';
import '@testing-library/jest-dom';
import { transformSearchResponse } from '../../src/utils/transformers';
import mockSearchResponse from '../local_examples/apiSearchResponse.json';

describe('Testing Component: Sort', () => {
  let location;
  const mockLocation = new URL('https://example.com');

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    location = window.location;
    delete window.location;
    window.location = mockLocation;
    mockLocation.href = 'https://example.com/';
  });

  afterAll(() => {
    window.location = location;
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  const searchResponse = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchResponse.sortOptions;

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => render(<Sort searchOrBrowseResponse={searchResponse} />)).toThrow();
  });

  it('Should render sort options based on search or browse response', async () => {
    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort searchOrBrowseResponse={searchResponse} />
      </CioPlp>,
    );

    await waitFor(() => {
      responseSortOptions.forEach((option) => {
        expect(getByText(option.displayName)).toBeInTheDocument();
      });
    });
  });

  it('Should change selected sort option in component correctly', async () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort searchOrBrowseResponse={searchResponse} />
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
        <Sort searchOrBrowseResponse={searchResponse} />
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
      searchOrBrowseResponse: searchResponse,
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
