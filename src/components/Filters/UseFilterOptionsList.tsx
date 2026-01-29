import { useEffect, useState } from 'react';
import { PlpMultipleFacet, PlpSingleFacet } from '../../types';
import useOptionsList from '../../hooks/useOptionsList';

export interface UseFilterOptionsListProps {
  /** @deprecated Use `facet` instead */
  multipleFacet?: PlpMultipleFacet | PlpSingleFacet;
  facet?: PlpMultipleFacet | PlpSingleFacet;
  modifyRequestMultipleFilter: (selectedOptions: Array<string> | null) => void;
  initialNumOptions: number;
  isCollapsed: boolean;
}

export default function useFilterOptionsList(props: UseFilterOptionsListProps) {
  const {
    facet: facetProp,
    multipleFacet,
    initialNumOptions,
    modifyRequestMultipleFilter,
    isCollapsed,
  } = props;

  // Prefer new prop, fall back to deprecated prop
  const facet = facetProp ?? multipleFacet;

  if (!facet) {
    throw new Error('Either `facet` or `multipleFacet` must be provided');
  }

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
