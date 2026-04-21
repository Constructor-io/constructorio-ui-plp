/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Pagination from '../../../src/components/Pagination';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';

const originalWindowLocation = window.location;

beforeEach(() => {
  window.innerWidth = 1024;
  fireEvent(window, new Event('resize'));
  window.location = 'https://example.com';
});

afterEach(() => {
  window.location = originalWindowLocation;
});

describe('Pagination Component', () => {
  it('renders the pagination buttons', () => {
    const paginationProps = {
      totalNumResults: 100,
    };

    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination {...paginationProps} />
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

  it('rerenders the pagination buttons on window resize', () => {
    const { getByText, queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} />
      </CioPlp>,
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();

    window.innerWidth = 500;
    fireEvent(window, new Event('resize'));

    waitFor(() => {
      expect(queryByText('2')).not.toBeInTheDocument();
    });
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

describe('Pagination with useAnchors', () => {
  it('renders page numbers as anchors and prev/next as buttons', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} useAnchors />
      </CioPlp>,
    );

    const anchors = container.querySelectorAll('.cio-pagination a');
    const buttons = container.querySelectorAll('.cio-pagination button');
    expect(anchors.length).toBeGreaterThan(0);
    // prev and next remain as buttons
    expect(buttons.length).toBe(2);
  });

  it('prev and next remain as buttons with correct test ids', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} useAnchors />
      </CioPlp>,
    );

    const prevButton = container.querySelector('button[data-testid="cio-pagination-prev-button"]');
    const nextButton = container.querySelector('button[data-testid="cio-pagination-next-button"]');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('page anchors have href attributes containing page parameter', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} useAnchors />
      </CioPlp>,
    );

    const pageAnchors = Array.from(container.querySelectorAll('.cio-pagination a'));
    // page=1 is intentionally omitted from the URL for SEO canonical reasons,
    // so only assert page= presence for anchors representing pages > 1.
    const nonFirstPageAnchors = pageAnchors.filter((a) => a.textContent !== '1');
    expect(nonFirstPageAnchors.length).toBeGreaterThan(0);
    nonFirstPageAnchors.forEach((a) => {
      expect(a.getAttribute('href')).toContain(`page=${a.textContent}`);
    });
  });

  it('active page has aria-current="page"', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} useAnchors />
      </CioPlp>,
    );

    const activePage = container.querySelector('a.selected');
    expect(activePage).toHaveAttribute('aria-current', 'page');
  });

  it('ellipsis is rendered as span, not anchor', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={200} resultsPerPage={10} windowSize={5} useAnchors />
      </CioPlp>,
    );

    const ellipsisSpans = container.querySelectorAll('.cio-pagination-ellipsis');
    expect(ellipsisSpans.length).toBeGreaterThan(0);
    ellipsisSpans.forEach((span) => {
      expect(span.tagName).toBe('SPAN');
    });
  });

  it('still renders all buttons when useAnchors is not set', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} />
      </CioPlp>,
    );

    const buttons = container.querySelectorAll('.cio-pagination button');
    const anchors = container.querySelectorAll('.cio-pagination a');
    expect(buttons.length).toBeGreaterThan(0);
    expect(anchors.length).toBe(0);
  });

  it('modifier-click (Cmd/Ctrl/Shift/Alt) does not trigger SPA navigation', () => {
    const setUrlSpy = jest.fn();
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY} urlHelpers={{ setUrl: setUrlSpy }}>
        <Pagination totalNumResults={100} useAnchors />
      </CioPlp>,
    );

    const pageAnchors = Array.from(container.querySelectorAll('.cio-pagination a'));
    const anchorForPage2 = pageAnchors.find((a) => a.textContent === '2');
    expect(anchorForPage2).toBeDefined();

    fireEvent.click(anchorForPage2, { metaKey: true });
    fireEvent.click(anchorForPage2, { ctrlKey: true });
    fireEvent.click(anchorForPage2, { shiftKey: true });
    fireEvent.click(anchorForPage2, { altKey: true });

    expect(setUrlSpy).not.toHaveBeenCalled();

    // Sanity check: an unmodified click still triggers navigation
    fireEvent.click(anchorForPage2);
    expect(setUrlSpy).toHaveBeenCalledTimes(1);
  });
});

describe('Pagination without useAnchors (button branch)', () => {
  it('active page button has aria-current="page"', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={100} />
      </CioPlp>,
    );

    const activeButton = container.querySelector('button.selected');
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('ellipsis is rendered as span, not button', () => {
    const { container } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination totalNumResults={200} resultsPerPage={10} windowSize={5} />
      </CioPlp>,
    );

    const ellipsisSpans = container.querySelectorAll('.cio-pagination-ellipsis');
    expect(ellipsisSpans.length).toBeGreaterThan(0);
    ellipsisSpans.forEach((span) => {
      expect(span.tagName).toBe('SPAN');
    });
  });
});

// Interaction Test
describe('Test user interactions', () => {
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

    waitFor(() => {
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
  });

  // Rendered pages should be [1, 2, 3, 4, 5, '...', 20] when currentPage is 1
  it('should render the correct pages when somewhere near the start', () => {
    const { getByText, getAllByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Pagination {...props} />
      </CioPlp>,
    );

    waitFor(() => {
      expect(getAllByText(breakPageText)).toHaveLength(1);

      expect(getByText('1')).toBeInTheDocument();
      expect(getByText('2')).toBeInTheDocument();
      expect(getByText('3')).toBeInTheDocument();
      expect(getByText('4')).toBeInTheDocument();
      expect(getByText('5')).toBeInTheDocument();
      expect(getByText(breakPageText)).toBeInTheDocument();
      expect(getByText('20')).toBeInTheDocument();
    });
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

    waitFor(() => {
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
});
