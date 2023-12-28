import { renderHook, waitFor } from '@testing-library/react';
import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import mockResponse from './local_examples/apiResponse.json';
import { DEMO_API_KEY } from '../src/constants';
import useBrowseResults from '../src/hooks/useBrowseResults';

describe('Testing Hook: useBrowseResults', () => {
  let clientGetBrowseResultsSpy;
  let ConstructorIO;

  beforeEach(() => {
    ConstructorIO = new ConstructorIOClient({ apiKey: DEMO_API_KEY });
    clientGetBrowseResultsSpy = jest.spyOn(ConstructorIO.browse, 'getBrowseResults');
    clientGetBrowseResultsSpy.mockImplementationOnce(() => Promise.resolve(mockResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  test('Should return a PlpBrowseResponse Object', async () => {
    const { result } = renderHook(
      () => useBrowseResults('group_id', '123', { cioClient: ConstructorIO }),
      {},
    );

    await waitFor(() => {
      const response = result?.current.browseResults;

      expect(response?.resultId).not.toBeUndefined();
      expect(response?.totalNumResults).not.toBeUndefined();
      expect(response?.refinedContent).not.toBeUndefined();
      expect(response?.groups).not.toBeUndefined();
      expect(response?.results?.length).not.toBeUndefined();
      expect(response?.facets?.length).not.toBeUndefined();
      expect(response?.sortOptions?.length).not.toBeUndefined();
      expect(response?.rawResponse).not.toBeUndefined();
    });
  });

  test('Should pass along parameters properly', async () => {
    const filters = { Color: ['Phantom Ink'] };
    const page = 2;
    const resultsPerPage = 100;
    renderHook(
      () =>
        useBrowseResults('group_id', '123', {
          cioClient: ConstructorIO,
          browseParams: { page, filters, resultsPerPage },
        }),
      {},
    );

    await waitFor(() => {
      expect(clientGetBrowseResultsSpy).toHaveBeenCalledWith('group_id', '123', {
        page,
        filters,
        resultsPerPage,
      });
    });
  });

  test('Should throw error if client is not available', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    expect(() => renderHook(() => useBrowseResults('group_id', '123', {}), {})).toThrow();
    spy.mockRestore();
  });
});
