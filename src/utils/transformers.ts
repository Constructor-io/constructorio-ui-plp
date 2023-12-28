import {
  GetBrowseResultsResponse,
  SearchResponse,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { PlpSearchResponse, Item, ApiItem, PlpBrowseResponse } from '../types';

export function transformResultItem(item: ApiItem, includeRaw = true): Item {
  const {
    id: itemId,
    url,
    image_url: imageUrl,
    group_ids: groupIds,
    description,
    facets,
    variation_id: variationId,
    ...otherMetadataFields
  }: any = item.data;

  const transformedItem: Item = {
    matchedTerms: item.matched_terms,
    itemName: item.value,
    isSlotted: item.is_slotted,
    labels: item.labels,
    variations: item.variations,
    variationsMap: item.variations_map,

    // Flatten the data object
    itemId,
    url,
    imageUrl,
    groupIds,
    description,
    facets,
    variationId,
    rawResponse: includeRaw ? item : undefined,

    // Remaining unmapped metadata fields
    data: otherMetadataFields,
  };

  return transformedItem;
}

export function transformSearchResponse(res: SearchResponse) {
  return {
    resultId: res.result_id,
    totalNumResults: res.response.total_num_results,
    numResultsPerPage: res.request.num_results_per_page,
    results: res.response.results.map((result) => transformResultItem(result, false)),
    facets: res.response.facets,
    groups: res.response.groups,
    sortOptions: res.response.sort_options,
    refinedContent: res.response.refined_content,
    rawResponse: res,
  } as PlpSearchResponse;
}

export function transformBrowseResponse(res: GetBrowseResultsResponse) {
  return {
    resultId: res.result_id,
    totalNumResults: res.response!.total_num_results,
    results: res.response!.results!.map((result) => transformResultItem(result, false)),
    facets: res.response!.facets,
    groups: res.response!.groups,
    sortOptions: res.response!.sort_options,
    refinedContent: res.response!.refined_content,
    rawResponse: res,
  } as PlpBrowseResponse;
}
