export default function useRequestConfigs() {
  return {
    // Search
    query: 'red',

    // Browse
    filterName: 'group_id',
    filterValue: 'filterValue',

    // Others
    filters: {},
    page: 1,
    resultsPerPage: 6,
    sortBy: 'relevance',
    sortOrder: 'descending',
    section: 'Products',
  };
}
