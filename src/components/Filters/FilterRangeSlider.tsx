import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { PlpRangeFacet } from '../../types';

export interface FilterRangeSliderProps {
  rangedFacet: PlpRangeFacet;
  modifyRequestRangeFilter: (selectedOptions: string) => void;
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
  const { rangedFacet: facet, modifyRequestRangeFilter, isCollapsed, sliderStep = 0.1 } = props;
  const visibleTrack = useRef<HTMLDivElement>(null);
  const [selectedTrackStyles, setSelectedTrackStyles] = useState({});

  const [minValue, setMinValue] = useState(facet.min);
  const [maxValue, setMaxValue] = useState(facet.max);
  const [inputMinValue, setInputMinValue] = useState<number | ''>(facet.status?.min || facet.min);
  const [inputMaxValue, setInputMaxValue] = useState<number | ''>(facet.status?.max || facet.max);
  const [filterRange, setFilterRange] = useState('');

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

    modifyRequestRangeFilter(newRange);
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

  const onInputBlurApplyFilter = () => {
    if (isModified && isValidMaxValue(inputMaxValue) && isValidMinValue(inputMinValue)) {
      modifyRequestRangeFilter(filterRange);
    }
  };

  const onTrackClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (visibleTrack.current === null) return;
    if (event.target !== visibleTrack.current) return;
    const totalWidth = visibleTrack.current!.offsetWidth;
    const clickedX = event.nativeEvent.offsetX;

    const selectedValue = Math.round((clickedX / totalWidth) * (facet.max - facet.min)) + facet.min;
    const distMinToClicked = Math.abs(selectedValue - minValue);
    const distMaxToClicked = Math.abs(selectedValue - maxValue);

    if (distMinToClicked <= distMaxToClicked) {
      const newRange = `${selectedValue}-${maxValue}`;

      setMinValue(selectedValue);
      setInputMinValue(selectedValue);
      modifyRequestRangeFilter(newRange);
    } else {
      const newRange = `${minValue}-${selectedValue}`;

      setMaxValue(selectedValue);
      setInputMaxValue(selectedValue);
      modifyRequestRangeFilter(newRange);
    }

    setIsModified(true);
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
    const trackLen = facet.max - facet.min;
    const rebasedStartValue = minValue - facet.min;
    const startPercentage = ((100 * rebasedStartValue) / trackLen).toFixed(2);
    const widthPercentage = ((100 * (maxValue - minValue)) / trackLen).toFixed(2);

    setSelectedTrackStyles({ left: `${startPercentage}%`, width: `${widthPercentage}%` });
  }, [minValue, maxValue, facet]);

  return (
    <div
      className={classNames({
        'cio-collapsible-wrapper': true,
        'cio-collapsible-is-open': !isCollapsed,
      })}>
      <div className='cio-collapsible-inner'>
        <div className='cio-filter-ranged-slider'>
          <div className='cio-slider-inputs'>
            <span className='cio-slider-input cio-slider-input-min'>
              <span className='cio-slider-input-prefix'>from </span>
              <input
                required
                type='number'
                value={inputMinValue}
                onChange={onMinInputValueChange}
                onBlur={onInputBlurApplyFilter}
                placeholder={facet.min.toString()}
                min={facet.min}
                max={maxValue}
                step={sliderStep}
              />
            </span>
            <div className='cio-slider-input cio-slider-input-max'>
              <span className='cio-slider-input-prefix'>to </span>
              <input
                required
                type='number'
                value={inputMaxValue}
                onChange={onMaxInputValueChange}
                onBlur={onInputBlurApplyFilter}
                placeholder={facet.max.toString()}
                min={minValue}
                max={facet.max}
                step={sliderStep}
              />
            </div>
          </div>

          <div
            className='cio-doubly-ended-slider'
            ref={visibleTrack}
            role='presentation'
            onClick={(e) => onTrackClick(e)}>
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
