import { useEffect, useState } from 'react';
import { PlpMultipleFacet, PlpFacetOption } from '../../types';

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

  const [isShowAll, setIsShowAll] = useState(false);
  const [optionsToRender, setOptionsToRender] = useState<Array<PlpFacetOption>>(facet.options);
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

  useEffect(() => {
    if (isShowAll) {
      setOptionsToRender(facet.options);
    } else {
      setOptionsToRender(facet.options.slice(0, initialNumOptions));
    }
  }, [isShowAll, facet.options, initialNumOptions]);

  return {
    facet,
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,
    isShowAll,
    setIsShowAll,
    optionsToRender,
    setOptionsToRender,
    selectedOptionMap,
    setSelectedOptionMap,
    onOptionSelect,
  };
}
