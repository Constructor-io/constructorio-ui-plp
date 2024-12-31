| property  | type                                   | description                                                            |
| --------- | -------------------------------------- | ---------------------------------------------------------------------- |
| status    | `stale | fetching | success | error`   | Status of the current request                                          |
| message   | `string`                               | Any error message returned by the API in case the request fails        |
| data      | `PlpBrowseData | null`                 | Data object with the result from API Call                              |
| refetch   | `() => void`                           | Function that can be used to trigger the API get request               | 