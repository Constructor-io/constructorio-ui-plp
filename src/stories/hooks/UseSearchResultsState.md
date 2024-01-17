```jsx
const searchParams = {

}

const initialSearchResponse {
  results: [
    {
      itemId: 123,
      itemName: 'item'
    },
  ];
}
  const { status, data, pagination, refetch } = useSearchResults({ query: '', searchParams: {}, initialSearchResponse });
```

### Returns

  | property    | type                                   | description                  |
  |-------------|----------------------------------------|------------------------------|
  | status      | `stale | fetching | success | error`   | API request state            |
  | data        | `SearchData`                           | Fetched search data          |
  | pagination  | `PaginationObject`                     | Pagination information       |
  | refetch     | `() => void`                           | Function that refetches the search data|


- `data`: search data including:

  | property       | type                           | description                                 |
  |----------------|--------------------------------|---------------------------------------------|
  | request        | `SearchRequestState`           | API returned request object                 |
  | response       | `SearchResponseState`          | API transformed response object             |
  | redirect       | `RedirectResponseState`        | API transformed redirect object             |
  | rawResponse    | `RawApiResponseState`          | API raw response without any transformations|


- `pagination`: Pagination information including:

  | property             | type                                        | description                                         |
  | :--------------------| :-------------------------------------------| :---------------------------------------------------|
  | currentPage          | `number`                                      | the current page number.                            |
  | goToPage             | `(page: number) => void`                      | Navigate to a specific page                          |
  | nextPage             | `() => void`                                  | Navigate to the next page                           |  
  | prevPage             | `() => void`                                  | Navigate to the previous page                       |
  | totalPages           | `number`                                      | The total number of pages available                 |
  | pages                | `number[]`                                    | Returns an array of numbers `[1,2,3,4,-1,10]`. (-1) represents a placeholder value|