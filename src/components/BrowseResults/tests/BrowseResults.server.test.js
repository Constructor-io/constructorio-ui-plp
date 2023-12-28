import React from 'react';
import '@testing-library/jest-dom';
import ReactDOMServer from 'react-dom/server';
import { renderToStringWithCioPlpContext } from '../../../../spec/test-utils.server';
import { transformBrowseResponse } from '../../../utils/transformers';
import apiBrowseResponse from '../../../../spec/local_examples/apiBrowseResponse.json';

import BrowseResults from '../index';

jest.mock('../../../hooks/useBrowseResults', () => ({
  __esModule: true, // This property is important when mocking ES6 modules
  default: jest.fn(),
}));

// eslint-disable-next-line import/first
import useBrowseResults from '../../../hooks/useBrowseResults';

describe('BrowseResults: React Server-Side Rendering with initial browse response value', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    // Mock the useBrowseResults hook with apiResponse
    // (this simulates the hook being called with apiResponse as the initial value)
    useBrowseResults.mockImplementation(() => ({
      ...transformBrowseResponse(apiBrowseResponse),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderToStringWithCioPlpContext(
      <BrowseResults
        filterName='category'
        filterValue='electronics'
        initialBrowseResponse={transformBrowseResponse(apiBrowseResponse)}
      />,
    );
  });

  it('throws an error if not rendered within CioPlpContext', () => {
    expect(() => {
      ReactDOMServer.renderToString(
        <BrowseResults
          filterName='category'
          filterValue='electronics'
          initialBrowseResponse={transformBrowseResponse(apiBrowseResponse)}
        />,
      );
    }).toThrow('<BrowseResults /> component must be rendered within CioPlpContext');
  });

  it('renders browse results without render props', () => {
    const html = renderToStringWithCioPlpContext(
      <BrowseResults
        filterName='category'
        filterValue='electronics'
        initialBrowseResponse={transformBrowseResponse(apiBrowseResponse)}
      />,
    );

    expect(html).toEqual(
      '<div>Browse Results</div><div class="cio-results"><a class="cio-product-card" href="no-url"><div class="cio-image-container"><img alt="Linen Pocket Square (Phantom Ink)" src="https://constructorio-integrations.s3.amazonaws.com/tikus-threads/2022-06-29/TIE_POCKET-SQUARE_13317-BNT84_40_category-outfitter.jpg" class="cio-image"/></div><div class="cio-content"><div class="cio-item-price">$28.00</div><div class="cio-item-name">Linen Pocket Square (Phantom Ink)</div><div class="cio-item-swatches">Here lie the swatches</div><div><button type="button">Add to Cart</button></div></div></a><a class="cio-product-card" href="no-url"><div class="cio-image-container"><img alt="The Clubhouse Stretch Belt (Burgundy)" src="https://constructorio-integrations.s3.amazonaws.com/tikus-threads/2022-06-29/BELT_CASUAL-BELT_BNA10872XG1419_40_category-outfitter.jpg" class="cio-image"/></div><div class="cio-content"><div class="cio-item-price">$39.00</div><div class="cio-item-name">The Clubhouse Stretch Belt (Burgundy)</div><div class="cio-item-swatches">Here lie the swatches</div><div><button type="button">Add to Cart</button></div></div></a></div>',
    );
    expect(html).toContain('Browse Results');
    expect(html).toContain('Linen Pocket Square (Phantom Ink)');
    expect(html).toContain('The Clubhouse Stretch Belt (Burgundy)');
    expect(html).toContain('Add to Cart');
  });

  it('renders browse results with render props', () => {
    const html = renderToStringWithCioPlpContext(
      <BrowseResults
        filterName='category'
        filterValue='electronics'
        initialBrowseResponse={transformBrowseResponse(apiBrowseResponse)}>
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

    expect(html).toEqual(
      '<div>Browse Results</div><div class="cio-results"><div>Linen Pocket Square (Phantom Ink)</div><div>The Clubhouse Stretch Belt (Burgundy)</div></div>',
    );
    expect(html).toContain('Browse Results');
    expect(html).toContain('Linen Pocket Square (Phantom Ink)');
    expect(html).toContain('The Clubhouse Stretch Belt (Burgundy)');
  });
});

describe('BrowseResults: React Server-Side Rendering with no initial value', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    // Mock the useBrowseResults hook with no initial value
    // (this simulates the hook being called with no initial value)
    useBrowseResults.mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderToStringWithCioPlpContext(
      <BrowseResults filterName='category' filterValue='electronics' />,
    );
  });

  it('throws an error if not rendered within CioPlpContext', () => {
    expect(() => {
      ReactDOMServer.renderToString(
        <BrowseResults filterName='category' filterValue='electronics' />,
      );
    }).toThrow('<BrowseResults /> component must be rendered within CioPlpContext');
  });

  it('renders browse results without render props', () => {
    const html = renderToStringWithCioPlpContext(
      <BrowseResults filterName='category' filterValue='electronics' />,
    );

    expect(html).toEqual('<div>Browse Results</div><div class="cio-results"></div>');
  });

  it('renders browse results with render props', () => {
    const html = renderToStringWithCioPlpContext(
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

    expect(html).toEqual('<div>Browse Results</div><div class="cio-results"></div>');
  });
});
