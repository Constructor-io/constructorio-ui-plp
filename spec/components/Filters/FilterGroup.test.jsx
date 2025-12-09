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
  });
});
