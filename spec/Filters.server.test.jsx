import React from 'react';
import { renderToString } from 'react-dom/server';
import '@testing-library/jest-dom';
import { DEMO_API_KEY } from '../src/constants';
import CioPlp from '../src/components/CioPlp';
import Filters from '../src/components/Filters';
import mockTransformedFacets from './local_examples/sampleFacets.json';

const mockSearchOrBrowseResponse = { facets: mockTransformedFacets };

describe('Testing Component on the server: Filters', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => renderToString(<Filters facets={mockTransformedFacets} />)).toThrow();
  });

  it('Should render filters based on search or browse response', async () => {
    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Filters response={mockSearchOrBrowseResponse} />
      </CioPlp>,
    );

    mockTransformedFacets.forEach((facetGroup) => {
      expect(html).toContain(facetGroup.displayName);
    });
  });

  it('Should render correctly with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Filters</div>);

    const filterProps = {
      response: mockSearchOrBrowseResponse,
      children: mockChildren,
    };

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Filters {...filterProps} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(html).toContain('Custom Filters');
  });
});
