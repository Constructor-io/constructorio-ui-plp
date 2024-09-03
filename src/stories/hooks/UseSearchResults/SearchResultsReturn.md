| property | type            | description                             |
| -------- | --------------- | --------------------------------------- | ------- | ------ | ----------------- |
| status   | `stale          | fetching                                | success | error` | API request state |
| data     | `PlpSearchData` | Fetched search results                  |
| message  | `string`        | Error message, if any                   |
| refetch  | `() => void`    | Function that refetches the search data |

- `data`: response data including:

  | property       | type                          | description                                  |
  | -------------- | ----------------------------- | -------------------------------------------- |
  | resultId       | `string`                      | Result ID of the response                    |
  | request        | `SearchRequestType`           | API returned request object                  |
  | response       | `Nullable<PlpSearchResponse>` | API transformed response object              |
  | redirect       | `Nullable<Redirect>`          | API transformed redirect object              |
  | rawApiResponse | `Nullable<SearchResponse>`    | API raw response without any transformations |
