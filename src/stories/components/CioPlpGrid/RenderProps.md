| property          | type                                                                                                                                 | description                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------- | ------ | ----------------- |
| status            | `stale                                                                                                                               | fetching                                            | success                                                             | error` | API request state |
| isSearchPage      | `boolean`                                                                                                                            | Indicates whether the current page is a search page |
| isBrowsePage      | `boolean`                                                                                                                            | Indicates whether the current page is a browse page |
| searchQuery       | `string                                                                                                                              | undefined`                                          | Search query string for the current page if exists                  |
| browseFilterName  | `string                                                                                                                              | undefined`                                          | Browse filter name on the current page if exists (e.g., `group_id`) |
| browseFilterValue | `string                                                                                                                              | undefined`                                          | Browse filter value on the current page if exists                   |
| data              | [PlpSearchData](./?path=/docs/hooks-usesearchresults--props) \| [PlpBrowseData](./?path=/docs/hooks-usebrowseresults--props) \| null | API response data                                   |
| sort              | [Sort Options](./?path=/docs/components-sort--code-examples#arguments-passed-to-children-via-render-props)                           | Sort object                                         |
| filters           | [Filter Options](./?path=/docs/components-filters--code-examples#arguments-passed-to-children-via-render-props)                      | Filter object                                       |
| groups            | [Group Options](./?path=/docs/components-groups--code-examples#arguments-passed-to-children-via-render-props)                        | Group object                                        |
| pagination        | [Pagination Options](./?path=/docs/components-pagination--code-examples#arguments-passed-to-children-via-render-props)               | Pagination object                                   |
| refetch           | `() => void`                                                                                                                         | Function that refetches the search / browse data    |

- `data`: API response data includes:

  | property       | type                           | description                                  |
  | -------------- | ------------------------------ | -------------------------------------------- | --------------- | ------------------------------- |
  | resultId       | `string`                       | Result ID of the response                    |
  | request        | `SearchRequestType`            | API returned request object                  |
  | response       | `Nullable<PlpSearchDataResults | PlpSearchDataRedirect                        | PlpBrowseData>` | API transformed response object |
  | rawApiResponse | `Nullable<SearchResponse>`     | API raw response without any transformations |
