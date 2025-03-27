| property   | type                                                                                                                                 | description                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ------- | ------ | ----------------- |
| status     | `stale                                                                                                                               | fetching                                | success | error` | API request state |
| data       | [PlpSearchData](./?path=/docs/hooks-usesearchresults--props) \| [PlpBrowseData](./?path=/docs/hooks-usebrowseresults--props) \| null | API response data                       |
| refetch    | `() => void`                                                                                                                         | Function that refetches the search data |
| sort       | [UseSortReturn](./?path=/docs/components-sort--code-examples#arguments-passed-to-children-via-render-props)                          | Sort object                             |
| filters    | [UseFilterReturn](./?path=/docs/components-filters--code-examples#arguments-passed-to-children-via-render-props)                     | Filter object                           |
| pagination | [UsePaginationReturn](./?path=/docs/components-pagination--code-examples#arguments-passed-to-children-via-render-props)              | Pagination object                       |

- `data`: response data including:

  | property       | type                          | description                                  |
  | -------------- | ----------------------------- | -------------------------------------------- |
  | resultId       | `string`                      | Result ID of the response                    |
  | request        | `SearchRequestType`           | API returned request object                  |
  | response       | `Nullable<PlpSearchResponse>` | API transformed response object              |
  | rawApiResponse | `Nullable<SearchResponse>`    | API raw response without any transformations |
