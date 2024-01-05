import testRequestState from './local_examples/sampleRequestState.json';
import testUrl from './local_examples/sampleEncodedUrl.json';
import { decodeStateFromUrl, encodeStateToUrl, defaultQueryStringMap } from '../src/utils/encoders';

describe('Testing Default Encoders: encodeStateToUrl', () => {
  test('Should encode all request parameters as defined in defaultQueryStringMap', () => {
    const url = new URL(
      encodeStateToUrl(testRequestState, { url: 'https://www.example.com/a/random/path' }),
    );
    const params = url.searchParams;

    const query = params.get(defaultQueryStringMap.query);
    expect(query).toBe('item');

    const filterName = params.get(defaultQueryStringMap.filterName);
    expect(filterName).toBe('group_id');

    const filterValue = params.get(defaultQueryStringMap.filterValue);
    expect(filterValue).toBe('Styles');

    const filters = params.get(defaultQueryStringMap.filters);
    expect(filters).toBe('[["price","5-100"],["test","testValue"],["lowestPrice",100]]');

    const page = params.get(defaultQueryStringMap.page);
    expect(page).toBe('3');

    const offset = params.get(defaultQueryStringMap.offset);
    expect(offset).toBe('24');

    const resultsPerPage = params.get(defaultQueryStringMap.resultsPerPage);
    expect(resultsPerPage).toBe('30');

    const sortBy = params.get(defaultQueryStringMap.sortBy);
    expect(sortBy).toBe('price');

    const sortOrder = params.get(defaultQueryStringMap.sortOrder);
    expect(sortOrder).toBe('descending');

    const section = params.get(defaultQueryStringMap.section);
    expect(section).toBe('Products');
  });
});

describe('Testing Default Encoders: decodeStateFromUrl', () => {
  test('Should decode all request parameters as defined in defaultQueryStringMap', () => {
    const state = decodeStateFromUrl(testUrl);

    expect(typeof state.query).toBe('string');
    expect(state.query).toBe('item');

    expect(typeof state.filterName).toBe('string');
    expect(state.filterName).toBe('group_id');

    expect(typeof state.filterValue).toBe('string');
    expect(state.filterValue).toBe('Styles');

    expect(typeof state.filters).toBe('object');
    expect(state.filters).toEqual({
      price: '5-100',
      test: 'testValue',
      lowestPrice: 100,
    });

    expect(typeof state.sortBy).toBe('string');
    expect(state.sortBy).toBe('price');

    expect(typeof state.sortOrder).toBe('string');
    expect(state.sortOrder).toBe('descending');

    expect(typeof state.section).toBe('string');
    expect(state.section).toBe('Products');

    expect(typeof state.fmtOptions).toBe('undefined');
    expect(typeof state.preFilterExpression).toBe('undefined');
    expect(typeof state.variationsMap).toBe('undefined');
    expect(typeof state.qsParam).toBe('undefined');
  });
});
