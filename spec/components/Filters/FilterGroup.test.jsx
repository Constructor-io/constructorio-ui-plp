import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterGroup from '../../../src/components/Filters/FilterGroup';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';

const mockSetFilter = jest.fn();

const mockMultipleFacet = {
  displayName: 'Color',
  name: 'color',
  type: 'multiple',
  data: {},
  hidden: false,
  options: [
    { status: '', count: 155, displayName: 'Black', value: 'Black', data: {} },
    { status: '', count: 45, displayName: 'Blue', value: 'Blue', data: {} },
  ],
};

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

/**
 * Helper to render FilterGroup inside CioPlp provider.
 * Required when rendering facets with options (multiple/single) because
 * FilterOptionsList internally calls useCioPlpContext().
 */
function renderWithProvider(ui) {
  return render(<CioPlp apiKey={DEMO_API_KEY}>{ui}</CioPlp>);
}

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

  describe(' - Default rendering without componentOverrides', () => {
    it('Should render default header, options list, and structure when no overrides provided', () => {
      renderWithProvider(
        <FilterGroup facet={mockMultipleFacet} setFilter={mockSetFilter} initialNumOptions={10} />,
      );

      // Default header with facet name should render
      expect(screen.getByText('Color')).toBeInTheDocument();

      // Default arrow icon should be present
      const header = screen.getByText('Color').closest('.cio-filter-header');
      expect(header).toBeInTheDocument();
      expect(header.querySelector('.cio-arrow')).toBeInTheDocument();

      // Default options list should render
      expect(screen.getByText('Black')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();

      // Default structure should have the filter group li
      const filterGroup = screen.getByText('Color').closest('.cio-filter-group');
      expect(filterGroup).toBeInTheDocument();
      expect(filterGroup.tagName).toBe('LI');
    });

    it('Should render default range slider when no overrides provided', () => {
      render(
        <FilterGroup facet={mockRangeFacet} setFilter={mockSetFilter} initialNumOptions={10} />,
      );

      expect(screen.getByText('Price')).toBeInTheDocument();
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });
  });

  describe(' - componentOverrides', () => {
    const overrideSlots = [
      {
        key: 'root',
        facet: mockMultipleFacet,
        buildOverrides: (fn) => ({ reactNode: fn }),
        needsProvider: false,
      },
      {
        key: 'header',
        facet: mockMultipleFacet,
        buildOverrides: (fn) => ({ header: { reactNode: fn } }),
        needsProvider: true,
      },
      {
        key: 'optionsList',
        facet: mockMultipleFacet,
        buildOverrides: (fn) => ({ optionsList: { reactNode: fn } }),
        needsProvider: false,
      },
      {
        key: 'rangeSlider',
        facet: mockRangeFacet,
        buildOverrides: (fn) => ({ rangeSlider: { reactNode: fn } }),
        needsProvider: false,
      },
    ];

    describe.each(overrideSlots)(
      'override: $key',
      ({ key, facet, buildOverrides, needsProvider }) => {
        const renderFn = (ui) => (needsProvider ? renderWithProvider(ui) : render(ui));

        it(`Should replace ${key} with custom content`, () => {
          const overrideFn = () => <div data-testid={`custom-${key}`}>Custom {key}</div>;

          renderFn(
            <FilterGroup
              facet={facet}
              setFilter={mockSetFilter}
              initialNumOptions={10}
              componentOverrides={buildOverrides(overrideFn)}
            />,
          );

          expect(screen.getByTestId(`custom-${key}`)).toBeInTheDocument();
        });

        it(`Should pass correct render props to ${key} override`, () => {
          const spy = jest.fn().mockReturnValue(<div>Override</div>);

          renderFn(
            <FilterGroup
              facet={facet}
              setFilter={mockSetFilter}
              initialNumOptions={10}
              componentOverrides={buildOverrides(spy)}
            />,
          );

          expect(spy).toHaveBeenCalledTimes(1);
          const props = spy.mock.calls[0][0];
          expect(props.facet).toEqual(facet);
          expect(props.isCollapsed).toBe(false);
          expect(typeof props.toggleIsCollapsed).toBe('function');
          expect(typeof props.onFilterSelect).toBe('function');
        });
      },
    );

    it('Should accept static ReactNode as override (not a function)', () => {
      renderWithProvider(
        <FilterGroup
          facet={mockMultipleFacet}
          setFilter={mockSetFilter}
          initialNumOptions={10}
          componentOverrides={{
            header: {
              reactNode: <div data-testid='static-header'>Static Header Content</div>,
            },
          }}
        />,
      );

      expect(screen.getByTestId('static-header')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Color/ })).not.toBeInTheDocument();
    });

    it('Should support toggleIsCollapsed via override render props', () => {
      renderWithProvider(
        <FilterGroup
          facet={mockMultipleFacet}
          setFilter={mockSetFilter}
          initialNumOptions={10}
          componentOverrides={{
            header: {
              reactNode: ({ facet, isCollapsed, toggleIsCollapsed }) => (
                <button data-testid='custom-toggle' type='button' onClick={toggleIsCollapsed}>
                  {facet.displayName} {isCollapsed ? 'closed' : 'open'}
                </button>
              ),
            },
          }}
        />,
      );

      const toggle = screen.getByTestId('custom-toggle');
      expect(toggle).toHaveTextContent('Color open');

      fireEvent.click(toggle);
      expect(toggle).toHaveTextContent('Color closed');

      fireEvent.click(toggle);
      expect(toggle).toHaveTextContent('Color open');
    });

    it('Should support onFilterSelect via override render props', () => {
      render(
        <FilterGroup
          facet={mockMultipleFacet}
          setFilter={mockSetFilter}
          initialNumOptions={10}
          componentOverrides={{
            optionsList: {
              reactNode: ({ onFilterSelect }) => (
                <button
                  data-testid='custom-filter-btn'
                  type='button'
                  onClick={() => onFilterSelect(['Black'])}>
                  Select Black
                </button>
              ),
            },
          }}
        />,
      );

      fireEvent.click(screen.getByTestId('custom-filter-btn'));
      expect(mockSetFilter).toHaveBeenCalledWith('color', ['Black']);
    });

    describe('isolation - overriding one slot should not affect others', () => {
      const isolationCases = [
        {
          overrideKey: 'header',
          facet: mockMultipleFacet,
          needsProvider: true,
          expectPresent: ['.cio-filter-multiple-options-list'],
          description: 'optionsList still renders when only header is overridden',
        },
        {
          overrideKey: 'header',
          facet: mockRangeFacet,
          needsProvider: false,
          expectPresent: ['.cio-doubly-ended-slider'],
          description: 'rangeSlider still renders when only header is overridden',
        },
        {
          overrideKey: 'optionsList',
          facet: mockMultipleFacet,
          needsProvider: false,
          expectPresent: ['.cio-filter-header'],
          description: 'header still renders when only optionsList is overridden',
        },
      ];

      it.each(isolationCases)(
        '$description',
        ({ overrideKey, facet, needsProvider, expectPresent }) => {
          const overrides = { [overrideKey]: { reactNode: () => <div>Custom</div> } };
          const renderFn = needsProvider ? renderWithProvider : render;

          const { container } = renderFn(
            <FilterGroup
              facet={facet}
              setFilter={mockSetFilter}
              initialNumOptions={10}
              componentOverrides={overrides}
            />,
          );

          expectPresent.forEach((selector) => {
            expect(container.querySelector(selector)).toBeInTheDocument();
          });
        },
      );
    });
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

        // Values should widen to match the new facet bounds
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

      // Input fields should also come from status (10-90), not facet (50-50)
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
      let sliders = screen.getAllByRole('slider');

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

      sliders = screen.getAllByRole('slider');

      // Should become disabled
      expect(numberInputs[0]).toBeDisabled();
      expect(numberInputs[1]).toBeDisabled();
      expect(sliders[0]).toBeDisabled();
      expect(sliders[1]).toBeDisabled();

      // Display range should come from status (30-70), not facet (50-50)
      expect(sliders[0]).toHaveAttribute('min', '30');
      expect(sliders[0]).toHaveAttribute('max', '70');
      expect(sliders[1]).toHaveAttribute('min', '30');
      expect(sliders[1]).toHaveAttribute('max', '70');
      // Input fields should come from status (30-70), not facet (50-50)
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
