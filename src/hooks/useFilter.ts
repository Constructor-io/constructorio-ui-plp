/* eslint-disable @typescript-eslint/no-unused-vars */
import { PlpFacet } from '../types';
import SampleFacets from '../../spec/local_examples/sampleFacets.json';

export type UseFilterProps = any;
export type UseFilterReturn = any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function useFilter(props: any) {
  return {
    facets: SampleFacets as Array<PlpFacet>,
    setFilter: (
      facetName: string,
      value: string | number | boolean | Array<string | number | boolean>,
    ) => {},
  };
}
