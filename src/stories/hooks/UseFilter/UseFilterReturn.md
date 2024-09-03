| property  | type                                                        | description                                                            |
| --------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| facets    | `Array<PlpFacet>`                                           | List of transformed facets returned in the API                         |
| setFilter | `(filterName: string, filterValue: PlpFilterValue) => void` | Function to set the selected filters. Calls `urlHelpers.setUrl` method |
