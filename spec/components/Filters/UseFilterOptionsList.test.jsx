import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterOptionsList from '../../../src/components/Filters/FilterOptionsList';
import { renderWithCioPlp } from '../../test-utils';

const mockModifyRequestMultipleFilter = jest.fn();

const mockMultipleFacet = {
  displayName: 'Color',
  name: 'color',
  type: 'multiple',
  data: {},
  hidden: false,
  options: [
    { status: '', count: 10, displayName: 'Red', value: 'red', data: {} },
    { status: '', count: 20, displayName: 'Blue', value: 'blue', data: {} },
    { status: '', count: 15, displayName: 'Green', value: 'green', data: {} },
  ],
};

const mockSingleFacet = {
  displayName: 'Size',
  name: 'size',
  type: 'single',
  data: {},
  hidden: false,
  options: [
    { status: '', count: 5, displayName: 'Small', value: 'small', data: {} },
    { status: '', count: 10, displayName: 'Medium', value: 'medium', data: {} },
  ],
};

describe('UseFilterOptionsList - Prop Backwards Compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Using new "facet" prop', () => {
    it('Should render options when using the new facet prop with multiple type', () => {
      renderWithCioPlp(
        <FilterOptionsList
          facet={mockMultipleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('Should render options when using the new facet prop with single type', () => {
      renderWithCioPlp(
        <FilterOptionsList
          facet={mockSingleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('Should handle option selection when using new facet prop', () => {
      renderWithCioPlp(
        <FilterOptionsList
          facet={mockMultipleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      fireEvent.click(screen.getByText('Red'));
      expect(mockModifyRequestMultipleFilter).toHaveBeenCalledWith(['red']);
    });
  });

  describe('Using deprecated "multipleFacet" prop', () => {
    it('Should render options when using the deprecated multipleFacet prop with multiple type', () => {
      renderWithCioPlp(
        <FilterOptionsList
          multipleFacet={mockMultipleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('Should render options when using the deprecated multipleFacet prop with single type', () => {
      renderWithCioPlp(
        <FilterOptionsList
          multipleFacet={mockSingleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('Should handle option selection when using deprecated multipleFacet prop', () => {
      renderWithCioPlp(
        <FilterOptionsList
          multipleFacet={mockMultipleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      fireEvent.click(screen.getByText('Blue'));
      expect(mockModifyRequestMultipleFilter).toHaveBeenCalledWith(['blue']);
    });
  });

  describe('"Show All" button visibility with hidden options', () => {
    const mockFacetFiveOptions = {
      displayName: 'Color',
      name: 'color',
      type: 'multiple',
      data: {},
      hidden: false,
      options: [
        { status: '', count: 10, displayName: 'Red', value: 'red', data: {} },
        { status: '', count: 20, displayName: 'Blue', value: 'blue', data: {} },
        { status: '', count: 15, displayName: 'Green', value: 'green', data: {} },
        { status: '', count: 5, displayName: 'Yellow', value: 'yellow', data: {} },
        { status: '', count: 8, displayName: 'Purple', value: 'purple', data: {} },
      ],
    };

    it('Should NOT show the "Show All" button when filtered options count is at or below initialNumOptions', () => {
      // 5 total options, but hide 3 -> 2 visible. initialNumOptions=3, so no button.
      const hideAllButRedAndBlue = (option) =>
        !['red', 'blue'].includes(option.value);

      renderWithCioPlp(
        <FilterOptionsList
          facet={mockFacetFiveOptions}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={3}
          isCollapsed={false}
          isHiddenFilterOptionFn={hideAllButRedAndBlue}
        />,
      );

      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.queryByText('Show All')).not.toBeInTheDocument();
    });

    it('Should still show the "Show All" button when filtered options count exceeds initialNumOptions', () => {
      // 5 total options, hide 1 -> 4 visible. initialNumOptions=3, so button shows.
      const hidePurple = (option) => option.value === 'purple';

      renderWithCioPlp(
        <FilterOptionsList
          facet={mockFacetFiveOptions}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={3}
          isCollapsed={false}
          isHiddenFilterOptionFn={hidePurple}
        />,
      );

      expect(screen.getByText('Show All')).toBeInTheDocument();
    });
  });

  describe('Prop precedence', () => {
    it('Should prefer new facet prop over deprecated multipleFacet when both are provided', () => {
      renderWithCioPlp(
        <FilterOptionsList
          facet={mockMultipleFacet}
          multipleFacet={mockSingleFacet}
          modifyRequestMultipleFilter={mockModifyRequestMultipleFilter}
          initialNumOptions={10}
          isCollapsed={false}
        />,
      );

      // Should render options from mockMultipleFacet (Color), not mockSingleFacet (Size)
      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
      expect(screen.queryByText('Small')).not.toBeInTheDocument();
      expect(screen.queryByText('Medium')).not.toBeInTheDocument();
    });
  });

});
