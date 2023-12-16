/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import Pagination from '../Pagination'; // Adjust the import path as needed
import UsePaginationExample from '../Stories/Hooks/UsePaginationExample';

describe('Pagination Component', () => {
  const pagination = {
    currentPage: 1,
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    pages: [1, 2, 3, 4, 5],
    prevPage: jest.fn(),
    totalPages: 5,
  };

  it('renders the pagination buttons', () => {
    const { getByText } = render(<Pagination pagination={pagination} />);

    expect(getByText('Previous')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });

  it('calls goToPage on page number buttons', () => {
    const mockGoToPage = jest.fn();

    const paginationProps = {
      pagination: {
        currentPage: 1,
        totalPages: 5,
        pages: [1, 2, 3, 4, 5],
        goToPage: mockGoToPage,
        nextPage: jest.fn(),
        prevPage: jest.fn(),
      },
      children: null,
    };

    render(<Pagination {...paginationProps} />);

    paginationProps.pagination.pages.forEach((page) => {
      fireEvent.click(screen.getByText(page.toString()));
      expect(mockGoToPage).toHaveBeenCalledWith(page);
    });
  });

  it('renders with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Render</div>);

    const paginationProps = {
      pagination: {
        currentPage: 1,
        totalPages: 5,
        pages: [1, 2, 3, 4, 5],
        goToPage: jest.fn(),
        nextPage: jest.fn(),
        prevPage: jest.fn(),
      },
      children: mockChildren,
    };

    render(<Pagination {...paginationProps} />);
    expect(mockChildren).toHaveBeenCalled();
    expect(screen.getByText('Custom Render')).toBeInTheDocument();
  });

  it('calls the goToPage function when a page button is clicked', () => {
    const { getByText } = render(<Pagination pagination={pagination} />);
    fireEvent.click(getByText('2'));
    expect(pagination.goToPage).toHaveBeenCalledWith(2);
  });

  it('calls the prevPage function when the Previous button is clicked', () => {
    const { getByText } = render(<Pagination pagination={pagination} />);
    fireEvent.click(getByText('Previous'));
    expect(pagination.prevPage).toHaveBeenCalledTimes(1);
  });

  it('calls the nextPage function when the Next button is clicked', () => {
    const { getByText } = render(<Pagination pagination={pagination} />);
    fireEvent.click(getByText('Next'));
    expect(pagination.nextPage).toHaveBeenCalledTimes(1);
  });
});

// Integration Test
describe('Test user interactions', () => {
  const props = {
    initialPage: 1,
    totalNumResults: 200,
    resultsPerPage: 10,
    windowSize: 5,
  };

  const breakPageText = '...';

  // Rendered pages should be [1, '...', 3, 4, 5, 6, 7, '...', 20] when currentPage is 5
  it('should render the correct pages when somewhere in the middle', () => {
    const { getByText, getAllByText } = render(<UsePaginationExample {...props} />);
    // Go to page 5
    fireEvent.click(getByText('5'));
    expect(getAllByText(breakPageText)).toHaveLength(2);

    expect(getByText('1')).toBeInTheDocument();
    expect(getAllByText(breakPageText)[0]).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText('6')).toBeInTheDocument();
    expect(getByText('7')).toBeInTheDocument();
    expect(getAllByText(breakPageText)[1]).toBeInTheDocument();
    expect(getByText('20')).toBeInTheDocument();
  });

  // Rendered pages should be [1, 2, 3, 4, 5, '...', 20] when currentPage is 1
  it('should render the correct pages when somewhere in near the start', () => {
    props.initialPage = 5;
    const { getByText, getAllByText } = render(<UsePaginationExample {...props} />);

    // Go to page 1
    fireEvent.click(getByText('1'));
    expect(getAllByText(breakPageText)).toHaveLength(1);

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
    expect(getByText(breakPageText)).toBeInTheDocument();
    expect(getByText('20')).toBeInTheDocument();
  });

  // Rendered pages should be [1, '...', 16, 17, 18, 19, 20] when currentPage is 20
  it('should render the correct pages when somewhere in near the start', () => {
    const { getByText, getAllByText } = render(<UsePaginationExample {...props} />);

    // Go to page 20
    fireEvent.click(getByText('20'));
    expect(getAllByText(breakPageText)).toHaveLength(1);

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('16')).toBeInTheDocument();
    expect(getByText('17')).toBeInTheDocument();
    expect(getByText('18')).toBeInTheDocument();
    expect(getByText('19')).toBeInTheDocument();
    expect(getByText(breakPageText)).toBeInTheDocument();
    expect(getByText('20')).toBeInTheDocument();
  });
});
