import { SearchResponse } from '@constructor-io/constructorio-client-javascript/lib/types';
import { PlpSearchResponse, Item, ApiItem } from '../types';

export function transformResultItem(item: ApiItem, includeRaw = true): Item {
  const otherMetadataFields: any = { ...item.data };
  delete otherMetadataFields.id;
  delete otherMetadataFields.url;
  delete otherMetadataFields.image_url;
  delete otherMetadataFields.group_ids;
  delete otherMetadataFields.description;
  delete otherMetadataFields.facets;
  delete otherMetadataFields.variation_id;

  const transformedItem: Item = {
    matchedTerms: item.matched_terms,
    itemName: item.value,
    isSlotted: item.is_slotted,
    labels: item.labels,
    variations: item.variations,
    variationsMap: item.variations_map,

    // Flatten the data object
    itemId: item.data.id,
    url: item.data.url,
    imageUrl: item.data.image_url,
    groupIds: item.data.group_ids,
    description: item.data.description,
    facets: item.data.facets,
    variationId: item.data.variation_id,
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
    results: res.response.results.map((result) => transformResultItem(result, false)),
    facets: res.response.facets,
    groups: res.response.groups,
    sortOptions: res.response.sort_options,
    refinedContent: res.response.refined_content,
    rawResponse: res,
  } as PlpSearchResponse;
}
