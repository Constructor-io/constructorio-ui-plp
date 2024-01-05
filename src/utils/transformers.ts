import {
  GetBrowseResultsResponse,
  SearchResponse,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import {
  PlpSearchResponse,
  Item,
  ApiItem,
  PlpBrowseResponse,
  PlpSearchRedirectResponse,
  SearchResponseType,
  Redirect,
} from '../types';

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

function isRedirectResponse(
  response: Partial<SearchResponseType | Redirect>,
): response is Partial<Redirect> {
  return 'redirect' in response;
}

export function transformSearchResponse(
  res: SearchResponse,
): PlpSearchRedirectResponse | PlpSearchResponse {
  const { response } = res;
  // Return PlpSearchRedirectResponse
  if (isRedirectResponse(response)) {
    return {
      resultId: res.result_id,
      redirect: response.redirect!,
      rawResponse: res,
    };
  }

  // Return PlpSearchResponse
  return {
    resultId: res.result_id,
    totalNumResults: response.total_num_results,
    results: response.results!.map((result) => transformResultItem(result, false)),
    facets: response.facets,
    groups: response.groups,
    sortOptions: response.sort_options,
    refinedContent: response.refined_content,
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
