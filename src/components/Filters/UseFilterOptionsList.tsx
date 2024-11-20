import { useEffect, useState } from 'react';
import { PlpMultipleFacet } from '../../types';
import useOptionsList from '../../hooks/useOptionsList';

export interface UseFilterOptionsListProps {
  multipleFacet: PlpMultipleFacet;
  modifyRequestMultipleFilter: (selectedOptions: Array<string> | null) => void;
  initialNumOptions: number;
  isCollapsed: boolean;
}

export default function useFilterOptionsList(props: UseFilterOptionsListProps) {
  const {
    multipleFacet: facet,
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,
  } = props;

  const { isShowAll, setIsShowAll, optionsToRender, setOptionsToRender } = useOptionsList({
    options: facet.options,
    initialNumOptions,
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
