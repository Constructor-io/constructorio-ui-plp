import {
  GetBrowseResultsResponse,
  Redirect,
  SearchResponse,
  SearchResponseType,
  SortOption,
  Facet,
  FacetOption,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import {
  PlpSearchResponse,
  Item,
  ApiItem,
  PlpBrowseResponse,
  PlpSearchRedirectResponse,
  PlpSortOption,
  Variation,
  PlpFacet,
} from '../types';
import { isMultipleOrBucketedFacet, isRangeFacet } from '../utils';

function isAPIRedirectSearchResponse(
  response: Partial<SearchResponseType | Redirect>,
): response is Partial<Redirect> {
  return 'redirect' in response;
}

export function transformResultVariation(variation: ApiItem, includeRaw = true): Variation {
  const {
    url,
    image_url: imageUrl,
    group_ids: groupIds,
    description,
    facets,
    variation_id: variationId,
    ...otherMetadataFields
  }: any = variation.data;

  const transformedVariation: Variation = {
    itemName: variation.value,

    // Flatten the data object
    url,
    imageUrl,
    description,
    facets,
    variationId,
    rawResponse: includeRaw ? variation : undefined,

    // Remaining unmapped metadata fields
    data: otherMetadataFields,
  };

  return transformedVariation;
}

// TODO: transform variations as well
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
    variations: item.variations?.map((variation: ApiItem) => transformResultVariation(variation)),
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

export function transformResponseFacets(facets: Array<Facet>): Array<PlpFacet> {
  return facets.map((facet) => {
    const {
      display_name: displayName,
      name,
      type,
      data,
      hidden,
      min,
      max,
      status,
      options,
    } = facet;

    const transformedFacet = {
      displayName,
      name,
      type,
      data,
      hidden,
    };

    if (isRangeFacet(transformedFacet)) {
      transformedFacet.min = min;
      transformedFacet.max = max;
      transformedFacet.status = status;
    }

    if (isMultipleOrBucketedFacet(transformedFacet)) {
      transformedFacet.options = options.map((option: FacetOption) => ({
        status: option.status,
        count: option.count,
        displayName: option.display_name,
        value: option.value,
        data: option.data,
      }));
    }

    return transformedFacet;
  });
}
export function transformResponseSortOptions(options?: Partial<SortOption>[]): PlpSortOption[] {
  if (options) {
    return options.map(
      (option) =>
        ({
          sortBy: option.sort_by,
          sortOrder: option.sort_order,
          displayName: option.display_name,
          status: option.status,
        }) as PlpSortOption,
    );
  }

  return [];
}

export function transformSearchResponse(
  res: SearchResponse,
): PlpSearchRedirectResponse | PlpSearchResponse {
  const { response } = res;
  // Return PlpSearchRedirectResponse
  if (isAPIRedirectSearchResponse(response)) {
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
    facets: transformResponseFacets(res.response!.facets),
    groups: response.groups,
    sortOptions: transformResponseSortOptions(response.sort_options),
    refinedContent: response.refined_content,
    rawResponse: res,
  } as PlpSearchResponse;
}

export function transformBrowseResponse(res: GetBrowseResultsResponse) {
  return {
    resultId: res.result_id,
    totalNumResults: res.response!.total_num_results,
    numResultsPerPage: res.request?.num_results_per_page,
    results: res.response!.results!.map((result) => transformResultItem(result, false)),
    facets: transformResponseFacets(res.response!.facets as any),
    groups: res.response!.groups,
    sortOptions: transformResponseSortOptions(res.response!.sort_options),
    refinedContent: res.response!.refined_content,
    rawResponse: res,
  } as PlpBrowseResponse;
}
