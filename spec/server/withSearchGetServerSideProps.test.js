import ConstructorIONode from '@constructor-io/constructorio-node';
import qs from 'qs';
import { withSearchGetServerSideProps } from '../../src/server/index';

jest.mock('@constructor-io/constructorio-node');
jest.mock('qs');

describe('withSearchGetServerSideProps', () => {
  const cioConfig = { apiKey: 'testKey' };
  let mockGetServerSidePropsFunc;
  let mockContext;

  beforeEach(() => {
    mockGetServerSidePropsFunc = jest.fn().mockResolvedValue({ props: {} });
    ConstructorIONode.mockImplementation(() => ({
      search: { getSearchResults: jest.fn().mockResolvedValue('searchResults') },
    }));
    qs.parse.mockReturnValue({});

    mockContext = {
      req: {
        url: 'https://example.com?foo=bar',
        // Add any other required properties for the request
      },
      // Add any other required properties for the context
    };
  });

  it.only('calls ConstructorIONode with correct parameters', async () => {
    await withSearchGetServerSideProps(cioConfig, mockGetServerSidePropsFunc)(mockContext);
    expect(ConstructorIONode).toHaveBeenCalledWith(expect.objectContaining(cioConfig));
  });

  it('parses query parameters correctly', async () => {
    const queryString = 'foo=bar';
    mockContext.req.url = `https://example.com?${queryString}`;
    await withSearchGetServerSideProps(cioConfig, mockGetServerSidePropsFunc)(mockContext);
    expect(qs.parse).toHaveBeenCalledWith(queryString);
  });

  it('handles nested query parameters correctly', async () => {
    const queryString = 'foo[bar]=baz';
    mockContext.req.url = `https://example.com?${queryString}`;
    qs.parse.mockReturnValueOnce({ foo: { bar: 'baz' } });
    await withSearchGetServerSideProps(cioConfig, mockGetServerSidePropsFunc)(mockContext);
    expect(qs.parse).toHaveBeenCalledWith(queryString);
  });

  it('merges props correctly from getServerSidePropsFunc', async () => {
    mockGetServerSidePropsFunc.mockResolvedValueOnce({ props: { existingProp: 'value' } });
    const result = await withSearchGetServerSideProps(
      cioConfig,
      mockGetServerSidePropsFunc,
    )(mockContext);
    expect(result.props).toHaveProperty('existingProp', 'value');
    expect(result.props).toHaveProperty('cioPlpClient.initialSearchResults', 'searchResults');
  });

  it('handles errors from ConstructorIONode', async () => {
    ConstructorIONode.mockImplementation(() => ({
      search: { getSearchResults: jest.fn().mockRejectedValue(new Error('ConstructorIO Error')) },
    }));
    mockGetServerSidePropsFunc.mockResolvedValueOnce({ props: {} });

    await expect(
      withSearchGetServerSideProps(cioConfig, mockGetServerSidePropsFunc)(mockContext),
    ).rejects.toThrow('ConstructorIO Error');
  });

  it('handles errors from getServerSidePropsFunc', async () => {
    mockGetServerSidePropsFunc.mockRejectedValueOnce(new Error('getServerSideProps Error'));

    await expect(
      withSearchGetServerSideProps(cioConfig, mockGetServerSidePropsFunc)(mockContext),
    ).rejects.toThrow('getServerSideProps Error');
  });

  it('handles malformed query strings', async () => {
    mockContext.req.url = 'https://example.com?malformed[query';
    mockGetServerSidePropsFunc.mockResolvedValueOnce({ props: {} });

    // Assuming qs.parse returns an empty object or similar for malformed queries
    const result = await withSearchGetServerSideProps(
      cioConfig,
      mockGetServerSidePropsFunc,
    )(mockContext);
    expect(result.props).toHaveProperty('cioPlpClient');
    // Additional assertions based on how you handle malformed queries
  });

  it('handles missing query strings', async () => {
    mockContext.req.url = 'https://example.com';
    mockGetServerSidePropsFunc.mockResolvedValueOnce({ props: {} });

    const result = await withSearchGetServerSideProps(
      cioConfig,
      mockGetServerSidePropsFunc,
    )(mockContext);
    expect(result.props).toHaveProperty('cioPlpClient');
    // Assertions to verify handling of missing queries
  });

  it('parses nested query strings correctly', async () => {
    // Test with a nested query string
  });

  it('handles different cioConfig settings', async () => {
    const differentCioConfig = { apiKey: 'differentKey' };
    mockGetServerSidePropsFunc.mockResolvedValueOnce({ props: {} });

    const result = await withSearchGetServerSideProps(
      differentCioConfig,
      mockGetServerSidePropsFunc,
    )(mockContext);
    expect(result.props.cioPlpClient).toHaveProperty('cioConfig', differentCioConfig);
  });

  // More tests for error handling, different context scenarios, etc.
});
