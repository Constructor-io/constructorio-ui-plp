import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterOptionsList from '../../../src/components/Filters/FilterOptionsList';

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
      render(
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
      render(
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
      render(
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
      render(
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
      render(
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
      render(
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

  describe('Prop precedence', () => {
    it('Should prefer new facet prop over deprecated multipleFacet when both are provided', () => {
      render(
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
