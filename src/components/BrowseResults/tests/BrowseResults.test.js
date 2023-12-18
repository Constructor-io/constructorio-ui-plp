/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { renderWithCioPlpContext, render, screen } from '../../../../spec/test-utils';
import BrowseResults from '../index';
import apiBrowseResponse from '../../../../spec/local_examples/apiBrowseResponse.json';
import { transformBrowseResponse } from '../../../utils/transformers';

jest.mock('../../../hooks/useBrowseResults', () => {
  return {
    __esModule: true, // This property is important when mocking ES6 modules
    default: jest.fn(),
  };
});

// Then, in your test setup or before your test cases:
// eslint-disable-next-line import/first
import useBrowseResults from '../../../hooks/useBrowseResults';

describe.only('BrowseResults', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  // Mock the useBrowseResults hook

  useBrowseResults.mockImplementation(() => ({
    ...transformBrowseResponse(apiBrowseResponse),
  }));

  it('renders without crashing', () => {
    renderWithCioPlpContext(<BrowseResults filterName='category' filterValue='electronics' />);
  });

  it('throws an error if not rendered within CioPlpContext', () => {
    expect(() => {
      render(<BrowseResults filterName='category' filterValue='electronics' />);
    }).toThrow('<BrowseResults /> component must be rendered within CioPlpContext');
  });

  it('renders browse results without render props', () => {
    const { getByText, getAllByText } = renderWithCioPlpContext(
      <BrowseResults filterName='category' filterValue='electronics' />,
    );

    expect(getByText('Browse Results')).toBeInTheDocument();
    expect(getByText('Linen Pocket Square (Phantom Ink)')).toBeInTheDocument();
    expect(getByText('The Clubhouse Stretch Belt (Burgundy)')).toBeInTheDocument();
    expect(getAllByText('Add to Cart').length).toEqual(apiBrowseResponse.response.results.length);
  });

  it('renders browse results with render props', () => {
    const { getByText } = renderWithCioPlpContext(
      <BrowseResults filterName='category' filterValue='electronics'>
        {(browseResponse) => (
          <>
            <div>Browse Results</div>
            <div className='cio-results'>
              {browseResponse?.results.map((item) => (
                <div key={item.id}>{item.itemName}</div>
              ))}
            </div>
          </>
        )}
      </BrowseResults>,
    );

    expect(getByText('Browse Results')).toBeInTheDocument();
    expect(getByText('Linen Pocket Square (Phantom Ink)')).toBeInTheDocument();
    expect(getByText('The Clubhouse Stretch Belt (Burgundy)')).toBeInTheDocument();
  });
});
