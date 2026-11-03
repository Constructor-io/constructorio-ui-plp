import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FilterOptionData } from '@constructor-io/constructorio-ui-components';
import {
  PlpFacetOption,
  PlpHierarchicalFacet,
  PlpMultipleFacet,
  PlpSingleFacet,
} from '../../types';
import useOptionsList from '../../hooks/useOptionsList';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { resolveVisualOption, slugify } from '../../utils';

interface UseFilterOptionsListPropsBase {
  modifyRequestMultipleFilter: (selectedOptions: Array<string> | null) => void;
  initialNumOptions: number;
  isCollapsed: boolean;
  /**
   * Function that takes in a PlpFacetOption and returns `true` if the option should be hidden from the final render
   * @returns boolean
   */
  isHiddenFilterOptionFn?: (option: PlpFacetOption) => boolean;
  isVisual?: boolean;
  getVisualImageUrl?: (option: PlpFacetOption) => string | undefined;
  getVisualColorHex?: (option: PlpFacetOption) => string | undefined;
  checkboxPosition?: 'left' | 'right' | 'none';
  /**
   * Namespace prepended to every option's DOM `id`. Option ids must be unique across the whole
   * document — they drive `<input id>` / `<label htmlFor>` and the `aria-controls` of each nested
   * list — so a page rendering the same facets more than once (`CioPlpGrid` renders one set of
   * filters for desktop and another inside the mobile modal) has to namespace them per instance.
   */
  idPrefix?: string;
}
/** Every facet type that renders as a list of options. */
type PlpOptionFacet = PlpMultipleFacet | PlpSingleFacet | PlpHierarchicalFacet;

interface UseFilterOptionsListPropsLegacy extends UseFilterOptionsListPropsBase {
  /** @deprecated Use `facet` instead */
  multipleFacet: PlpOptionFacet;
}

interface UseFilterOptionsListPropsNew extends UseFilterOptionsListPropsBase {
  facet: PlpOptionFacet;
}

export type UseFilterOptionsListProps =
  | UseFilterOptionsListPropsLegacy
  | UseFilterOptionsListPropsNew;

export default function useFilterOptionsList(props: UseFilterOptionsListProps) {
  const {
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,
    isHiddenFilterOptionFn,
    isVisual,
    getVisualImageUrl,
    getVisualColorHex,
    checkboxPosition,
    idPrefix,
  } = props;
  const facet = 'facet' in props ? props.facet : props.multipleFacet;

  const { getIsHiddenFilterOptionField } = useCioPlpContext().itemFieldGetters;

  const isHiddenOptionFn = useCallback(
    (option: PlpFacetOption) =>
      (typeof isHiddenFilterOptionFn === 'function' && isHiddenFilterOptionFn(option)) ||
      (typeof getIsHiddenFilterOptionField === 'function' &&
        getIsHiddenFilterOptionField(option)) ||
      false,
    [isHiddenFilterOptionFn, getIsHiddenFilterOptionField],
  );

  const {
    isShowAll,
    setIsShowAll,
    optionsToRender: facetOptions,
    setOptionsToRender: setFacetOptions,
    totalFilteredOptions,
  } = useOptionsList({
    options: facet.options,
    initialNumOptions,
    isHiddenOptionFn,
    nestedOptionsKey: 'options', // Enable recursive filtering for hierarchical facet options
  });

  const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, boolean>>({});

  /**
   * Each option filters independently: a click toggles exactly the clicked value, never the options
   * nested above or below it, so the request always carries just what is ticked. `single` facets
   * hold one value at a time, so there the click replaces whatever was applied.
   *
   * The map stays keyed by option *value* rather than by DOM id, because the value is what the
   * request carries (`filters[facetName] = [...values]`).
   */
  const onOptionSelect = (optionValue: string) => {
    const newMap: Record<string, boolean> = facet.type === 'single' ? {} : { ...selectedOptionMap };
    newMap[optionValue] = !selectedOptionMap[optionValue];

    const selectedOptions = Object.keys(newMap).filter((key) => newMap[key]);
    setSelectedOptionMap(newMap);
    modifyRequestMultipleFilter(selectedOptions.length ? selectedOptions : null);
  };

  useEffect(() => {
    const newSelectedOptionsMap: Record<string, boolean> = {};

    // Recurse into nested options so selections on hierarchical options aren't dropped
    const collectStatuses = (options: Array<PlpFacetOption>) => {
      options.forEach((option) => {
        newSelectedOptionsMap[option.value] = option.status === 'selected';

        if (option.options?.length) collectStatuses(option.options);
      });
    };
    // Statuses are read from the unfiltered facet so a filter the API reports as applied is never
    // silently dropped, even on an option this page hides.
    collectStatuses(facet.options);

    // Mirror the API as-is, so the checkboxes always match the filters the results were computed with
    setSelectedOptionMap(newSelectedOptionsMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facet]);

  /**
   * Facet options mapped to the shape `FilterOptionsList` from
   * `@constructor-io/constructorio-ui-components` expects. Nested facet options recurse under
   * the same `options` key on both sides, so only the field names per option differ.
   *
   * Each option's `id` is built from its full path — `[idPrefix, facetName, ...ancestorValues,
   * value]`, each segment slugified — rather than from its value alone. Slugifying keeps ids valid:
   * values carry whitespace and quotes, which invalidate an `id` and break the `aria-controls`
   * linking each option to its nested list. Values that slugify to nothing fall back to their position among
   * their siblings.
   */
  const filterOptions: Array<FilterOptionData> = useMemo(() => {
    const rootId = [idPrefix, facet.name]
      .filter(Boolean)
      .map((segment) => slugify(segment as string))
      .filter(Boolean)
      .join('-');

    const toFilterOptionData = (
      option: PlpFacetOption,
      index: number,
      parentId: string,
    ): FilterOptionData => {
      const visual = isVisual
        ? resolveVisualOption(option, getVisualImageUrl, getVisualColorHex)
        : null;
      const id = `${parentId}-${slugify(option.value) || `option-${index}`}`;

      return {
        id,
        optionValue: option.value,
        displayValue: option.displayName,
        displayCountValue: option.count?.toString(),
        isChecked: selectedOptionMap[option.value] || false,
        ...(visual && { visual }),
        ...(option.options?.length && {
          options: option.options.map((childOption, childIndex) =>
            toFilterOptionData(childOption, childIndex, id),
          ),
        }),
      };
    };

    return facetOptions.map((option, index) => toFilterOptionData(option, index, rootId));
  }, [
    facetOptions,
    facet.name,
    idPrefix,
    selectedOptionMap,
    isVisual,
    getVisualImageUrl,
    getVisualColorHex,
  ]);

  return {
    // props
    facet,
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,
    isVisual,
    getVisualImageUrl,
    getVisualColorHex,
    checkboxPosition,
    idPrefix,

    // useFilterOptionsList
    isShowAll,
    setIsShowAll,
    /** Facet options, as returned by the API and sliced by "Show All" */
    facetOptions,
    setFacetOptions,
    /** `facetOptions` mapped to the components library's `FilterOptionData` shape */
    filterOptions,
    totalFilteredOptions,
    selectedOptionMap,
    setSelectedOptionMap,
    onOptionSelect,
  };
}
