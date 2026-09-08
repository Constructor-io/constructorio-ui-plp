import { useCallback, useMemo } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { PlpFacet, PlpFacetOption, PlpFilterValue, FacetConfig } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  setFilter: (filterName: string, filterValue: PlpFilterValue) => void;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
  clearFilters: () => void;
  getVisualImageUrl?: (option: PlpFacetOption) => string | undefined;
  getVisualColorHex?: (option: PlpFacetOption) => string | undefined;
  isVisualFilterFn?: (facet: PlpFacet) => boolean;
  perFacetConfigs?: Record<string, FacetConfig>;
  getIsCollapsed: (facet: PlpFacet) => boolean;
  /** Resolves whether a facet's nested option lists get a collapse toggle. */
  getHierarchyCollapsible: (facet: PlpFacet) => boolean;
  /** Resolves whether a facet's nested option lists start collapsed. */
  getDefaultHierarchyCollapsed: (facet: PlpFacet) => boolean;
}

export interface UseFilterProps {
  /**
   * Used to build and render filters dynamically
   */
  facets: Array<PlpFacet>;
  /**
   * Global slider step for all range facets
   */
  sliderStep?: number;
  /**
   * Per-facet slider step configuration
   */
  facetSliderSteps?: Record<string, number>;
  /**
   * Function that takes in a PlpFacet and returns `true` if the facet should be hidden from the final render
   * @returns boolean
   */
  isHiddenFilterFn?: (facet: PlpFacet) => boolean;
  /**
   * Callback to resolve an image URL for a filter option (visual filters)
   */
  getVisualImageUrl?: (option: PlpFacetOption) => string | undefined;
  /**
   * Callback to resolve a hex color for a filter option (visual filters)
   */
  getVisualColorHex?: (option: PlpFacetOption) => string | undefined;
  /**
   * Callback to determine if a facet should render as visual filter
   */
  isVisualFilterFn?: (facet: PlpFacet) => boolean;
  /**
   * Per-facet configuration overrides
   */
  perFacetConfigs?: Record<string, FacetConfig>;
  /**
   * Global default collapse behavior for filter groups when no facet metadata
   * (`cio_render_collapsed`) or `perFacetConfigs` override is provided.
   * When `true`, unmatched filter groups render collapsed by default;
   * when `false`, they render expanded by default.
   * Facet metadata and per-facet overrides via `perFacetConfigs` take precedence.
   */
  defaultCollapsed?: boolean;
  /**
   * Global default for whether options that have nested options get a toggle collapsing their
   * nested list. This collapses branches *within* a filter group — unrelated to `defaultCollapsed`,
   * which collapses filter groups as a whole. Defaults to `true`.
   * Per-facet overrides via `perFacetConfigs[name].hierarchyCollapsible` take precedence.
   */
  hierarchyCollapsible?: boolean;
  /**
   * Global default for whether nested option lists start collapsed rather than expanded. Initial
   * state only — each option list owns expansion from then on. Defaults to `false`.
   * Per-facet overrides via `perFacetConfigs[name].defaultHierarchyCollapsed` take precedence.
   *
   * A branch holding a selected option still auto-expands, so an applied filter is never hidden.
   */
  defaultHierarchyCollapsed?: boolean;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const {
    facets,
    sliderStep,
    facetSliderSteps,
    isHiddenFilterFn,
    getVisualImageUrl,
    getVisualColorHex,
    isVisualFilterFn,
    perFacetConfigs,
    defaultCollapsed,
    hierarchyCollapsible,
    defaultHierarchyCollapsed,
  } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useFilter must be used within a component that is a child of <CioPlp />');
  }

  const { getIsHiddenFilterField, getIsCollapsedFacetField } = contextValue.itemFieldGetters;
  const { getRequestConfigs, setRequestConfigs } = useRequestConfigs();

  const isHiddenFilter = useCallback(
    (facet: PlpFacet) =>
      (typeof isHiddenFilterFn === 'function' && isHiddenFilterFn(facet)) ||
      (typeof getIsHiddenFilterField === 'function' && getIsHiddenFilterField(facet)) ||
      false,
    [isHiddenFilterFn, getIsHiddenFilterField],
  );

  const filteredFacets = useMemo(
    () => facets.filter((facet) => !isHiddenFilter(facet)),
    [facets, isHiddenFilter],
  );

  const setFilter = (filterName: string, filterValue: PlpFilterValue) => {
    const newFilters = getRequestConfigs().filters || {};

    newFilters[filterName] = filterValue;

    // Remove filter entirely
    if (filterValue === null) {
      delete newFilters[filterName];
    }
    setRequestConfigs({ filters: newFilters, page: 1 });
  };

  const clearFilters = () => {
    setRequestConfigs({ filters: {}, page: 1 });
  };

  const getIsCollapsed = useCallback(
    (facet: PlpFacet): boolean => {
      // Priority 1: Per-facet config (perFacetConfigs)
      const isCollapsed = perFacetConfigs?.[facet.name]?.isCollapsed;
      if (isCollapsed !== undefined) {
        return isCollapsed;
      }

      // Priority 2: Facet metadata field (cio_render_collapsed)
      const collapsedFromMetadata =
        typeof getIsCollapsedFacetField === 'function'
          ? getIsCollapsedFacetField(facet)
          : undefined;
      if (collapsedFromMetadata !== undefined) {
        return !!collapsedFromMetadata;
      }

      // Priority 3: Global prop (defaultCollapsed)
      if (defaultCollapsed !== undefined) {
        return defaultCollapsed;
      }

      return false;
    },
    [perFacetConfigs, defaultCollapsed, getIsCollapsedFacetField],
  );

  // Both hierarchy resolvers follow the same precedence as `getIsCollapsed`, minus the facet
  // metadata layer: per-facet config, then the global prop, then the component default
  const getHierarchyCollapsible = useCallback(
    (facet: PlpFacet): boolean =>
      perFacetConfigs?.[facet.name]?.hierarchyCollapsible ?? hierarchyCollapsible ?? true,
    [perFacetConfigs, hierarchyCollapsible],
  );

  const getDefaultHierarchyCollapsed = useCallback(
    (facet: PlpFacet): boolean =>
      perFacetConfigs?.[facet.name]?.defaultHierarchyCollapsed ??
      defaultHierarchyCollapsed ??
      false,
    [perFacetConfigs, defaultHierarchyCollapsed],
  );

  return {
    facets: filteredFacets,
    setFilter,
    sliderStep,
    facetSliderSteps,
    clearFilters,
    getVisualImageUrl,
    getVisualColorHex,
    isVisualFilterFn,
    perFacetConfigs,
    getIsCollapsed,
    getHierarchyCollapsible,
    getDefaultHierarchyCollapsed,
  };
}
