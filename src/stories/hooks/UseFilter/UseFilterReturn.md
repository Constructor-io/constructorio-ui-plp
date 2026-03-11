| property         | type                                                        | description                                                                                               |
| ---------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| facets           | `Array<PlpFacet>`                                           | List of transformed facets returned in the API                                                            |
| setFilter        | `(filterName: string, filterValue: PlpFilterValue) => void` | Function to set the selected filters. Calls `urlHelpers.setUrl` method                                    |
| sliderStep       | `number`                                                    | Global slider step for all range facets                                                                   |
| facetSliderSteps | `Record<string, number>`                                    | Per-facet slider step configuration                                                                       |
| clearFilters     | `() => void`                                                | Function to clear all filters                                                                             |
| getIsCollapsed   | `(facet: PlpFacet) => boolean`                              | Returns whether a facet should render collapsed, based on `collapsedFacets`, `renderCollapsed`, or metadata |
