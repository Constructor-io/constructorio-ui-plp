import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CioPlpGrid from '../../../src/components/CioPlpGrid';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';
import '@testing-library/jest-dom';
import { transformSearchResponse } from '../../../src/utils/transformers';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';
import { RequestStatus } from '../../../src/components/CioPlpGrid/reducer';

jest.mock('../../../src/styles.css', () => ({}));
jest.mock('../../../src/hooks/useSearchResults');
jest.mock('../../../src/hooks/useRequestConfigs', () => ({
  __esModule: true,
  default: jest.fn(() => ({ requestConfigs: { query: 'red' }, setRequestConfigs: jest.fn() })),
}));

const originalWindowLocation = window.location;

describe('Testing Component: CioPlpGrid', () => {
  beforeEach(() => {
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
    jest.resetAllMocks();
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => render(<CioPlpGrid />)).toThrow();
  });

  it('Should render spinner while fetching data', async () => {
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: RequestStatus.FETCHING });

    const { getByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => expect(getByTestId('cio-spinner')).toBeInTheDocument());
  });

  it('Should not render spinner if data has been fetched', async () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.SUCCESS,
      data: { response: mockSearchData.response },
    });

    const { queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByTestId('cio-spinner')).toBeFalsy());
  });

  it('Should not render spinner if there has been an error while fetching data', async () => {
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.ERROR,
      data: {
        response: null,
      },
    });

    const { queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByTestId('cio-spinner')).toBeFalsy());
  });

  it('Should not render custom spinner if there has been an error while fetching data', async () => {
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.ERROR,
      data: {
        response: null,
      },
    });

    const { queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByText('spinner')).toBeFalsy());
  });

  it('Should not render custom spinner if data has been fetched', async () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.SUCCESS,
      data: { response: mockSearchData.response },
    });

    const { queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => expect(queryByText('spinner')).toBeFalsy());
  });

  it('Should render custom spinner while fetching data if provided', async () => {
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({ status: RequestStatus.FETCHING });

    const { getByText, queryByTestId } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid spinner={<div>spinner</div>} />
      </CioPlp>,
    );

    await waitFor(() => {
      expect(getByText('spinner')).toBeInTheDocument();
      expect(queryByTestId('cio-spinner')).toBeFalsy();
    });
  });

  it('Should render results when data is fetched', async () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);
    const mockUseSearchResults = require('../../../src/hooks/useSearchResults').default;
    mockUseSearchResults.mockReturnValue({
      status: RequestStatus.SUCCESS,
      data: { response: mockSearchData.response },
    });

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid />
      </CioPlp>,
    );

    await waitFor(() =>
      expect(getByText(mockSearchData.response.results[0].itemName)).toBeInTheDocument(),
    );
  });

  it('Should render results when provided with initialSearchResponse', async () => {
    const mockSearchData = transformSearchResponse(mockSearchResponse);

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <CioPlpGrid initialSearchResponse={mockSearchResponse} />
      </CioPlp>,
    );

    await waitFor(() =>
      expect(getByText(mockSearchData.response.results[0].itemName)).toBeInTheDocument(),
    );
  });
});
