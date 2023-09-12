/* eslint-disable import/prefer-default-export */
import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import { PlpSearchResponse } from './types';

export function transformSearchResponse(res: SearchResponse) {
  return {
    resultId: res.result_id,
    totalNumResults: res.response.total_num_results,
    results: res.response.results,
    facets: res.response.facets,
    groups: res.response.groups,
    sortOptions: res.response.sort_options,
    refinedContent: res.response.refined_content,
    rawResponse: res,
  } as PlpSearchResponse;
}
