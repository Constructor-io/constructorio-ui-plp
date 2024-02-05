| property            | type                                  | description|
| :-----------------  | --------------------------------------| :--------- |
| query               | `string | null`                       | The search query for Search PLPs |
| filterName          | `'group_id' | 'collection_id' | null` | 'group_id' for Browse Category Pages or 'collection_id' for Browse Collection Pages |
| filterValue         | `string | null`                       | Category or Collection Id for Browse Pages |
| filters             | `Record<string, any> | null`          | Filters to be applied to the result set |
| sortOrder           | `SortOrder | null`                    | Metadata field to sort on. Used together with `sortOrder` |
| sortBy              | `'ascending' | 'descending' | null`   | 'ascending' to sort from lowest to highest and vice-versa for 'descending'. Used together with `sortBy` |
| resultsPerPage      | `number | null`                       | The max number of results to be returned per page |
| page                | `number | null`                       | Page number of the results. Cannot be used together with `offset` |
| offset              | `number | null`                       | Number of results to skip from the beginning. Cannot be used together with `page` |
| section             | `string | null`                       | Constructor.io Index Section to retrieve results from. Defaults to 'Products'  |
| fmtOptions          | `FmtOptions | null`                   | Configuration options to format the data to be returned. |
| variationsMap       | `VariationsMap | null`                | Mapping configuration to return item variations data in a specific format. More details can be found [Here](https://docs.constructor.io/rest_api/variations_mapping/) |
| preFilterExpression | `preFilterExpression | null`          | Complex faceting expression to scope the result set. This applies before other filters. More details can be found [Here](https://docs.constructor.io/rest_api/collections/#add-items-dynamically)|