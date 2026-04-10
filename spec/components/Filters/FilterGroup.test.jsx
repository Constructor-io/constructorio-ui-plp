import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  describe('Range Slider Clamping', () => {
    const renderFilterGroup = (facet) =>
      render(<FilterGroup facet={facet} setFilter={mockSetFilter} initialNumOptions={10} />);

    describe('when facet has status', () => {
      it('Should clamp status values to facet min/max on initial render', () => {
        renderFilterGroup({
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 10,
          max: 90,
          status: { min: 5, max: 100 },
        });

        const numberInputs = screen.getAllByRole('spinbutton');
        const sliders = screen.getAllByRole('slider');

        // Status values (5, 100) should be clamped to facet range (10, 90)
        expect(numberInputs[0]).toHaveValue(10);
        expect(numberInputs[1]).toHaveValue(90);
        expect(sliders[0]).toHaveValue('10');
        expect(sliders[1]).toHaveValue('90');
      });

      it('Should clamp slider and input values when facet min/max narrows', () => {
        const initialFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 0,
          max: 100,
          status: { min: 20, max: 80 },
        };

        const { rerender } = renderFilterGroup(initialFacet);

        const numberInputs = screen.getAllByRole('spinbutton');
        expect(numberInputs[0]).toHaveValue(20);
        expect(numberInputs[1]).toHaveValue(80);

        // Simulate another filter narrowing the facet range to 30-70
        rerender(
          <FilterGroup
            facet={{ ...initialFacet, min: 30, max: 70, status: { min: 20, max: 80 } }}
            setFilter={mockSetFilter}
            initialNumOptions={10}
          />,
        );

        const sliders = screen.getAllByRole('slider');

        // Values (20, 80) should be clamped to new range (30, 70)
        expect(numberInputs[0]).toHaveValue(30);
        expect(numberInputs[1]).toHaveValue(70);
        expect(sliders[0]).toHaveValue('30');
        expect(sliders[1]).toHaveValue('70');
      });

      it('Should keep slider and input values when facet min/max widens', () => {
        const initialFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 20,
          max: 80,
          status: { min: 30, max: 60 },
        };

        const { rerender } = renderFilterGroup(initialFacet);

        const numberInputs = screen.getAllByRole('spinbutton');
        expect(numberInputs[0]).toHaveValue(30);
        expect(numberInputs[1]).toHaveValue(60);

        // Facet range widens to 0-100
        rerender(
          <FilterGroup
            facet={{ ...initialFacet, min: 0, max: 100, status: { min: 30, max: 60 } }}
            setFilter={mockSetFilter}
            initialNumOptions={10}
          />,
        );

        const sliders = screen.getAllByRole('slider');

        // Values (30, 60) are still within the new range, so they should stay
        expect(numberInputs[0]).toHaveValue(30);
        expect(numberInputs[1]).toHaveValue(60);
        expect(sliders[0]).toHaveValue('30');
        expect(sliders[1]).toHaveValue('60');
      });

      it('Should partially clamp when only one bound exceeds the new range', () => {
        const initialFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 0,
          max: 100,
          status: { min: 20, max: 80 },
        };

        const { rerender } = renderFilterGroup(initialFacet);

        // Facet range narrows on the max side only
        rerender(
          <FilterGroup
            facet={{ ...initialFacet, min: 0, max: 50, status: { min: 20, max: 80 } }}
            setFilter={mockSetFilter}
            initialNumOptions={10}
          />,
        );

        const numberInputs = screen.getAllByRole('spinbutton');
        const sliders = screen.getAllByRole('slider');

        // Min (20) is still within range, max (80) should clamp to 50
        expect(numberInputs[0]).toHaveValue(20);
        expect(numberInputs[1]).toHaveValue(50);
        expect(sliders[0]).toHaveValue('20');
        expect(sliders[1]).toHaveValue('50');
      });
    });

    describe('When facet does not have status', () => {
      it('Should clamp slider and input values when facet min/max narrows for facet without status', () => {
        const initialFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 0,
          max: 100,
          status: {},
        };

        const { rerender } = renderFilterGroup(initialFacet);

        const numberInputs = screen.getAllByRole('spinbutton');
        const sliders = screen.getAllByRole('slider');

        expect(numberInputs[0]).toHaveValue(0);
        expect(numberInputs[1]).toHaveValue(100);
        expect(sliders[0]).toHaveValue('0');
        expect(sliders[1]).toHaveValue('100');

        // Simulate another filter narrowing the facet range to 30-70
        rerender(
          <FilterGroup
            facet={{ ...initialFacet, min: 30, max: 70, status: {} }}
            setFilter={mockSetFilter}
            initialNumOptions={10}
          />,
        );

        // Values (0, 100) should be clamped to new range (30, 70)
        expect(numberInputs[0]).toHaveValue(30);
        expect(numberInputs[1]).toHaveValue(70);
        expect(sliders[0]).toHaveValue('30');
        expect(sliders[1]).toHaveValue('70');
      });

      it('Should clamp user-selected values when facet range narrows after slider interaction', () => {
        const initialFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 0,
          max: 100,
          status: {},
        };

        const { rerender } = renderFilterGroup(initialFacet);

        const sliders = screen.getAllByRole('slider');

        // User drags sliders to 10-90
        fireEvent.change(sliders[0], { target: { value: 10 } });
        fireEvent.mouseUp(sliders[0]);
        fireEvent.change(sliders[1], { target: { value: 90 } });
        fireEvent.mouseUp(sliders[1]);

        // Facet range narrows to 25-75
        rerender(
          <FilterGroup
            facet={{ ...initialFacet, min: 25, max: 75, status: { min: 10, max: 90 } }}
            setFilter={mockSetFilter}
            initialNumOptions={10}
          />,
        );

        const numberInputs = screen.getAllByRole('spinbutton');

        // User's selection (10, 90) should be clamped to new range (25, 75)
        expect(numberInputs[0]).toHaveValue(25);
        expect(numberInputs[1]).toHaveValue(75);
        expect(sliders[0]).toHaveValue('25');
        expect(sliders[1]).toHaveValue('75');
      });

      it('Should widen slider and input values when facet min/max widens', () => {
        const initialFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 20,
          max: 80,
          status: {},
        };

        const { rerender } = renderFilterGroup(initialFacet);

        const numberInputs = screen.getAllByRole('spinbutton');
        expect(numberInputs[0]).toHaveValue(20);
        expect(numberInputs[1]).toHaveValue(80);

        // Facet range widens to 0-100
        rerender(
          <FilterGroup
            facet={{ ...initialFacet, min: 10, max: 90, status: {} }}
            setFilter={mockSetFilter}
            initialNumOptions={10}
          />,
        );

        const sliders = screen.getAllByRole('slider');

        // Values (30, 60) are still within the new range, so they should stay
        expect(numberInputs[0]).toHaveValue(10);
        expect(numberInputs[1]).toHaveValue(90);
        expect(sliders[0]).toHaveValue('10');
        expect(sliders[1]).toHaveValue('90');
      });
    });
  });

  describe('Single Value Facets (min === max)', () => {
    const renderFilterGroup = (facet) =>
      render(<FilterGroup facet={facet} setFilter={mockSetFilter} initialNumOptions={10} />);

    it('Should disable sliders and inputs when facet has a single value', () => {
      renderFilterGroup({
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 50,
        max: 50,
        status: {},
      });

      const numberInputs = screen.getAllByRole('spinbutton');
      const sliders = screen.getAllByRole('slider');

      expect(numberInputs[0]).toBeDisabled();
      expect(numberInputs[1]).toBeDisabled();
      expect(sliders[0]).toBeDisabled();
      expect(sliders[1]).toBeDisabled();

      expect(numberInputs[0]).toHaveValue(50);
      expect(numberInputs[1]).toHaveValue(50);
    });

    it('Should use status for display range when facet is single value with status', () => {
      renderFilterGroup({
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 50,
        max: 50,
        status: { min: 10, max: 90 },
      });

      const sliders = screen.getAllByRole('slider');
      const numberInputs = screen.getAllByRole('spinbutton');

      // Display range should come from status (10-90), not facet (50-50)
      expect(sliders[0]).toHaveAttribute('min', '10');
      expect(sliders[0]).toHaveAttribute('max', '90');
      expect(sliders[1]).toHaveAttribute('min', '10');
      expect(sliders[1]).toHaveAttribute('max', '90');

      // Input fields should show the single facet value
      expect(numberInputs[0]).toHaveValue(10);
      expect(numberInputs[1]).toHaveValue(90);
    });

    it('Should transition from multi-value to single-value when facet range collapses', () => {
      const initialFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 10,
        max: 100,
        status: { min: 30, max: 70 },
      };

      const { rerender } = renderFilterGroup(initialFacet);

      const numberInputs = screen.getAllByRole('spinbutton');
      const sliders = screen.getAllByRole('slider');

      expect(numberInputs[0]).not.toBeDisabled();
      expect(numberInputs[1]).not.toBeDisabled();
      expect(sliders[0]).not.toBeDisabled();
      expect(sliders[1]).not.toBeDisabled();

      // Facet collapses to a single value, status retains previous selection
      rerender(
        <FilterGroup
          facet={{ ...initialFacet, min: 50, max: 50, status: { min: 30, max: 70 } }}
          setFilter={mockSetFilter}
          initialNumOptions={10}
        />,
      );

      // Should become disabled
      expect(numberInputs[0]).toBeDisabled();
      expect(numberInputs[1]).toBeDisabled();
      expect(sliders[0]).toBeDisabled();
      expect(sliders[1]).toBeDisabled();

      // Input fields should show the single facet value
      expect(numberInputs[0]).toHaveValue(30);
      expect(numberInputs[1]).toHaveValue(70);
    });

    it('Should transition from single-value to multi-value when facet range expands', () => {
      const initialFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 50,
        max: 50,
        status: { min: 10, max: 90 },
      };

      const { rerender } = renderFilterGroup(initialFacet);

      const numberInputs = screen.getAllByRole('spinbutton');
      const sliders = screen.getAllByRole('slider');

      expect(numberInputs[0]).toBeDisabled();

      // Facet expands back to a range
      rerender(
        <FilterGroup
          facet={{ ...initialFacet, min: 0, max: 100, status: { min: 10, max: 90 } }}
          setFilter={mockSetFilter}
          initialNumOptions={10}
        />,
      );

      // Should become enabled
      expect(numberInputs[0]).not.toBeDisabled();
      expect(numberInputs[1]).not.toBeDisabled();
      expect(sliders[0]).not.toBeDisabled();
      expect(sliders[1]).not.toBeDisabled();

      // Status values should be clamped to new range
      expect(numberInputs[0]).toHaveValue(10);
      expect(numberInputs[1]).toHaveValue(90);
      expect(sliders[0]).toHaveValue('10');
      expect(sliders[1]).toHaveValue('90');
    });
  });
});
