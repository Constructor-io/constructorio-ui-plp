import { useEffect, useState } from 'react';
import { PlpMultipleFacet, PlpSingleFacet } from '../../types';
import useOptionsList from '../../hooks/useOptionsList';

interface UseFilterOptionsListPropsBase {
  modifyRequestMultipleFilter: (selectedOptions: Array<string> | null) => void;
  initialNumOptions: number;
  isCollapsed: boolean;
}
interface UseFilterOptionsListPropsLegacy extends UseFilterOptionsListPropsBase {
  /** @deprecated Use `facet` instead */
  multipleFacet: PlpMultipleFacet | PlpSingleFacet;
}

interface UseFilterOptionsListPropsNew extends UseFilterOptionsListPropsBase {
  facet: PlpMultipleFacet | PlpSingleFacet;
}

export type UseFilterOptionsListProps =
  | UseFilterOptionsListPropsLegacy
  | UseFilterOptionsListPropsNew;

export default function useFilterOptionsList(props: UseFilterOptionsListProps) {
  const { initialNumOptions, modifyRequestMultipleFilter, isCollapsed } = props;
  const facet = 'facet' in props ? props.facet : props.multipleFacet;

  const { isShowAll, setIsShowAll, optionsToRender, setOptionsToRender } = useOptionsList({
    options: facet.options,
    initialNumOptions,
  });

  const [selectedOptionMap, setSelectedOptionMap] = useState({});

  const onOptionSelect = (optionValue: string) => {
    const newMap = facet.type === 'multiple' ? { ...selectedOptionMap } : {};
    newMap[optionValue] = !selectedOptionMap[optionValue];

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
