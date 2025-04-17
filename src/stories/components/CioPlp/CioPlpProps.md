### `Formatters`

---

Formatters will be used to modify how certain fields are rendered

| property    | type                        | description           |
| ----------- | --------------------------- | --------------------- |
| formatPrice | `(price: number) => string` | Format price funciton |

### `Callbacks`

---

Callbacks will be composed with the library's internal tracking calls for a given event

| property           | type                                                       | description                            |
| ------------------ | ---------------------------------------------------------- | -------------------------------------- |
| onAddToCart        | `(event: React.MouseEvent, item: Item) => void`            | Product add to cart callback function  |
| onProductCardClick | `(event: React.MouseEvent, item: Item) => void`            | Product click callback function        |
| onSwatchClick      | `(e: React.MouseEvent, clickedSwatch: SwatchItem) => void` | Product swatch click callback function |
| onRedirect         | `(url: string) => void`                                    | Redirect callback function             |

### `ItemFieldGetters`

---

ItemFieldGetters maps the fields sent in the catalog feeds to the fields the libary expects for rendering

| property | type                     | description        |
| -------- | ------------------------ | ------------------ |
| getPrice | `(item: Item) => number` | Get price funciton |

### `UrlHelpers`

---

Url Helpers are used for managing the url and request state

| property              | type                                                                    | description                                                     |
| --------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| getUrl                | `() => string \| undefined`                                             | Get the current url for a page (Default: getting current href)  |
| setUrl                | `(newEncodedUrlState: string) => void`                                  | Set the window href using the provided url                      |
| getStateFromUrl       | `(urlString: string) => RequestConfigs`                                 | Parses the given url string to a request configuration state.   |
| getUrlFromState       | `(state: RequestConfigs, options: QueryParamEncodingOptions) => string` | Convert the request configuration state to a url string.        |
| defaultQueryStringMap | `DefaultQueryStringMap`                                                 | Provides a mapping for the query parameters that is used in URL |

> #### `getUrl`

- Default Implementation

  ```javascript
  function getUrl(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    return window.location.href;
  }
  ```

> #### `setUrl`

- Default Implementation

  ```javascript
  function setUrl(newUrlWithEncodedState: string) {
    if (typeof window === 'undefined') return;
    window.location.href = newUrlWithEncodedState;
  }
  ```

> #### `getStateFromUrl`

- Default Implementation

  ```javascript
  function getStateFromUrl(url: string): RequestConfigs {
    const urlObject = new URL(url);
    const urlParams = urlObject.searchParams;
    const paths = decodeURI(urlObject?.pathname)?.split('/');
    let filterName: string | undefined;
    let filterValue: string | undefined;

    if (paths.length > 0) {
      filterName = 'group_id';
      filterValue = paths[paths.length - 1];
    }

    const rawState = {} as Record<string, string>;
    Object.entries(defaultQueryStringMap).forEach(([key, val]) => {
      const storedVal = urlParams.get(val);
      if (storedVal != null) {
        rawState[key] = storedVal;
      }
    });

    const filters = extractFiltersFromUrl(urlParams);

    const {
      page,
      offset,
      resultsPerPage,
      fmtOptions,
      hiddenFacets,
      hiddenFields,
      variationsMap,
      preFilterExpression,
      ...rest
    } = rawState;

    const state = { ...rest } as RequestConfigs;
    if (page) state.page = Number(page);
    if (offset) state.offset = Number(offset);
    if (resultsPerPage) state.resultsPerPage = Number(resultsPerPage);
    if (filters) state.filters = filters;
    if (filterName) {
      state.filterName = filterName;
      state.filterValue = filterValue;
    }

    return state;
  }
  ```

> #### `getUrlFromState`

- Default Implementation

  ```javascript
  function getUrlFromState(state: RequestConfigs, url: string): string {
  const urlObject = new URL(url);
  let { pathname } = urlObject;

  if (state.filterName && state.filterValue) {
    if (pathname.match(/(group_id|collection_id)\/[^/]+$/)) {
      pathname = pathname.replace(
        /\/(group_id|collection_id)\/[^/]+$/,
        `/${state.filterName}/${state.filterValue}`,
      );
    } else {
      pathname = `/${state.filterName}/${state.filterValue}`;
    }
  }

  const params = new URLSearchParams();

  Object.entries(state).forEach(([key, val]) => {
    if (defaultQueryStringMap[key] === undefined) {
      return;
    }

    let encodedVal: string = '';

    if (key === 'filters' && state.filters) {
      getFilterParamsFromState(params, state.filters);
    } else if (typeof val !== 'string') {
      encodedVal = JSON.stringify(val);
    } else {
      encodedVal = val;
    }

    if (encodedVal) {
      params.set(defaultQueryStringMap[key], encodedVal);
    }
  });

  return `${urlObject.origin}${pathname}?${params.toString()}`;
  }
  ```

> #### `defaultQueryStringMap`

- Default Implementation

  ```javascript
  const defaultQueryStringMap: Readonly<DefaultQueryStringMap> = Object.freeze({
    query: 'q',
    page: 'page',
    offset: 'offset',
    resultsPerPage: 'numResults',
    filters: 'filters',
    sortBy: 'sortBy',
    sortOrder: 'sortOrder',
    section: 'section',
  });
  ```
