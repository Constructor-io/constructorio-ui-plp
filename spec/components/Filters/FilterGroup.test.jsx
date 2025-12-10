import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterGroup from '../../../src/components/Filters/FilterGroup';

const mockSetFilter = jest.fn();

describe('Testing Component: FilterGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render and disable range filter when min === max (prevent invalid selections)', () => {
    const singlePriceRangeFacet = {
      displayName: 'Price',
      name: 'price',
      type: 'range',
      data: {},
      hidden: false,
      min: 11.2,
      max: 11.2, // Single price scenario
      status: { min: 5, max: 30 }, // User's previous selection out of range
    };

    render(
      <FilterGroup
        facet={singlePriceRangeFacet}
        setFilter={mockSetFilter}
        initialNumOptions={10}
      />,
    );

    // Filter should still be visible
    const filterHeader = screen.getByText('Price');
    expect(filterHeader).toBeInTheDocument();

    // Sliders should be present but disabled (only one price exists, nothing to adjust)
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toBeDisabled();
    expect(sliders[1]).toBeDisabled();

    // Number inputs should also be disabled
    const numberInputs = screen.getAllByRole('spinbutton');
    expect(numberInputs).toHaveLength(2);
    expect(numberInputs[0]).toBeDisabled();
    expect(numberInputs[1]).toBeDisabled();

    // Inputs should show the user's previous selection (5 and 30)
    expect(numberInputs[0]).toHaveValue(5);
    expect(numberInputs[1]).toHaveValue(30);

    // setFilter should not be called when controls are disabled
    expect(mockSetFilter).not.toHaveBeenCalled();
  });

  it('Should render range filter normally when min !== max', () => {
    const normalRangeFacet = {
      displayName: 'Price',
      name: 'price',
      type: 'range',
      data: {},
      hidden: false,
      min: 1,
      max: 100, // Normal range
      status: { min: 1, max: 100 },
    };

    render(
      <FilterGroup facet={normalRangeFacet} setFilter={mockSetFilter} initialNumOptions={10} />,
    );

    const filterHeader = screen.getByText('Price');
    expect(filterHeader).toBeInTheDocument();

    // Sliders should be present and enabled (normal range scenario)
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).not.toBeDisabled();
    expect(sliders[1]).not.toBeDisabled();

    // Number inputs should also be enabled
    const numberInputs = screen.getAllByRole('spinbutton');
    expect(numberInputs).toHaveLength(2);
    expect(numberInputs[0]).not.toBeDisabled();
    expect(numberInputs[1]).not.toBeDisabled();

    // setFilter should not be called on initial render
    expect(mockSetFilter).not.toHaveBeenCalled();
  });
});
