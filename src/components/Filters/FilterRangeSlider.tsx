import React, { useEffect, useState } from 'react';
import { PlpRangeFacet } from '../../types';
import useDebounce from '../../hooks/useDebounce';

export interface FilterRangeSliderProps {
  rangedFacet: PlpRangeFacet;
  updateFilterRange: (selectedOptions: string) => void;
  isCollapsed: boolean;
  sliderStep?: number;
}

export default function FilterRangeSlider(props: FilterRangeSliderProps) {
  const { rangedFacet: facet, updateFilterRange, isCollapsed, sliderStep = 0.1 } = props;
  const [minValue, setMinValue] = useState(facet.min);
  const [maxValue, setMaxValue] = useState(facet.max);
  const [isModified, setIsModified] = useState(false);

  const [filterRange, setFilterRange] = useState('');
  const debouncedFilterRange = useDebounce(filterRange, 500);

  const onMinSliderMove = (event: any) => {
    const sliderValue = event?.target?.value;

    if (sliderValue < maxValue) {
      setMinValue(sliderValue);
      setIsModified(true);
    }
  };

  const onMaxSliderMove = (event: any) => {
    const sliderValue = event?.target?.value;

    if (sliderValue > minValue) {
      setMaxValue(sliderValue);
      setIsModified(true);
    }
  };

  useEffect(() => {
    setFilterRange(`${minValue}-${maxValue}`);
  }, [minValue, maxValue]);

  useEffect(() => {
    if (isModified) {
      updateFilterRange(debouncedFilterRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterRange]);

  return (
    <div className={`cio-collapsible-wrapper${!isCollapsed ? ' cio-collapsible-is-open' : ''}`}>
      <ul className='cio-filter-multiple-options cio-collapsible-inner'>
        <div className='cio-slider-inputs'>
          <span>
            <span className='cio-slider-input-prefix'>from </span>
            <input
              type='number'
              value={minValue}
              min={facet.min}
              max={facet.max}
              onChange={onMinSliderMove}
              step={sliderStep}
            />
          </span>
          <span>
            <span className='cio-slider-input-prefix'>to </span>
            <input
              type='number'
              value={maxValue}
              min={facet.min}
              max={facet.max}
              onChange={onMaxSliderMove}
              step={sliderStep}
            />
          </span>
        </div>
        <div className='cio-doubly-ended-slider'>
          <input
            className='min-slider'
            type='range'
            step={sliderStep}
            min={facet.min}
            max={facet.max}
            value={minValue}
            onChange={onMinSliderMove}
          />
          <input
            className='max-slider'
            type='range'
            min={facet.min}
            max={facet.max}
            value={maxValue}
            onChange={onMaxSliderMove}
          />
        </div>
      </ul>
    </div>
  );
}
