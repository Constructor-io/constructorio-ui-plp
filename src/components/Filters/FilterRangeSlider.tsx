import React, { useEffect, useState, useRef } from 'react';
import { PlpRangeFacet } from '../../types';
import useDebounce from '../../hooks/useDebounce';

export interface FilterRangeSliderProps {
  rangedFacet: PlpRangeFacet;
  updateFilterRange: (selectedOptions: string) => void;
  isCollapsed: boolean;
  sliderStep?: number;
}

/**
 * For consistency. Utility Function to extract value from an event.
 * @param e Change Event on an input element.
 * @returns Parsed float value of the new input value or NaN if empty
 */
function getValueFromOnChangeEvent(e: React.ChangeEvent<HTMLInputElement>) {
  const parsedValue = parseFloat(e?.target?.value);

  if (Number.isNaN(parsedValue)) {
    return '';
  }
  return parsedValue;
}

export default function FilterRangeSlider(props: FilterRangeSliderProps) {
  const { rangedFacet: facet, updateFilterRange, isCollapsed, sliderStep = 0.1 } = props;
  const visibleTrack = useRef<HTMLDivElement>(null);
  const [selectedTrackStyles, setSelectedTrackStyles] = useState({});

  const [minValue, setMinValue] = useState(facet.min);
  const [maxValue, setMaxValue] = useState(facet.max);
  const [inputMinValue, setInputMinValue] = useState<number | ''>(facet.min);
  const [inputMaxValue, setInputMaxValue] = useState<number | ''>(facet.max);
  const [filterRange, setFilterRange] = useState('');
  const debouncedFilterRange = useDebounce<string>(filterRange, 1000);

  const [isModified, setIsModified] = useState(false);

  const isValidMinValue = (value: number | string): value is number =>
    typeof value !== 'string' && value < maxValue && value >= facet.min;
  const isValidMaxValue = (value: number | string): value is number =>
    typeof value !== 'string' && value > minValue && value <= facet.max;

  const onMinSliderMove = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = getValueFromOnChangeEvent(event);

    if (isValidMinValue(sliderValue)) {
      setMinValue(sliderValue);
      setInputMinValue(sliderValue);
      setIsModified(true);
    }
  };

  const onMaxSliderMove = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = getValueFromOnChangeEvent(event);

    if (isValidMaxValue(sliderValue)) {
      setMaxValue(sliderValue);
      setInputMaxValue(sliderValue);
      setIsModified(true);
    }
  };

  const onSliderMoveEnd = () => {
    const newRange = `${minValue}-${maxValue}`;

    setFilterRange(newRange);
    updateFilterRange(newRange);
    setIsModified(false);
  };

  const onMaxInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = getValueFromOnChangeEvent(event);

    setInputMaxValue(inputValue);

    if (isValidMaxValue(inputValue)) {
      setMaxValue(inputValue);
      setIsModified(true);
    }
  };

  const onMinInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = getValueFromOnChangeEvent(event);

    setInputMinValue(inputValue);

    if (isValidMinValue(inputValue)) {
      setMinValue(inputValue);
      setIsModified(true);
    }
  };

  const onTrackClick = (event: MouseEvent) => {
    if (visibleTrack.current === null) return;
    if (event.target !== visibleTrack.current) return;
    const totalWidth = visibleTrack.current!.offsetWidth;
    const clickedX = event.offsetX;

    const selectedValue = Math.round((clickedX / totalWidth) * facet.max);
    const distMinToClicked = Math.abs(selectedValue - minValue);
    const distMaxToClicked = Math.abs(selectedValue - maxValue);

    if (distMinToClicked <= distMaxToClicked) {
      const newRange = `${selectedValue}-${maxValue}`;

      setMinValue(selectedValue);
      setInputMinValue(selectedValue);
      setFilterRange(newRange);
      updateFilterRange(newRange);
      setIsModified(false);
    } else {
      const newRange = `${minValue}-${selectedValue}`;

      setMaxValue(selectedValue);
      setInputMaxValue(selectedValue);
      setFilterRange(newRange);
      updateFilterRange(newRange);
      setIsModified(false);
    }
  };

  // Update internal state
  useEffect(() => {
    if (facet.status.min && !isModified) {
      // Initial state
      setMinValue(facet.status.min);
      setMaxValue(facet.status.max);
      setFilterRange(`${facet.status.min}-${facet.status.max}`);
    } else if (isModified) {
      // Future updates
      setFilterRange(`${minValue}-${maxValue}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minValue, maxValue, facet]);

  // Update selected track styles
  useEffect(() => {
    const startPercentage = ((100 * minValue) / facet.max).toFixed(2);
    const widthPercentage = ((100 * (maxValue - minValue)) / facet.max).toFixed(2);

    setSelectedTrackStyles({ left: `${startPercentage}%`, width: `${widthPercentage}%` });
  }, [minValue, maxValue, facet]);

  // Debounced callback for Slider Inputs
  useEffect(() => {
    if (isModified) {
      updateFilterRange(debouncedFilterRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilterRange]);

  // When the component mounts, attach the click listeners
  useEffect(() => {
    let localRef: HTMLDivElement | null;
    if (visibleTrack.current) {
      visibleTrack.current.addEventListener('click', onTrackClick);
      localRef = visibleTrack.current;
    } else {
      return () => {};
    }

    // Unmount
    return () => {
      localRef?.removeEventListener('click', onTrackClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTrack]);

  return (
    <div className={`cio-collapsible-wrapper${!isCollapsed ? ' cio-collapsible-is-open' : ''}`}>
      <div className='cio-collapsible-inner'>
        <div className='cio-filter-ranged-slider'>
          <div className='cio-slider-inputs'>
            <span className='cio-slider-input'>
              <span className='cio-slider-input-prefix'>from </span>
              <input
                type='number'
                value={inputMinValue}
                onChange={onMinInputValueChange}
                min={facet.min}
                max={maxValue}
                step={sliderStep}
              />
            </span>
            <div className='cio-slider-input'>
              <span className='cio-slider-input-prefix'>to </span>
              <input
                type='number'
                value={inputMaxValue}
                onChange={onMaxInputValueChange}
                min={minValue}
                max={facet.max}
                step={sliderStep}
              />
            </div>
          </div>

          <div className='cio-doubly-ended-slider' ref={visibleTrack}>
            <div className='cio-slider-track-selected' style={selectedTrackStyles} />
            <input
              className='cio-min-slider'
              type='range'
              step={sliderStep}
              min={facet.min}
              max={facet.max}
              value={minValue}
              onChange={onMinSliderMove}
              onMouseUp={onSliderMoveEnd}
            />
            <input
              className='cio-max-slider'
              type='range'
              step={sliderStep}
              min={facet.min}
              max={facet.max}
              value={maxValue}
              onChange={onMaxSliderMove}
              onMouseUp={onSliderMoveEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
