import React, { useEffect, useState } from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEMO_API_KEY } from '../../../src/constants';
import CioPlp from '../../../src/components/CioPlp';
import Filters from '../../../src/components/Filters';
import mockTransformedFacets from '../../local_examples/sampleFacets.json';
import testJsonEncodedUrl from '../../local_examples/testJsonEncodedUrl.json';
import { getStateFromUrl } from '../../../src/utils';

const filterProps = { facets: mockTransformedFacets };

const mockFacetsWithDuplicateValues = [
  {
    displayName: 'Size',
    name: 'size',
    type: 'multiple',
    data: {},
    hidden: false,
    options: [
      {
        status: '',
        count: 28,
        displayName: '0',
        value: '0',
        data: {},
      },
      {
        status: '',
        count: 229,
        displayName: '1',
        value: '1',
        data: {},
      },
    ],
  },
  {
    displayName: 'Rating',
    name: 'rating',
    type: 'multiple',
    data: {},
    hidden: false,
    options: [
      {
        status: '',
        count: 7,
        displayName: '0',
        value: '0',
        data: {},
      },
      {
        status: '',
        count: 29,
        displayName: '1',
        value: '1',
        data: {},
      },
    ],
  },
];

const mockSingleFacet = {
  displayName: 'Size',
  name: 'size',
  type: 'single',
  data: {},
  hidden: false,
  options: [
    {
      status: '',
      count: 120,
      displayName: 'Small',
      value: 'small',
      data: {},
    },
    {
      status: '',
      count: 98,
      displayName: 'Medium',
      value: 'medium',
      data: {},
    },
    {
      status: '',
      count: 75,
      displayName: 'Large',
      value: 'large',
      data: {},
    },
  ],
};

const mockFacetsWithMetadata = require('../../local_examples/sampleFacetsWithCollapsedMetadata.json');

describe('Testing Component: Filters', () => {
  const originalWindowLocation = window.location;

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  describe(' - Rendering Tests', () => {
    it('Should throw error if used outside the CioPlp', () => {
      expect(() => render(<Filters facets={mockTransformedFacets} />)).toThrow();
    });

    it('Should render filters based on list of facets', async () => {
      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters {...filterProps} />
        </CioPlp>,
      );

      await waitFor(() => {
        const showAllButtons = container.querySelectorAll('.cio-see-all');
        showAllButtons.forEach((btn) => fireEvent.click(btn));

        mockTransformedFacets.forEach((facetGroup) => {
          expect(getByText(facetGroup.displayName)).toBeInTheDocument();

          if (facetGroup.type === 'multiple') {
            // eslint-disable-next-line max-nested-callbacks
            facetGroup.options.forEach((facetOption) => {
              expect(getByText(facetOption.displayName)).toBeInTheDocument();
            });
          }
        });
      });
    });

    it('Should show only specified number of options on render', async () => {
      const initialNumOptions = 2;
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters {...filterProps} initialNumOptions={initialNumOptions} />
        </CioPlp>,
      );

      await waitFor(() => {
        const colorFacet = getByText('Color').closest('.cio-filter-group');
        const renderedOptions = colorFacet.querySelectorAll('.cio-filter-multiple-option');
        for (let i = 0; i < initialNumOptions; i += 1) {
          if (i < initialNumOptions) {
            expect(renderedOptions[i]).toBeInTheDocument();
          } else {
            expect(renderedOptions[i]).not.toBeInTheDocument();
          }
        }
      });
    });

    it('Should mark options if selected', async () => {
      const { container, getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters {...filterProps} />
        </CioPlp>,
      );

      const colorFacetData = mockTransformedFacets.find(
        (facetGroup) => facetGroup.displayName === 'Color',
      );

      const selectedOption = colorFacetData.options.find((option) => option.status === 'selected');
      expect(
        container.querySelector(`input[id=${colorFacetData.name}-${selectedOption.value}]`),
      ).toBeChecked();

      const newSelectedOption = colorFacetData.options.find(
        (option) => option.status !== 'selected',
      );
      fireEvent.click(getByText(newSelectedOption.value));
      expect(
        container.querySelector(`input[id=${colorFacetData.name}-${newSelectedOption.value}]`),
      ).toBeChecked();
    });

    it('Should render correctly with render props', () => {
      const mockChildren = jest.fn().mockReturnValue(<div>Custom Filters</div>);

      const filtersPropsWithChildren = {
        ...filterProps,
        children: mockChildren,
      };

      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters {...filtersPropsWithChildren} />
        </CioPlp>,
      );
      expect(mockChildren).toHaveBeenCalled();
      expect(getByText('Custom Filters')).toBeInTheDocument();
    });

    it('Should render ranged filters correctly', async () => {
      const mockPriceFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 1,
        max: 100,
        status: {},
      };

      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockPriceFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(getByText(mockPriceFacet.displayName)).toBeInTheDocument();

        const minInputValue = container.querySelector('.cio-slider-input-min input');
        const maxInputValue = container.querySelector('.cio-slider-input-max input');

        expect(minInputValue.value).toBe(mockPriceFacet.min.toString());
        expect(maxInputValue.value).toBe(mockPriceFacet.max.toString());

        const selectableTrack = container.querySelector(
          '.cio-doubly-ended-slider .cio-slider-track-selected',
        );
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');

        expect(selectableTrack.style.width).toBe('100.00%');
        expect(selectableTrack.style.left).toBe('0.00%');

        expect(minInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(minInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(minInputSlider.value).toBe(mockPriceFacet.min.toString());

        expect(maxInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(maxInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(maxInputSlider.value).toBe(mockPriceFacet.max.toString());
      });
    });

    it('Should render ranged filters that have already been applied correctly', async () => {
      const mockPriceFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 1,
        max: 100,
        status: {
          min: 30,
          max: 75,
        },
      };

      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockPriceFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(getByText(mockPriceFacet.displayName)).toBeInTheDocument();

        const minInputValue = container.querySelector('.cio-slider-input-min input');
        const maxInputValue = container.querySelector('.cio-slider-input-max input');

        expect(minInputValue.value).toBe(mockPriceFacet.status.min.toString());
        expect(maxInputValue.value).toBe(mockPriceFacet.status.max.toString());

        const selectableTrack = container.querySelector(
          '.cio-doubly-ended-slider .cio-slider-track-selected',
        );
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');

        expect(selectableTrack.style.width).toBe('45.45%');
        expect(selectableTrack.style.left).toBe('29.29%');

        expect(minInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(minInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(minInputSlider.value).toBe(mockPriceFacet.status.min.toString());

        expect(maxInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(maxInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(maxInputSlider.value).toBe(mockPriceFacet.status.max.toString());
      });
    });

    it('Edge Case: If facet.status.min = 0, should render ranged filters that have already been applied correctly', async () => {
      const mockPriceFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 0,
        max: 100,
        status: {
          min: 0,
          max: 75,
        },
      };

      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockPriceFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(getByText(mockPriceFacet.displayName)).toBeInTheDocument();

        const minInputValue = container.querySelector('.cio-slider-input-min input');
        const maxInputValue = container.querySelector('.cio-slider-input-max input');

        expect(minInputValue.value).toBe(mockPriceFacet.status.min.toString());
        expect(maxInputValue.value).toBe(mockPriceFacet.status.max.toString());

        const selectableTrack = container.querySelector(
          '.cio-doubly-ended-slider .cio-slider-track-selected',
        );
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');

        expect(selectableTrack.style.width).toBe('75.00%');
        expect(selectableTrack.style.left).toBe('0.00%');

        expect(minInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(minInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(minInputSlider.value).toBe(mockPriceFacet.status.min.toString());

        expect(maxInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(maxInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(maxInputSlider.value).toBe(mockPriceFacet.status.max.toString());
      });
    });

    it('Should apply custom sliderStep to range sliders when provided globally', async () => {
      const mockPriceFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 1,
        max: 100,
        status: {},
      };

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockPriceFacet]} sliderStep={0.5} />
        </CioPlp>,
      );

      await waitFor(() => {
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');
        const minNumberInput = container.querySelector('.cio-slider-input-min input');
        const maxNumberInput = container.querySelector('.cio-slider-input-max input');

        expect(minInputSlider).toHaveAttribute('step', '0.5');
        expect(maxInputSlider).toHaveAttribute('step', '0.5');
        expect(minNumberInput).toHaveAttribute('step', '0.5');
        expect(maxNumberInput).toHaveAttribute('step', '0.5');

        expect(minInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(minInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(maxInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(maxInputSlider.max).toBe(mockPriceFacet.max.toString());
      });
    });

    it('Should apply facet-specific sliderStep when provided', async () => {
      const mockPriceFacet = {
        displayName: 'Price',
        name: 'price',
        type: 'range',
        data: {},
        hidden: false,
        min: 1,
        max: 100,
        status: {},
      };

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockPriceFacet]} sliderStep={0.1} facetSliderSteps={{ price: 1 }} />
        </CioPlp>,
      );

      await waitFor(() => {
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');
        const minNumberInput = container.querySelector('.cio-slider-input-min input');
        const maxNumberInput = container.querySelector('.cio-slider-input-max input');

        expect(minInputSlider).toHaveAttribute('step', '1');
        expect(maxInputSlider).toHaveAttribute('step', '1');
        expect(minNumberInput).toHaveAttribute('step', '1');
        expect(maxNumberInput).toHaveAttribute('step', '1');

        expect(minInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(minInputSlider.max).toBe(mockPriceFacet.max.toString());
        expect(maxInputSlider.min).toBe(mockPriceFacet.min.toString());
        expect(maxInputSlider.max).toBe(mockPriceFacet.max.toString());
      });
    });
  });

  describe(' - Behavior Tests', () => {
    function TestFiltersApplied() {
      const [currentUrl, setCurrentUrl] = useState(testJsonEncodedUrl);
      const [filters, setFilters] = useState('');

      useEffect(() => {
        if (currentUrl !== '') {
          const { filters: requestFilters } = getStateFromUrl(currentUrl);
          setFilters(JSON.stringify(requestFilters));
        }
      }, [currentUrl]);

      return (
        <CioPlp
          apiKey={DEMO_API_KEY}
          urlHelpers={{ setUrl: setCurrentUrl, getUrl: () => currentUrl }}>
          <Filters {...filterProps} />
          <div id='request-filters'>{filters}</div>;
        </CioPlp>
      );
    }

    const getRequestFilters = (container) =>
      JSON.parse(container.querySelector(`#request-filters`).textContent);

    const setDefaultSliderInputValues = (container) => {
      const sliderMinInput = container.querySelector('.cio-slider-input-min input');
      const sliderMaxInput = container.querySelector('.cio-slider-input-max input');

      fireEvent.change(sliderMinInput, { target: { value: 25 } });
      fireEvent.change(sliderMaxInput, { target: { value: 75 } });
      fireEvent.blur(sliderMaxInput);
      const filters = getRequestFilters(container);

      expect(filters.price[0].indexOf('25')).not.toBe(-1);
      expect(filters.price[0].indexOf('75')).not.toBe(-1);
    };

    it('Initial Filters in URL should match filters rendered', async () => {
      const { container } = render(<TestFiltersApplied />);

      // Initial Filters object should contain already set filter
      const initialFilters = getRequestFilters(container);
      expect(initialFilters.color.includes('Gold')).toBe(true);
    });

    it('OptionsList: Upon clicking a selected option, should remove the option from requestFilters', async () => {
      const { container, getByText } = render(<TestFiltersApplied />);

      const colorFacetData = mockTransformedFacets.find(
        (facetGroup) => facetGroup.displayName === 'Color',
      );
      const selectedOption = colorFacetData.options.find((option) => option.status === 'selected');
      fireEvent.click(getByText(selectedOption.value));
      const requestFilters = getRequestFilters(container);

      expect(requestFilters?.color).toBe(undefined);
    });

    it('OptionsList: Upon clicking options, requestFilters should be updated', async () => {
      const { container, getByText } = render(<TestFiltersApplied />);

      const colorFacetData = mockTransformedFacets.find(
        (facetGroup) => facetGroup.displayName === 'Color',
      );
      const selectedOption = colorFacetData.options.find((option) => option.status === 'selected');

      // Check that the pre-selected option has been added
      const updatedFiltersWithOneSelected = getRequestFilters(container);
      expect(updatedFiltersWithOneSelected.color.includes(selectedOption.value)).toBe(true);

      const newSelectedOption = colorFacetData.options.find(
        (option) => option.status !== 'selected',
      );
      fireEvent.click(getByText(newSelectedOption.value));

      // Check that both selected options have been added
      const updatedFiltersWithTwoSelected = getRequestFilters(container);
      expect(updatedFiltersWithTwoSelected.color.includes(selectedOption.value)).toBe(true);
      expect(updatedFiltersWithTwoSelected.color.includes(newSelectedOption.value)).toBe(true);
    });

    it('OptionsList: Should handle duplicate option values between different facets correctly', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockFacetsWithDuplicateValues} />
        </CioPlp>,
      );

      const sizeZeroCheckbox = container.querySelector('input[id="size-0"]');
      const ratingZeroCheckbox = container.querySelector('input[id="rating-0"]');

      // Select "0" option in Size facet
      fireEvent.click(sizeZeroCheckbox);
      expect(sizeZeroCheckbox).toBeChecked();
      expect(ratingZeroCheckbox).not.toBeChecked();

      // Select "0" option in Rating facet
      fireEvent.click(ratingZeroCheckbox);
      expect(sizeZeroCheckbox).toBeChecked();
      expect(ratingZeroCheckbox).toBeChecked();

      // Deselect "0" option in Size facet
      fireEvent.click(sizeZeroCheckbox);
      expect(sizeZeroCheckbox).not.toBeChecked();
      expect(ratingZeroCheckbox).toBeChecked();
    });

    it('SliderRange: Upon updating the input, requestFilters should not be updated if not blurred', async () => {
      const { container } = render(<TestFiltersApplied />);

      const sliderMinInput = container.querySelector('.cio-slider-input-min input');

      fireEvent.change(sliderMinInput, { target: { value: 25 } });

      const updatedFiltersWithMinPrice = getRequestFilters(container);
      expect(updatedFiltersWithMinPrice.price[0].indexOf('25')).toBe(-1);
    });

    it('SliderRange: Upon updating the input, requestFilters should be updated on blur', async () => {
      const { container } = render(<TestFiltersApplied />);

      const sliderMinInput = container.querySelector('.cio-slider-input-min input');
      const sliderMaxInput = container.querySelector('.cio-slider-input-max input');

      fireEvent.change(sliderMinInput, { target: { value: 25 } });
      fireEvent.blur(sliderMinInput);

      const updatedFiltersWithMinPrice = getRequestFilters(container);
      expect(updatedFiltersWithMinPrice.price[0].indexOf('25')).not.toBe(-1);

      fireEvent.change(sliderMaxInput, { target: { value: 75 } });
      fireEvent.blur(sliderMaxInput);

      const updatedFiltersWithMaxPrice = getRequestFilters(container);
      expect(updatedFiltersWithMaxPrice.price[0].indexOf('25')).not.toBe(-1);
      expect(updatedFiltersWithMaxPrice.price[0].indexOf('75')).not.toBe(-1);
    });

    it('SliderRange: Invalid inputs: maxValue smaller than minValue, requestFilters should not be updated', async () => {
      const { container } = render(<TestFiltersApplied />);
      const sliderMaxInput = container.querySelector('.cio-slider-input-max input');

      // Sets minInput to 25, maxInput to 75
      setDefaultSliderInputValues(container);

      fireEvent.change(sliderMaxInput, {
        target: { value: 20 },
      });
      fireEvent.blur(sliderMaxInput);
      const filters = getRequestFilters(container);

      expect(filters.price[0].indexOf('20')).toBe(-1);
      expect(filters.price[0].indexOf('25')).not.toBe(-1);
      expect(filters.price[0].indexOf('75')).not.toBe(-1);
    });

    it('SliderRange: Invalid inputs: minValue bigger than maxValues, requestFilters should not be updated', async () => {
      const { container } = render(<TestFiltersApplied />);
      const sliderMinInput = container.querySelector('.cio-slider-input-min input');

      // Sets minInput to 25, maxInput to 75
      setDefaultSliderInputValues(container);

      fireEvent.change(sliderMinInput, {
        target: { value: 90 },
      });
      fireEvent.blur(sliderMinInput);
      const filters = getRequestFilters(container);

      expect(filters.price[0].indexOf('90')).toBe(-1);
      expect(filters.price[0].indexOf('25')).not.toBe(-1);
      expect(filters.price[0].indexOf('75')).not.toBe(-1);
    });

    it('SliderRange: Invalid inputs: input values out of range, requestFilters should not be updated', async () => {
      const { container } = render(<TestFiltersApplied />);
      const sliderMinInput = container.querySelector('.cio-slider-input-min input');
      const sliderMaxInput = container.querySelector('.cio-slider-input-max input');

      // Sets minInput to 25, maxInput to 75
      setDefaultSliderInputValues(container);

      fireEvent.change(sliderMaxInput, { target: { value: 110 } });
      fireEvent.change(sliderMinInput, { target: { value: -1 } });
      fireEvent.blur(sliderMaxInput);
      const filters = getRequestFilters(container);

      expect(filters.price[0].indexOf('110')).toBe(-1);
      expect(filters.price[0].indexOf('-1')).toBe(-1);
      expect(filters.price[0].indexOf('25')).not.toBe(-1);
      expect(filters.price[0].indexOf('75')).not.toBe(-1);
    });

    it('SliderRange: Invalid inputs: if maxValue is invalid, updating minValue should not update requestFilters', async () => {
      const { container } = render(<TestFiltersApplied />);
      const sliderMinInput = container.querySelector('.cio-slider-input-min input');
      const sliderMaxInput = container.querySelector('.cio-slider-input-max input');

      // Sets minInput to 25, maxInput to 75
      setDefaultSliderInputValues(container);

      fireEvent.change(sliderMaxInput, { target: { value: 110 } });
      fireEvent.blur(sliderMaxInput);

      fireEvent.change(sliderMinInput, { target: { value: 50 } });
      fireEvent.blur(sliderMaxInput);
      const filters = getRequestFilters(container);

      expect(filters.price[0].indexOf('110')).toBe(-1);
      expect(filters.price[0].indexOf('50')).toBe(-1);
      expect(filters.price[0].indexOf('25')).not.toBe(-1);
      expect(filters.price[0].indexOf('75')).not.toBe(-1);
    });

    it('SliderRange: Upon moving the slider buttons, requestFilters should be updated', async () => {
      const { container } = render(<TestFiltersApplied />);
      const cioMinSlider = container.querySelector('.cio-min-slider');
      const cioMaxSlider = container.querySelector('.cio-max-slider');

      fireEvent.change(cioMinSlider, { target: { value: 20 } });
      fireEvent.mouseUp(cioMinSlider);

      const updatedFiltersWithMinSliderMove = getRequestFilters(container);
      expect(updatedFiltersWithMinSliderMove.price[0].indexOf('20')).not.toBe(-1);

      fireEvent.change(cioMaxSlider, { target: { value: 70 } });
      fireEvent.mouseUp(cioMaxSlider);

      const updatedFiltersWithMaxSliderMove = getRequestFilters(container);
      expect(updatedFiltersWithMaxSliderMove.price[0].indexOf('70')).not.toBe(-1);
    });

    it('SliderRange: Using Touch Events - Upon moving the slider buttons, requestFilters should be updated', async () => {
      const { container } = render(<TestFiltersApplied />);
      const cioMinSlider = container.querySelector('.cio-min-slider');
      const cioMaxSlider = container.querySelector('.cio-max-slider');

      fireEvent.change(cioMinSlider, { target: { value: 20 } });
      fireEvent.touchEnd(cioMinSlider);

      const updatedFiltersWithMinSliderMove = getRequestFilters(container);
      expect(updatedFiltersWithMinSliderMove.price[0].indexOf('20')).not.toBe(-1);

      fireEvent.change(cioMaxSlider, { target: { value: 70 } });
      fireEvent.touchEnd(cioMaxSlider);

      const updatedFiltersWithMaxSliderMove = getRequestFilters(container);
      expect(updatedFiltersWithMaxSliderMove.price[0].indexOf('70')).not.toBe(-1);
    });

    it('SliderRange with custom sliderStep: Should have correct step attribute and behavior', async () => {
      function TestFiltersWithCustomStep() {
        const mockPriceFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 0,
          max: 100,
          status: {},
        };

        const [currentUrl, setCurrentUrl] = useState(testJsonEncodedUrl);
        const [filters, setFilters] = useState('');

        useEffect(() => {
          if (currentUrl !== '') {
            const { filters: requestFilters } = getStateFromUrl(currentUrl);
            setFilters(JSON.stringify(requestFilters));
          }
        }, [currentUrl]);

        return (
          <CioPlp
            apiKey={DEMO_API_KEY}
            urlHelpers={{ setUrl: setCurrentUrl, getUrl: () => currentUrl }}>
            <Filters facets={[mockPriceFacet]} sliderStep={0.5} />
            <div id='request-filters'>{filters}</div>
          </CioPlp>
        );
      }

      const { container } = render(<TestFiltersWithCustomStep />);

      await waitFor(() => {
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');
        const minNumberInput = container.querySelector('.cio-slider-input-min input');
        const maxNumberInput = container.querySelector('.cio-slider-input-max input');

        expect(minInputSlider).toHaveAttribute('step', '0.5');
        expect(maxInputSlider).toHaveAttribute('step', '0.5');
        expect(minNumberInput).toHaveAttribute('step', '0.5');
        expect(maxNumberInput).toHaveAttribute('step', '0.5');

        fireEvent.change(minNumberInput, { target: { value: 25.5 } });
        fireEvent.blur(minNumberInput);

        const filters = getRequestFilters(container);
        expect(filters.price[0].indexOf('25.5')).not.toBe(-1);
      });
    });

    it('SliderRange with facet-specific sliderStep: Should prioritize facet-specific over global step and handle interactions', async () => {
      function TestFiltersWithFacetSpecificStep() {
        const mockPriceFacet = {
          displayName: 'Price',
          name: 'price',
          type: 'range',
          data: {},
          hidden: false,
          min: 0,
          max: 100,
          status: {},
        };

        const [currentUrl, setCurrentUrl] = useState(testJsonEncodedUrl);
        const [filters, setFilters] = useState('');

        useEffect(() => {
          if (currentUrl !== '') {
            const { filters: requestFilters } = getStateFromUrl(currentUrl);
            setFilters(JSON.stringify(requestFilters));
          }
        }, [currentUrl]);

        return (
          <CioPlp
            apiKey={DEMO_API_KEY}
            urlHelpers={{ setUrl: setCurrentUrl, getUrl: () => currentUrl }}>
            <Filters facets={[mockPriceFacet]} sliderStep={0.1} facetSliderSteps={{ price: 2 }} />
            <div id='request-filters'>{filters}</div>
          </CioPlp>
        );
      }

      const { container } = render(<TestFiltersWithFacetSpecificStep />);

      await waitFor(() => {
        const minInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-min-slider');
        const maxInputSlider = container.querySelector('.cio-doubly-ended-slider .cio-max-slider');
        const minNumberInput = container.querySelector('.cio-slider-input-min input');
        const maxNumberInput = container.querySelector('.cio-slider-input-max input');

        expect(minInputSlider).toHaveAttribute('step', '2');
        expect(maxInputSlider).toHaveAttribute('step', '2');
        expect(minNumberInput).toHaveAttribute('step', '2');
        expect(maxNumberInput).toHaveAttribute('step', '2');

        fireEvent.change(minInputSlider, { target: { value: 24 } });
        fireEvent.mouseUp(minInputSlider);

        const filtersAfterSliderMove = getRequestFilters(container);
        expect(filtersAfterSliderMove.price[0].indexOf('24')).not.toBe(-1);

        fireEvent.change(maxNumberInput, { target: { value: 88 } });
        fireEvent.blur(maxNumberInput);

        const filtersAfterInputChange = getRequestFilters(container);
        expect(filtersAfterInputChange.price[0].indexOf('88')).not.toBe(-1);
      });
    });

    it('Single Facet: Should render options for single type facet', async () => {
      const { getByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockSingleFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        expect(getByText('Size')).toBeInTheDocument();
        expect(getByText('Small')).toBeInTheDocument();
        expect(getByText('Medium')).toBeInTheDocument();
        expect(getByText('Large')).toBeInTheDocument();

        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        expect(checkboxes).toHaveLength(3);
      });
    });

    it('Single Facet: Selecting an option should de-select other options', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockSingleFacet]} />
        </CioPlp>,
      );

      const smallCheckbox = container.querySelector('input[id="size-small"]');
      const mediumCheckbox = container.querySelector('input[id="size-medium"]');
      const largeCheckbox = container.querySelector('input[id="size-large"]');

      // Select "Small" option
      fireEvent.click(smallCheckbox);
      expect(smallCheckbox).toBeChecked();
      expect(mediumCheckbox).not.toBeChecked();
      expect(largeCheckbox).not.toBeChecked();

      // Select "Medium" option - should de-select "Small"
      fireEvent.click(mediumCheckbox);
      expect(smallCheckbox).not.toBeChecked();
      expect(mediumCheckbox).toBeChecked();
      expect(largeCheckbox).not.toBeChecked();

      // Select "Large" option - should de-select "Medium"
      fireEvent.click(largeCheckbox);
      expect(smallCheckbox).not.toBeChecked();
      expect(mediumCheckbox).not.toBeChecked();
      expect(largeCheckbox).toBeChecked();
    });

    it('Single Facet: Selecting an already selected option should de-select it', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockSingleFacet]} />
        </CioPlp>,
      );

      const smallCheckbox = container.querySelector('input[id="size-small"]');

      // Select "Small" option
      fireEvent.click(smallCheckbox);
      expect(smallCheckbox).toBeChecked();

      // Click "Small" again - should de-select it
      fireEvent.click(smallCheckbox);
      expect(smallCheckbox).not.toBeChecked();
    });
  });

  describe(' - Visual Filter Tests', () => {
    const mockVisualFacet = {
      displayName: 'Color',
      name: 'color',
      type: 'multiple',
      data: { cio_render_visual: true },
      hidden: false,
      options: [
        {
          status: '',
          count: 10,
          displayName: 'Red',
          value: 'red',
          data: { hex_color: '#FF0000' },
        },
        {
          status: '',
          count: 8,
          displayName: 'Blue',
          value: 'blue',
          data: { image_url: 'https://example.com/blue.png' },
        },
        {
          status: '',
          count: 5,
          displayName: 'Plain',
          value: 'plain',
          data: {},
        },
      ],
    };

    it('Should render FilterOptionVisual for options with visual data in a visual facet', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockVisualFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        const visualOptions = container.querySelectorAll('[data-slot="visual-filter-option"]');
        expect(visualOptions.length).toBe(2);
      });
    });

    it('Should fall back to standard FilterOption for options without visual data in a visual facet', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[mockVisualFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        const standardOptions = container.querySelectorAll('[data-slot="filter-option"]');
        const visualOptions = container.querySelectorAll('[data-slot="visual-filter-option"]');
        // 2 visual options (Red with hex_color, Blue with image_url)
        // 1 standard option (Plain with no visual data)
        expect(visualOptions.length).toBe(2);
        expect(standardOptions.length).toBe(1);
      });
    });

    it('Should render standard FilterOption when facet is not visual', async () => {
      const nonVisualFacet = {
        ...mockVisualFacet,
        data: {},
      };

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[nonVisualFacet]} />
        </CioPlp>,
      );

      await waitFor(() => {
        const visualOptions = container.querySelectorAll('[data-slot="visual-filter-option"]');
        expect(visualOptions.length).toBe(0);

        const filterOptions = container.querySelectorAll('[data-slot="filter-option"]');
        expect(filterOptions.length).toBe(3);
      });
    });

    it('Should render visual options via getVisualImageUrl callback', async () => {
      const facetWithoutMetadata = {
        ...mockVisualFacet,
        options: mockVisualFacet.options.map((o) => ({ ...o, data: {} })),
      };

      const getVisualImageUrl = (option) => {
        if (option.value === 'red') return 'https://example.com/red.png';
        return undefined;
      };

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[facetWithoutMetadata]} getVisualImageUrl={getVisualImageUrl} />
        </CioPlp>,
      );

      await waitFor(() => {
        const visualOptions = container.querySelectorAll('[data-slot="visual-filter-option"]');
        expect(visualOptions.length).toBe(1);
      });
    });

    it('Should respect perFacetConfigs override to disable visual rendering', async () => {
      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={[mockVisualFacet]}
            perFacetConfigs={{ color: { isVisualFacet: false } }}
          />
        </CioPlp>,
      );

      await waitFor(() => {
        const visualOptions = container.querySelectorAll('[data-slot="visual-filter-option"]');
        expect(visualOptions.length).toBe(0);

        const filterOptions = container.querySelectorAll('[data-slot="filter-option"]');
        expect(filterOptions.length).toBe(3);
      });
    });

    it('Should respect perFacetConfigs override to enable visual rendering', async () => {
      const facetWithoutVisualData = {
        ...mockVisualFacet,
        data: {},
      };

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={[facetWithoutVisualData]}
            perFacetConfigs={{ color: { isVisualFacet: true } }}
          />
        </CioPlp>,
      );

      await waitFor(() => {
        const visualOptions = container.querySelectorAll('[data-slot="visual-filter-option"]');
        expect(visualOptions.length).toBe(2);
      });
    });
  });

  describe(' - Facet Blacklisting Tests', () => {
    it('Should not render facets when isHiddenFilterFn returns true', async () => {
      const isHiddenFilterFn = (facet) => facet.name === 'color'; // lowercase 'color'
      const { queryByText, getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockTransformedFacets} isHiddenFilterFn={isHiddenFilterFn} />
        </CioPlp>,
      );

      await waitFor(() => {
        // Color facet should not be rendered
        expect(queryByText('Color')).not.toBeInTheDocument();
        // Other facets should still render
        const otherFacet = mockTransformedFacets.find((f) => f.name !== 'color');
        expect(getByText(otherFacet.displayName)).toBeInTheDocument();
      });
    });

    it('Should not render facets with data.cio_plp_hidden = true', async () => {
      const facetsWithHidden = mockTransformedFacets.map((facet, index) => ({
        ...facet,
        data: {
          ...facet.data,
          cio_plp_hidden: index === 0, // Hide first facet
        },
      }));

      const { queryByText, getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={facetsWithHidden} />
        </CioPlp>,
      );

      await waitFor(() => {
        // First facet should not be rendered
        expect(queryByText(facetsWithHidden[0].displayName)).not.toBeInTheDocument();
        // Other facets should still render
        expect(getByText(facetsWithHidden[1].displayName)).toBeInTheDocument();
      });
    });

    it('Should not render options when isHiddenFilterOptionFn returns true', async () => {
      const colorFacet = mockTransformedFacets.find((f) => f.name === 'color'); // lowercase
      const optionToHide = colorFacet.options[0];
      const isHiddenFilterOptionFn = (option) => option.value === optionToHide.value;

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={[colorFacet]}
            isHiddenFilterOptionFn={isHiddenFilterOptionFn}
            initialNumOptions={100}
          />
        </CioPlp>,
      );

      await waitFor(() => {
        // The hidden option should not be rendered
        const colorFilterGroup = container.querySelector('.cio-filter-group');
        const optionLabels = colorFilterGroup.querySelectorAll('.cio-filter-multiple-option label');
        const optionTexts = Array.from(optionLabels).map((label) => label.textContent);

        expect(optionTexts).not.toContain(optionToHide.displayName);
        // Other options should still render
        expect(optionTexts.length).toBe(colorFacet.options.length - 1);
      });
    });

    it('Should not render options with data.cio_plp_hidden = true', async () => {
      const colorFacet = mockTransformedFacets.find((f) => f.name === 'color'); // lowercase
      const facetWithHiddenOption = {
        ...colorFacet,
        options: colorFacet.options.map((option, index) => ({
          ...option,
          data: {
            ...option.data,
            cio_plp_hidden: index === 0, // Hide first option
          },
        })),
      };

      const { container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={[facetWithHiddenOption]} initialNumOptions={100} />
        </CioPlp>,
      );

      await waitFor(() => {
        const colorFilterGroup = container.querySelector('.cio-filter-group');
        const optionLabels = colorFilterGroup.querySelectorAll('.cio-filter-multiple-option label');
        const optionTexts = Array.from(optionLabels).map((label) => label.textContent);

        // First option should not be rendered
        expect(optionTexts).not.toContain(colorFacet.options[0].displayName);
        // Other options should still render
        expect(optionTexts.length).toBe(colorFacet.options.length - 1);
      });
    });

    it('Should hide facets from both isHiddenFilterFn and data.cio_plp_hidden', async () => {
      const facetsWithHidden = mockTransformedFacets.map((facet, index) => ({
        ...facet,
        data: {
          ...facet.data,
          cio_plp_hidden: index === 0, // Hide first facet via metadata
        },
      }));

      const isHiddenFilterFn = (facet) => facet.name === facetsWithHidden[1].name; // Hide second facet via fn

      const { queryByText, container } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={facetsWithHidden} isHiddenFilterFn={isHiddenFilterFn} />
        </CioPlp>,
      );

      await waitFor(() => {
        // Both first and second facets should be hidden
        expect(queryByText(facetsWithHidden[0].displayName)).not.toBeInTheDocument();
        expect(queryByText(facetsWithHidden[1].displayName)).not.toBeInTheDocument();
        // Remaining facets should render
        const filterGroups = container.querySelectorAll('.cio-filter-group');
        expect(filterGroups.length).toBe(facetsWithHidden.length - 2);
      });
    });
  });

  describe(' - Collapse Behavior Tests', () => {
    const isFilterGroupExpanded = (filterGroup) => {
      const arrow = filterGroup.querySelector('.cio-arrow');
      return arrow?.classList.contains('cio-arrow-down');
    };

    it('Interface 1 (Metadata): Should collapse filter groups with cio_render_collapsed metadata', async () => {
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockFacetsWithMetadata} />
        </CioPlp>,
      );

      await waitFor(() => {
        // Color has cio_render_collapsed: true -> should be collapsed
        const colorHeader = getByText('Color').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);

        // Size has no cio_render_collapsed -> should be expanded
        const sizeHeader = getByText('Size').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(sizeHeader)).toBe(true);

        // Price has cio_render_collapsed: true -> should be collapsed
        const priceHeader = getByText('Price').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(priceHeader)).toBe(false);
      });
    });

    it('Interface 2 (Global prop): defaultCollapsed=true should collapse all filter groups', async () => {
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockFacetsWithMetadata} defaultCollapsed />
        </CioPlp>,
      );

      await waitFor(() => {
        const colorHeader = getByText('Color').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);

        const sizeHeader = getByText('Size').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(sizeHeader)).toBe(false);

        const priceHeader = getByText('Price').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(priceHeader)).toBe(false);
      });
    });

    it('Interface 2 (Global prop): defaultCollapsed=false should not override facet metadata', async () => {
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockFacetsWithMetadata} defaultCollapsed={false} />
        </CioPlp>,
      );

      await waitFor(() => {
        // Color has cio_render_collapsed: true metadata, which takes precedence over defaultCollapsed
        const colorHeader = getByText('Color').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);

        // Size has no metadata, falls through to defaultCollapsed=false
        const sizeHeader = getByText('Size').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(sizeHeader)).toBe(true);

        // Price has cio_render_collapsed: true metadata, which takes precedence over defaultCollapsed
        const priceHeader = getByText('Price').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(priceHeader)).toBe(false);
      });
    });

    it('Interface 3 (Per-facet config): perFacetConfigs isCollapsed should collapse only specified facets', async () => {
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={mockFacetsWithMetadata}
            perFacetConfigs={{ color: { isCollapsed: true }, price: { isCollapsed: true } }}
          />
        </CioPlp>,
      );

      await waitFor(() => {
        const colorHeader = getByText('Color').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);

        const sizeHeader = getByText('Size').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(sizeHeader)).toBe(true);

        const priceHeader = getByText('Price').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(priceHeader)).toBe(false);
      });
    });

    it('Priority: perFacetConfigs isCollapsed=false should override defaultCollapsed=true', async () => {
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters
            facets={mockFacetsWithMetadata}
            defaultCollapsed
            perFacetConfigs={{ size: { isCollapsed: false } }}
          />
        </CioPlp>,
      );

      await waitFor(() => {
        // color has cio_render_collapsed metadata -> collapsed
        const colorHeader = getByText('Color').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);

        // size explicitly set to isCollapsed: false via perFacetConfigs
        const sizeHeader = getByText('Size').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(sizeHeader)).toBe(true);

        // price has cio_render_collapsed metadata -> collapsed
        const priceHeader = getByText('Price').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(priceHeader)).toBe(false);
      });
    });

    it('Collapsed filter groups can still be toggled open by clicking the header', async () => {
      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockFacetsWithMetadata} defaultCollapsed />
        </CioPlp>,
      );

      await waitFor(() => {
        const colorHeader = getByText('Color').closest('.cio-filter-group');
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);

        // Click the header to expand
        fireEvent.click(getByText('Color'));
        expect(isFilterGroupExpanded(colorHeader)).toBe(true);

        // Click again to collapse
        fireEvent.click(getByText('Color'));
        expect(isFilterGroupExpanded(colorHeader)).toBe(false);
      });
    });

    it('Render props: getIsCollapsed should be available in render props', async () => {
      const mockChildren = jest.fn().mockReturnValue(<div>Custom Filters</div>);

      render(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Filters facets={mockFacetsWithMetadata} defaultCollapsed>
            {mockChildren}
          </Filters>
        </CioPlp>,
      );

      expect(mockChildren).toHaveBeenCalled();
      const renderPropsArg = mockChildren.mock.calls[0][0];
      expect(renderPropsArg).toHaveProperty('getIsCollapsed');
      expect(typeof renderPropsArg.getIsCollapsed).toBe('function');
    });
  });
});
