import { PlpFacet } from '../types';

export type UseFilterProps = any;
export type UseFilterReturn = any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useFilter = (props: any) => ({
  facets: [
    { displayName: 'Test Facet', name: 'test_facet', type: 'multiple', hidden: false } as PlpFacet,
  ],
  applyFilter: (facetName, value) => {},
});

export default useFilter;
