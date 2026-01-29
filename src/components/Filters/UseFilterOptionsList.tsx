import { useCallback, useEffect, useState } from 'react';
import { PlpFacetOption, PlpMultipleFacet } from '../../types';
import useOptionsList from '../../hooks/useOptionsList';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';

export interface UseFilterOptionsListProps {
  multipleFacet: PlpMultipleFacet;
  modifyRequestMultipleFilter: (selectedOptions: Array<string> | null) => void;
  initialNumOptions: number;
  isCollapsed: boolean;
  /**
   * Function that takes in a PlpFacetOption and returns `true` if the option should be hidden from the final render
   * @returns boolean
   */
  isHiddenFilterOptionFn?: (option: PlpFacetOption) => boolean;
}

export default function useFilterOptionsList(props: UseFilterOptionsListProps) {
  const {
    multipleFacet: facet,
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,
    isHiddenFilterOptionFn,
  } = props;

  const { getIsHiddenFilterOptionField } = useCioPlpContext().itemFieldGetters;

  const isHiddenOptionFn = useCallback(
    (option: PlpFacetOption) =>
      (typeof isHiddenFilterOptionFn === 'function' && isHiddenFilterOptionFn(option)) ||
      (typeof getIsHiddenFilterOptionField === 'function' &&
        getIsHiddenFilterOptionField(option)) ||
      false,
    [isHiddenFilterOptionFn, getIsHiddenFilterOptionField],
  );

  const { isShowAll, setIsShowAll, optionsToRender, setOptionsToRender } = useOptionsList({
    options: facet.options,
    initialNumOptions,
    isHiddenOptionFn,
    nestedOptionsKey: 'options', // Enable recursive filtering for hierarchical facet options
  });

  const [selectedOptionMap, setSelectedOptionMap] = useState({});

  const onOptionSelect = (optionValue: string) => {
    const newMap = { ...selectedOptionMap };
    newMap[optionValue] = !newMap[optionValue];

    const selectedOptions = Object.keys(newMap).filter((key) => newMap[key]);
    setSelectedOptionMap(newMap);
    modifyRequestMultipleFilter(selectedOptions.length ? selectedOptions : null);
  };

  useEffect(() => {
    const newSelectedOptionsMap = {};
    facet.options.forEach((option) => {
      newSelectedOptionsMap[option.value] = option.status === 'selected';
    });

    setSelectedOptionMap(newSelectedOptionsMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facet]);

  return {
    // props
    facet,
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,

    // useFilterOptionsList
    isShowAll,
    setIsShowAll,
    optionsToRender,
    setOptionsToRender,
    selectedOptionMap,
    setSelectedOptionMap,
    onOptionSelect,
  };
}
