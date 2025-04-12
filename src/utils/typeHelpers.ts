import {
  Nullable,
  PlpBrowseData,
  PlpFacet,
  PlpHierarchicalFacet,
  PlpMultipleFacet,
  PlpRangeFacet,
  PlpSearchData,
  PlpSearchDataRedirect,
  PlpSearchDataResults,
  PlpSingleFacet,
} from '../types';

export function isPlpSearchDataResults(
  response: Nullable<PlpSearchData | PlpBrowseData>,
): response is PlpSearchDataResults {
  return 'response' in (response || {});
}

export function isPlpSearchDataRedirect(
  response: Nullable<PlpSearchData | PlpBrowseData>,
): response is PlpSearchDataRedirect {
  return 'redirect' in (response || {});
}

export function isPlpBrowseDataResults(
  response: Nullable<PlpSearchData | PlpBrowseData>,
): response is PlpBrowseData {
  return 'response' in (response || {});
}

export function isRangeFacet(facet: PlpFacet): facet is PlpRangeFacet {
  return facet.type === 'range';
}

export function isMultipleOrBucketedFacet(facet: PlpFacet): facet is PlpMultipleFacet {
  return facet.type === 'multiple';
}

export function isSingleFacet(facet: PlpFacet): facet is PlpSingleFacet {
  return facet.type === 'single';
}

export function isHierarchicalFacet(facet: PlpFacet): facet is PlpHierarchicalFacet {
  return facet.type === 'hierarchical';
}

export function isOptionFacet(
  facet: PlpFacet,
): facet is PlpMultipleFacet | PlpSingleFacet | PlpHierarchicalFacet {
  return isMultipleOrBucketedFacet(facet) || isSingleFacet(facet) || isHierarchicalFacet(facet);
}
