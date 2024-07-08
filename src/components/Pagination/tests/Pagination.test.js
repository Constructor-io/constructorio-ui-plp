/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination'; // Adjust the import path as needed
import CioPlp from '../../CioPlp';
import { DEMO_API_KEY } from '../../../constants';

let location;
const mockLocation = new URL('https://example.com');

beforeEach(() => {
  location = window.location;
  delete window.location;
  window.location = mockLocation;
  mockLocation.href = 'https://example.com/';
});

afterAll(() => {
  window.location = location;
});

describe('Pagination Component', () => {
  it('renders the pagination buttons', () => {
    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} />
      </CioPlp>,
    );

    expect(getByText('<')).toBeInTheDocument();
    expect(getByText('>')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();
    expect(getByText('5')).toBeInTheDocument();
  });

  it('renders with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Pagination</div>);
    const paginationProps = {
      totalNumResults: 100,
      children: mockChildren,
    };

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination {...paginationProps} />
      </CioPlp>,
    );

    expect(mockChildren).toHaveBeenCalled();
    expect(getByText('Custom Pagination')).toBeInTheDocument();
  });
});

// Interaction Test
// TODO: Fix Pagination tests and remove ".skip"
describe.skip('Test user interactions', () => {
  const props = {
    totalNumResults: 200,
    resultsPerPage: 10,
    windowSize: 5,
  };

  const breakPageText = '...';

  // Rendered pages should be [1, '...', 3, 4, 5, 6, 7, '...', 20] when currentPage is 5
  it('should render the correct pages when somewhere in the middle', () => {
    const { getByText, getAllByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination {...props} />
      </CioPlp>,
    );
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
  it('should render the correct pages when somewhere near the start', () => {
    const { getByText, getAllByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination {...props} />
      </CioPlp>,
    );

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
  it('should render the correct pages when somewhere near the end', () => {
    const { getByText, getAllByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination {...props} />
      </CioPlp>,
    );

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
