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

type SelectedOptionMap = Record<string, boolean>;

/** `option`'s own value plus every value nested below it. */
function collectSubtreeValues(option: PlpFacetOption, values: Array<string> = []) {
  values.push(option.value);
  option.options?.forEach((childOption) => collectSubtreeValues(childOption, values));

  return values;
}

/**
 * The values to apply when `optionValue` is clicked: the option itself and its whole subtree.
 *
 * Every option carrying the value contributes, not just the first found. The selection map is keyed
 * by value, so a value appearing in two branches is one filter — cascading into a single branch
 * would leave the other showing a selected parent above unselected children.
 */
function collectMatchingSubtreeValues(
  options: Array<PlpFacetOption>,
  optionValue: string,
  values: Array<string> = [],
) {
  options.forEach((option) => {
    if (option.value === optionValue) {
      collectSubtreeValues(option, values);
    } else if (option.options?.length) {
      collectMatchingSubtreeValues(option.options, optionValue, values);
    }
  });

  return values;
}

/** Applies `isSelected` to an option and its subtree, returning a new map. */
function withSubtreeSelected(
  options: Array<PlpFacetOption>,
  optionValue: string,
  isSelected: boolean,
  selectedMap: SelectedOptionMap,
): SelectedOptionMap {
  const nextMap = { ...selectedMap };

  collectMatchingSubtreeValues(options, optionValue).forEach((value) => {
    nextMap[value] = isSelected;
  });

  return nextMap;
}

/**
 * Derives every parent from its children: a parent counts as selected exactly when all of its
 * children are, and stops counting as selected as soon as one of them is not.
 *
 * Runs depth-first so a branch settles before the level above reads it, which lets the rule carry
 * all the way up — selecting the last leaf of a branch can mark its parent, that parent's parent,
 * and so on. A parent's own stored state is always replaced by this derivation, which is what makes
 * a parent behave as "all of the below" rather than as a filter of its own.
 *
 * Only options with children are derived; leaves keep whatever the user (or the API) set.
 */
function withParentsDerived(
  options: Array<PlpFacetOption>,
  selectedMap: SelectedOptionMap,
): SelectedOptionMap {
  const nextMap = { ...selectedMap };

  const derive = (levelOptions: Array<PlpFacetOption>) => {
    levelOptions.forEach((option) => {
      if (option.options?.length) {
        derive(option.options);
        nextMap[option.value] = option.options.every((childOption) => nextMap[childOption.value]);
      }
    });
  };
  derive(options);

  return nextMap;
}

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
    filteredOptions: allFacetOptions,
    totalFilteredOptions,
  } = useOptionsList({
    options: facet.options,
    initialNumOptions,
    isHiddenOptionFn,
    nestedOptionsKey: 'options', // Enable recursive filtering for hierarchical facet options
  });

  const [selectedOptionMap, setSelectedOptionMap] = useState<Record<string, boolean>>({});

  /**
   * A parent option stands for "all of the below". Selecting one selects everything nested under
   * it, deselecting one deselects everything under it, and a parent follows its children: it becomes
   * selected once they all are, and stops being selected the moment one of them is not.
   *
   * The whole option tree is needed for that, not just the clicked option: rolling a parent up
   * means reading its *siblings*, and a parent ticking can tick its own parent in turn. The tree
   * used is `allFacetOptions` — hidden options removed, but before the "Show All" slice, so a
   * parent is judged against all of its children rather than only the rendered ones.
   *
   * The map stays keyed by option *value* rather than by DOM id, because the value is what the
   * request carries (`filters[facetName] = [...values]`). Two branches sharing a value are a single
   * filter as far as the API is concerned, so showing both checked is accurate.
   */
  const onOptionSelect = (optionValue: string) => {
    const isSelected = !selectedOptionMap[optionValue];

    // `single` facets hold one value at a time, so there is no cascade to run: the clicked option
    // replaces whatever was applied.
    if (facet.type === 'single') {
      const newMap = isSelected ? { [optionValue]: true } : {};

      setSelectedOptionMap(newMap);
      modifyRequestMultipleFilter(isSelected ? [optionValue] : null);
      return;
    }

    const cascadedMap = withSubtreeSelected(
      allFacetOptions,
      optionValue,
      isSelected,
      selectedOptionMap,
    );
    const newMap = withParentsDerived(allFacetOptions, cascadedMap);

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

    // The parent rule holds for state arriving from the API too: a parent whose children all come
    // back selected shows as selected, without the user having clicked anything.
    setSelectedOptionMap(
      facet.type === 'single'
        ? newSelectedOptionsMap
        : withParentsDerived(allFacetOptions, newSelectedOptionsMap),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facet]);

  /**
   * Facet options mapped to the shape `FilterOptionsList` from
   * `@constructor-io/constructorio-ui-components` expects. Nested facet options recurse under
   * the same `options` key on both sides, so only the field names per option differ.
   *
   * Each option's `id` is built from its full path — `[idPrefix, facetName, ...ancestorValues,
   * value]`, each segment slugified — rather than from its value alone. The path keeps ids unique
   * when the same value appears in two branches, and slugifying keeps them valid: values carry
   * whitespace and quotes, which invalidate an `id` and break the `aria-controls` linking each
   * option to its nested list. Values that slugify to nothing fall back to their position among
   * their siblings.
   */
  const filterOptionData: Array<FilterOptionData> = useMemo(() => {
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
    filterOptionData,
    totalFilteredOptions,
    selectedOptionMap,
    setSelectedOptionMap,
    onOptionSelect,
  };
}
