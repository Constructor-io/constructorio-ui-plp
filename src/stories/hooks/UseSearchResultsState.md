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
  | [pagination](../?path=/docs/components-pagination--props#paginations)   | `PaginationObject`                     | Pagination information       |
  | refetch     | `() => void`                           | Function that refetches the search data|


- `data`: search data including:

  | property       | type                           | description                                 |
  |----------------|--------------------------------|---------------------------------------------|
  | request        | `SearchRequestState`           | API returned request object                 |
  | response       | `SearchResponseState`          | API transformed response object             |
  | redirect       | `RedirectResponseState`        | API transformed redirect object             |
  | rawResponse    | `Nullable<SearchResponse>`          | API raw response without any transformations|