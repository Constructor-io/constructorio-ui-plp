import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEMO_API_KEY } from '../src/constants';
import CioPlp from '../src/components/CioPlp';
import Filters from '../src/components/Filters';
import mockTransformedFacets from './local_examples/sampleFacets.json';

describe('Testing Component: Sort', () => {
  let location;
  const mockLocation = new URL('https://example.com');

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    location = window.location;
    delete window.location;
    window.location = mockLocation;
    mockLocation.href = 'https://example.com/';
  });

  afterAll(() => {
    window.location = location;
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  // it('Should throw error if used outside the CioPlp', () => {
  //   expect(() => render(<Filters facets={mockTransformedFacets} />)).toThrow();
  // });

  it('Should render filters based on list of facets', async () => {
    const { getByText, container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Filters facets={mockTransformedFacets} />
      </CioPlp>,
    );

    await waitFor(() => {
      const showAllButtons = container.querySelectorAll('.cio-see-all');
      showAllButtons.forEach((btn) => fireEvent.click(btn));

      mockTransformedFacets.forEach((facetGroup) => {
        expect(getByText(facetGroup.displayName).toBeInTheDocument);

        if (facetGroup.type === 'multiple') {
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
        <Filters facets={mockTransformedFacets} initialNumOptions={initialNumOptions} />
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
        <Filters facets={mockTransformedFacets} />
      </CioPlp>,
    );

    const colorFacetData = mockTransformedFacets.find(
      (facetGroup) => facetGroup.displayName === 'Color',
    );
    const selectedOption = colorFacetData.options.find((option) => option.status === 'selected');
    expect(container.querySelector(`#${selectedOption.value}:checked`)).not.toBeNull();

    const newSelectedOption = colorFacetData.options.find((option) => option.status !== 'selected');
    fireEvent.click(getByText(newSelectedOption.value));
    expect(container.querySelector(`#${newSelectedOption.value}:checked`)).not.toBeNull();
  });

  it('Should render correctly with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Filters</div>);

    const filtersProps = {
      facets: mockTransformedFacets,
      children: mockChildren,
    };

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Filters {...filtersProps} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(getByText('Custom Filters')).toBeInTheDocument();
  });
});
