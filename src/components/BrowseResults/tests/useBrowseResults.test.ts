/* eslint-disable import/no-extraneous-dependencies */
import { renderHook, waitFor } from '@testing-library/react';
import { GetBrowseResultsResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import useBrowseResults from '../../../hooks/useBrowseResults';
import { mockConstructorIOClient } from '../../../../spec/test-utils';
import apiBrowseResponse from '../../../../spec/local_examples/apiBrowseResponse.json';
import { transformBrowseResponse } from '../../../utils/transformers';

describe('useBrowseResults', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if CioClient is not provided', () => {
    expect(() => {
      renderHook(() => useBrowseResults('filterName', 'filterValue'));
    }).toThrow('CioClient required');
  });

  it('should call getBrowseResults with the correct parameters', async () => {
    const filterName = 'filterName';
    const filterValue = 'filterValue';
    const browseParams = {
      page: 1,
      resultsPerPage: 20,
      filters: {
        brand: ['brand1', 'brand2'],
        color: ['color1', 'color2'],
      },
      sortBy: 'price',
      sortOrder: 'descending',
      section: 'Products',
      fmtOptions: {
        groups_max_depth: 5,
      },
      preFilterExpression: {
        or: [
          {
            and: [
              { name: 'brand', value: 'brand1' },
              { name: 'color', value: 'color1' },
            ],
          },
        ],
      },
      hiddenFields: ['field1', 'field2'],
      hiddenFacets: ['facet1', 'facet2'],
    };

    renderHook(() =>
      useBrowseResults(filterName, filterValue, {
        cioClient: mockConstructorIOClient,
        browseParams,
      }),
    );

    expect(mockConstructorIOClient.browse.getBrowseResults).toHaveBeenCalledWith(
      filterName,
      filterValue,
      browseParams,
    );
  });

  it('should set the browse response and return it as transformed browse response', async () => {
    const { result } = renderHook(() =>
      useBrowseResults('filterName', 'filterValue', { cioClient: mockConstructorIOClient }),
    );

    expect(result.current).toBeNull();

    await waitFor(() => {
      expect(result.current).toEqual(
        transformBrowseResponse(apiBrowseResponse as GetBrowseResultsResponse),
      );
    });
  });
});
