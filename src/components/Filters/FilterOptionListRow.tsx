import React from 'react';

export interface FilterOptionListRowProps {
  id: string;
  optionValue: string;
  displayValue: string;
  displayCountValue: string;
  isChecked: boolean;
  onChange: (value: string) => void;
  showCheckbox?: boolean;
}

export default function FilterOptionListRow(props: FilterOptionListRowProps) {
  const {
    id,
    optionValue,
    displayValue,
    displayCountValue,
    isChecked,
    onChange,
    showCheckbox = true,
  } = props;

  return (
    <li className='cio-filter-multiple-option' key={id}>
      <label htmlFor={id}>
        <input
          type='checkbox'
          id={id}
          value={optionValue}
          checked={isChecked}
          onChange={() => onChange(optionValue)}
        />
        {showCheckbox && (
          <div className='cio-checkbox'>
            <svg
              width='10'
              height='8'
              viewBox='0 0 10 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='cio-check'>
              <path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.7' strokeLinecap='round' />
            </svg>
          </div>
        )}
        <div className='cio-filter-multiple-option-display'>
          <span className='cio-filter-option-name'>{displayValue}</span>
          {displayCountValue && (
            <span className='cio-filter-option-count'>{displayCountValue}</span>
          )}
        </div>
      </label>
    </li>
  );
}
