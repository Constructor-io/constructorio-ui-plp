import React from 'react';
import { renderToString } from 'react-dom/server';
import CioPlpGrid from '../../../src/components/CioPlpGrid';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import { transformSearchResponse } from '../../../src/utils/transformers';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';
import { RequestStatus } from '../../../src/components/CioPlpGrid/reducer';

jest.mock('../../../src/styles.css', () => ({}));
jest.mock('../../../src/hooks/useSearchResults');
jest.mock('../../../src/hooks/useRequestConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({ getRequestConfigs: () => ({ query: 'red' }) })),
}));

describe('Testing Component on the server: CioPlpGrid', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => renderToString(<CioPlpGrid />)).toThrow();
  });

  it('Should render loading state while fetching data', () => {
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: RequestStatus.FETCHING });

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    expect(html).toContain('loading');
  });

  it('Should render title and search results when data is fetched', () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.SUCCESS,
      data: { response: mockSearchData.response },
    });

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    expect(html).toContain(mockSearchData.response.results[0].itemName);
  });

  it('Should render title and search results when when provided initialSearchResponse', async () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid initialSearchResponse={mockSearchResponse} />
      </CioPlp>,
    );

    expect(html).toContain(mockSearchData.response.results[0].itemName);
  });

  it('Should include cnstrc beacon data attributes when when provided initialSearchResponse', async () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.SUCCESS,
      data: mockSearchData,
      query: 'red',
    });

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid initialResponse={mockSearchResponse} />
      </CioPlp>,
    );

    expect(html).toContain('data-cnstrc-search');
    expect(html).toContain(`data-cnstrc-num-results="${mockSearchData.response.totalNumResults}"`);
    expect(html).toContain(`data-cnstrc-result-id="${mockSearchData.resultId}"`);
  });
});
