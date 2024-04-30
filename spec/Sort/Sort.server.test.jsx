import React from 'react';
import { renderToString } from 'react-dom/server';
import Sort from '../../src/components/Sort/Sort';
import CioPlp from '../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../src/constants';
import '@testing-library/jest-dom';
import { transformSearchResponse } from '../../src/utils/transformers';
import mockSearchResponse from '../local_examples/apiSearchResponse.json';

describe('Testing Component on the server: Sort', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  const searchResponse = transformSearchResponse(mockSearchResponse);
  const responseSortOptions = searchResponse.sortOptions;

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => renderToString(<Sort searchOrBrowseResponse={searchResponse} />)).toThrow();
  });

  it('Should render sort options based on search or browse response', async () => {
    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort searchOrBrowseResponse={searchResponse} />
      </CioPlp>,
    );

    responseSortOptions.forEach((option) => {
      expect(html).toContain(option.displayName);
    });
  });

  it('Should render correctly with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Sort</div>);

    const sortProps = {
      searchOrBrowseResponse: searchResponse,
      children: mockChildren,
    };

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Sort {...sortProps} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(html).toContain('Custom Sort');
  });
});
