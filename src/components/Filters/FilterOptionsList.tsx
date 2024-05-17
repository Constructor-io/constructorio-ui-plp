import React, { useEffect, useState } from 'react';
import { PlpFacetOption, PlpMultipleFacet } from '../../types';

export interface FilterOptionsListProps {
  multipleFacet: PlpMultipleFacet;
  updateSelectedOptions: (selectedOptions: Array<string> | null) => void;
  initialNumOptions: number;
  isCollapsed: boolean;
}

export default function FilterOptionsList(props: FilterOptionsListProps) {
  const { multipleFacet: facet, initialNumOptions, updateSelectedOptions, isCollapsed } = props;
  const [isShowAll, setIsShowAll] = useState(false);
  const [optionsToRender, setOptionsToRender] = useState<Array<PlpFacetOption>>(facet.options);
  const [selectedOptionMap, setSelectedOptionMap] = useState({});

  const onOptionSelect = (optionValue: string) => {
    const newMap = { ...selectedOptionMap };
    newMap[optionValue] = !newMap[optionValue];

    const selectedOptions = Object.keys(newMap).filter((key) => newMap[key]);
    setSelectedOptionMap(newMap);
    updateSelectedOptions(selectedOptions.length ? selectedOptions : null);
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

  if (optionsToRender.length === 0) return null;

  return (
    <div className={`cio-collapsible-wrapper${!isCollapsed ? ' cio-collapsible-is-open' : ''}`}>
      <ul className='cio-filter-multiple-options cio-collapsible-inner'>
        {optionsToRender.map((option) => (
          <li className='cio-filter-multiple-option' key={option.value}>
            <button onClick={() => onOptionSelect(option.value)} type='button'>
              <span className='cio-filter-option-checkbox'>
                {selectedOptionMap[option.value] ? '[x] ' : '[ ] '}
              </span>
              <span className='cio-filter-option-name'>{option.displayName}</span>
              &nbsp;
              <span className='cio-filter-option-count'>({option.count})</span>
            </button>
          </li>
        ))}

        {initialNumOptions < facet.options.length && (
          <button type='button' className='cio-see-all' onClick={() => setIsShowAll(!isShowAll)}>
            {isShowAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </ul>
    </div>
  );
}
