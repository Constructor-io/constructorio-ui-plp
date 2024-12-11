import {
  GetBrowseResultsResponse,
  Redirect,
  SearchResponse,
  SearchResponseType,
  SortOption,
  Facet,
  FacetOption,
  Result,
  Nullable,
  Group,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import {
  Item,
  ApiItem,
  PlpSortOption,
  Variation,
  PlpFacet,
  IncludeRawResponse,
  PlpSearchDataRedirect,
  PlpSearchDataResults,
  PlpSearchData,
  PlpBrowseData,
  PlpItemGroup,
} from '../types';
import { isMultipleOrBucketedFacet, isRangeFacet } from '../utils';

function isAPIRedirectSearchResponse(
  response: SearchResponseType | Redirect,
): response is Redirect {
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

  const transformedVariation: IncludeRawResponse<Variation, ApiItem> = {
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

export function transformResultItem(
  item: ApiItem,
  includeRaw = true,
): IncludeRawResponse<Item, ApiItem> {
  const {
    id: itemId,
    url,
    image_url: imageUrl,
    group_ids: groupIds,
    description,
    facets,
    groups,
    variation_id: variationId,
    ...otherMetadataFields
  }: any = item.data;

  const transformedItem: IncludeRawResponse<Item, ApiItem> = {
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
    groups,
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

export function transformItemGroups(groups?: Group[]): PlpItemGroup[] {
  if (groups) {
    return groups.map(
      (itemGroup) =>
        ({
          groupId: itemGroup.group_id,
          displayName: itemGroup.display_name,
          count: itemGroup.count,
          data: itemGroup.data,
          children: transformItemGroups(itemGroup.children),
          parents: transformItemGroups(itemGroup.parents),
        }) as PlpItemGroup,
    );
  }

  return [];
}

export function transformSearchResponse(res: SearchResponse): Nullable<PlpSearchData> {
  const { response, request, result_id: resultId } = res;

  if (!response || !request) return null;

  if (isAPIRedirectSearchResponse(response as SearchResponseType | Redirect)) {
    return {
      resultId,
      request,
      redirect: response.redirect as Redirect,
      rawApiResponse: res,
    } as PlpSearchDataRedirect; // Type override due to partials in client-js
  }

  return {
    resultId,
    request,
    rawApiResponse: res,
    response: {
      totalNumResults: response.total_num_results,
      numResultsPerPage: request.num_results_per_page,
      results: (response.results as Result[]).map((result) => transformResultItem(result, false)),
      facets: transformResponseFacets(response.facets as Facet[]),
      groups: transformItemGroups(response.groups),
      sortOptions: transformResponseSortOptions(response.sort_options),
      refinedContent: response.refined_content,
    },
  } as PlpSearchDataResults; // Type override due to partials in client-js
}

export function transformBrowseResponse(res: GetBrowseResultsResponse): Nullable<PlpBrowseData> {
  const { response, request, result_id: resultId } = res;

  if (!response || !request) return null;

  return {
    resultId,
    request,
    rawApiResponse: res,
    response: {
      totalNumResults: response.total_num_results,
      numResultsPerPage: request.num_results_per_page,
      results: (response.results as Result[]).map((result) => transformResultItem(result, false)),
      facets: transformResponseFacets(response.facets as Facet[]),
      groups: transformItemGroups(response.groups as Group[]),
      sortOptions: transformResponseSortOptions(response.sort_options),
      refinedContent: response.refined_content,
    },
  } as PlpBrowseData; // Type override due to partials in client-js
}
