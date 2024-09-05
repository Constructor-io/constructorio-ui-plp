| property           | type                                                        | description                                                         |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| sortOptions        | `Array<PlpSortOption>`                                      | List of transformed facets returned in the API                      |
| selectedSort       | `PlpSortOption`                                             | Selected sort option                                                |
| changeSelectedSort | `(filterName: string, filterValue: PlpFilterValue) => void` | Function to set the selected sort. Calls `urlHelpers.setUrl` method |
