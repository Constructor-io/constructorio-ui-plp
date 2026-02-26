import { useCallback, useMemo } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { PlpFacet, PlpFilterValue } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseFilterReturn {
  facets: Array<PlpFacet>;
  setFilter: (filterName: string, filterValue: PlpFilterValue) => void;
  sliderStep?: number;
  facetSliderSteps?: Record<string, number>;
  clearFilters: () => void;
  getIsCollapsed: (facet: PlpFacet) => boolean;
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
   * When true, all filter groups render collapsed by default.
   * When false, all filter groups render expanded by default.
   * Individual facet overrides via `collapsedFacets` or facet metadata take precedence.
   * When used via `filterConfigs` in CioPlpGrid, this also applies to the Groups filter
   * unless `groupsConfigs.isCollapsed` is explicitly set.
   */
  renderCollapsed?: boolean;
  /**
   * List of facet names that should render collapsed by default.
   * Takes precedence over `renderCollapsed` and facet metadata.
   * Accepts a string array or a comma-separated string (for bundled/Connector users).
   */
  collapsedFacets?: string[] | string;
}

export default function useFilter(props: UseFilterProps): UseFilterReturn {
  const { facets, sliderStep, facetSliderSteps, renderCollapsed, collapsedFacets } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useFilter must be used within a component that is a child of <CioPlp />');
  }

  const { getIsCollapsedFacetField } = contextValue.itemFieldGetters;
  const { getRequestConfigs, setRequestConfigs } = useRequestConfigs();

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

  // Parse collapsedFacets string into array for bundled/Connector users
  const parsedCollapsedFacets = useMemo(
    () =>
      typeof collapsedFacets === 'string'
        ? collapsedFacets
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : collapsedFacets,
    [collapsedFacets],
  );

  const getIsCollapsed = useCallback(
    (facet: PlpFacet): boolean => {
      // Priority 1: Per-facet prop (collapsedFacets)
      if (parsedCollapsedFacets && parsedCollapsedFacets.length > 0) {
        return parsedCollapsedFacets.includes(facet.name);
      }

      // Priority 2: Global prop (renderCollapsed)
      if (renderCollapsed !== undefined) {
        return renderCollapsed;
      }

      // Priority 3: Facet metadata field (cio_render_collapsed)
      if (typeof getIsCollapsedFacetField === 'function') {
        return !!getIsCollapsedFacetField(facet);
      }

      return false;
    },
    [parsedCollapsedFacets, renderCollapsed, getIsCollapsedFacetField],
  );

  return {
    facets,
    setFilter,
    sliderStep,
    facetSliderSteps,
    clearFilters,
    getIsCollapsed,
  };
}
