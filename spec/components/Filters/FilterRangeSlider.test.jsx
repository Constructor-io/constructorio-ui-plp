import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterRangeSlider from '../../../src/components/Filters/FilterRangeSlider';

const mockRangeFacet = {
  displayName: 'Price',
  name: 'price',
  type: 'range',
  data: {},
  hidden: false,
  min: 1,
  max: 100,
  status: { min: 1, max: 100 },
};

const mockModifyRequestRangeFilter = jest.fn();

describe('Testing Component: FilterRangeSlider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should handle single price scenario (min === max) by disabling inputs and sliders', () => {
    const singlePriceFacet = {
      ...mockRangeFacet,
      min: 25,
      max: 25,
      status: { min: 5, max: 30 }, // Previously applied filter that's now invalid
    };

    render(
      <FilterRangeSlider
        rangedFacet={singlePriceFacet}
        modifyRequestRangeFilter={mockModifyRequestRangeFilter}
        isCollapsed={false}
      />,
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).toBeDisabled();
    expect(sliders[1]).toBeDisabled();

    const numberInputs = screen.getAllByRole('spinbutton');
    expect(numberInputs[0]).toBeDisabled();
    expect(numberInputs[1]).toBeDisabled();
  });

  it('Should reset filter to single price value when min === max', () => {
    const singlePriceFacet = {
      ...mockRangeFacet,
      min: 25,
      max: 25,
      status: { min: 5, max: 30 },
    };

    render(
      <FilterRangeSlider
        rangedFacet={singlePriceFacet}
        modifyRequestRangeFilter={mockModifyRequestRangeFilter}
        isCollapsed={false}
      />,
    );

    // Should call modifyRequestRangeFilter to reset the invalid filter
    expect(mockModifyRequestRangeFilter).toHaveBeenCalledWith('25-25');

    const numberInputs = screen.getAllByRole('spinbutton');
    expect(numberInputs[0]).toHaveValue(25);
    expect(numberInputs[1]).toHaveValue(25);
  });

  it('Should not reset filter when min === max and status already matches', () => {
    const singlePriceFacet = {
      ...mockRangeFacet,
      min: 25,
      max: 25,
      status: { min: 25, max: 25 }, // Already at the correct value
    };

    render(
      <FilterRangeSlider
        rangedFacet={singlePriceFacet}
        modifyRequestRangeFilter={mockModifyRequestRangeFilter}
        isCollapsed={false}
      />,
    );

    // Should not call modifyRequestRangeFilter since the filter is already correct
    expect(mockModifyRequestRangeFilter).not.toHaveBeenCalled();
  });

  it('Should work normally when min !== max', () => {
    render(
      <FilterRangeSlider
        rangedFacet={mockRangeFacet}
        modifyRequestRangeFilter={mockModifyRequestRangeFilter}
        isCollapsed={false}
      />,
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders[0]).not.toBeDisabled();
    expect(sliders[1]).not.toBeDisabled();

    const numberInputs = screen.getAllByRole('spinbutton');
    expect(numberInputs[0]).not.toBeDisabled();
    expect(numberInputs[1]).not.toBeDisabled();
  });
});
