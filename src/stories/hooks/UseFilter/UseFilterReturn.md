| property          | type                                                        | description                                                            |
| ----------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| facets            | `Array<PlpFacet>`                                           | List of transformed facets returned in the API                         |
| setFilter         | `(filterName: string, filterValue: PlpFilterValue) => void` | Function to set the selected filters. Calls `urlHelpers.setUrl` method |
| sliderStep        | `number`                                                    | Global slider step for all range facets                                |
| facetSliderSteps  | `Record<string, number>`                                    | Per-facet slider step configuration                                    |
| clearFilters      | `() => void`                                                | Function to clear all filters                                          |
| isVisualFilterFn  | `(facet: PlpFacet) => boolean`                              | Callback to determine if a facet should render as visual               |
| getVisualColorHex | `(option: PlpFacetOption) => string \| undefined`           | Callback to resolve a hex color for a filter option                    |
| getVisualImageUrl | `(option: PlpFacetOption) => string \| undefined`           | Callback to resolve an image URL for a filter option                   |
| perFacetConfigs   | `Record<string, FacetConfig>`                               | Per-facet configuration overrides                                      |
| getIsCollapsed    | `(facet: PlpFacet) => boolean`                              | Returns whether a facet should render collapsed, based on `perFacetConfigs`, `defaultCollapsed`, or metadata |
