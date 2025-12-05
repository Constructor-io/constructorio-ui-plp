import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterGroup from '../../../src/components/Filters/FilterGroup';

const mockSetFilter = jest.fn();

describe('Testing Component: FilterGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should hide range filter when min === max (single price)', () => {
    const singlePriceRangeFacet = {
      displayName: 'Price',
      name: 'price',
      type: 'range',
      data: {},
      hidden: false,
      min: 25,
      max: 25, // Single price scenario
      status: { min: 25, max: 25 },
    };

    const { container } = render(
      <FilterGroup
        facet={singlePriceRangeFacet}
        setFilter={mockSetFilter}
        initialNumOptions={10}
      />,
    );

    const filterGroup = container.querySelector('.cio-filter-group');
    expect(filterGroup).toHaveClass('is-hidden');
  });

  it('Should show range filter when min !== max (normal range)', () => {
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

    const { container } = render(
      <FilterGroup facet={normalRangeFacet} setFilter={mockSetFilter} initialNumOptions={10} />,
    );

    const filterGroup = container.querySelector('.cio-filter-group');
    expect(filterGroup).not.toHaveClass('is-hidden');
  });
});
