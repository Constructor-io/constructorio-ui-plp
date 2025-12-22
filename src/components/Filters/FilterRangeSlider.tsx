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

/**
 * Calculate the display range for the slider.
 * When there's only one price value (min === max), use the user's previous selection
 * to position the knobs at the edges. Otherwise, use the actual facet min/max.
 */
function getDisplayRange(facet: PlpRangeFacet, isSingleValue: boolean) {
  if (isSingleValue && facet.status?.min !== undefined && facet.status?.max !== undefined) {
    return {
      displayMin: facet.status.min,
      displayMax: facet.status.max,
    };
  }
  return {
    displayMin: facet.min,
    displayMax: facet.max,
  };
}

// Default track styles when range collapses to a single value
const COLLAPSED_TRACK_STYLE = { left: '0%', width: '100%' };

export default function FilterRangeSlider(props: FilterRangeSliderProps) {
  const { rangedFacet: facet, modifyRequestRangeFilter, isCollapsed, sliderStep = 0.1 } = props;
  const visibleTrack = useRef<HTMLDivElement>(null);
  const [selectedTrackStyles, setSelectedTrackStyles] = useState({});

  const isSingleValue = facet.min === facet.max;
  const { displayMin, displayMax } = getDisplayRange(facet, isSingleValue);

  const [minValue, setMinValue] = useState(facet.status?.min ?? facet.min);
  const [maxValue, setMaxValue] = useState(facet.status?.max ?? facet.max);
  const [inputMinValue, setInputMinValue] = useState<number | ''>(facet.status?.min ?? facet.min);
  const [inputMaxValue, setInputMaxValue] = useState<number | ''>(facet.status?.max ?? facet.max);

  const isValidMinValue = (value: number | string): value is number =>
    typeof value !== 'string' &&
    value < maxValue &&
    value >= (isSingleValue ? displayMin : facet.min);
  const isValidMaxValue = (value: number | string): value is number =>
    typeof value !== 'string' &&
    value > minValue &&
    value <= (isSingleValue ? displayMax : facet.max);

  const onMinSliderMove = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = getValueFromOnChangeEvent(event);

    if (isValidMinValue(sliderValue)) {
      setMinValue(sliderValue);
      setInputMinValue(sliderValue);
    }
  };

  const onMaxSliderMove = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = getValueFromOnChangeEvent(event);

    if (isValidMaxValue(sliderValue)) {
      setMaxValue(sliderValue);
      setInputMaxValue(sliderValue);
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
    }
  };

  const onMinInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = getValueFromOnChangeEvent(event);

    setInputMinValue(inputValue);

    if (isValidMinValue(inputValue)) {
      setMinValue(inputValue);
    }
  };

  const onInputBlurApplyFilter = () => {
    if (isValidMaxValue(inputMaxValue) && isValidMinValue(inputMinValue)) {
      modifyRequestRangeFilter(`${minValue}-${maxValue}`);
    }
  };

  const onTrackClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (visibleTrack.current === null) return;
    if (event.target !== visibleTrack.current) return;
    if (isSingleValue) return; // Prevent interaction when only one price exists

    const totalWidth = visibleTrack.current!.offsetWidth;
    const clickedX = event.nativeEvent.offsetX;

    const selectedValue =
      Math.round((clickedX / totalWidth) * (displayMax - displayMin)) + displayMin;
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
  };

  // Update internal state when facet changes
  useEffect(() => {
    if (facet.status?.min !== undefined) {
      const clampedMin = Math.max(displayMin, Math.min(displayMax, facet.status.min));
      const clampedMax = Math.max(displayMin, Math.min(displayMax, facet.status.max));

      setMinValue(clampedMin);
      setMaxValue(clampedMax);

      setInputMinValue(isSingleValue ? facet.status.min : clampedMin);
      setInputMaxValue(isSingleValue ? facet.status.max : clampedMax);
    }
  }, [
    facet.min,
    facet.max,
    facet.status?.min,
    facet.status?.max,
    displayMin,
    displayMax,
    isSingleValue,
  ]);

  // Update selected track styles
  useEffect(() => {
    const trackLen = displayMax - displayMin;

    // Prevent division by zero when range collapses
    if (trackLen === 0) {
      setSelectedTrackStyles(COLLAPSED_TRACK_STYLE);
      return;
    }

    const rebasedStartValue = minValue - displayMin;
    const startPercentage = ((100 * rebasedStartValue) / trackLen).toFixed(2);
    const widthPercentage = ((100 * (maxValue - minValue)) / trackLen).toFixed(2);

    setSelectedTrackStyles({ left: `${startPercentage}%`, width: `${widthPercentage}%` });
  }, [minValue, maxValue, displayMin, displayMax]);

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
                min={isSingleValue ? undefined : facet.min}
                max={isSingleValue ? undefined : maxValue}
                step={sliderStep}
                disabled={isSingleValue}
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
                min={isSingleValue ? undefined : minValue}
                max={isSingleValue ? undefined : facet.max}
                step={sliderStep}
                disabled={isSingleValue}
              />
            </div>
          </div>

          <div
            className='cio-doubly-ended-slider'
            ref={visibleTrack}
            role='presentation'
            onClick={(e) => !isSingleValue && onTrackClick(e)}>
            <div className='cio-slider-track-selected' style={selectedTrackStyles} />
            <input
              className='cio-min-slider'
              type='range'
              step={sliderStep}
              min={displayMin}
              max={displayMax}
              value={minValue}
              onChange={onMinSliderMove}
              onMouseUp={onSliderMoveEnd}
              onTouchEnd={onSliderMoveEnd}
              disabled={isSingleValue}
            />
            <input
              className='cio-max-slider'
              type='range'
              step={sliderStep}
              min={displayMin}
              max={displayMax}
              value={maxValue}
              onChange={onMaxSliderMove}
              onMouseUp={onSliderMoveEnd}
              onTouchEnd={onSliderMoveEnd}
              disabled={isSingleValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
