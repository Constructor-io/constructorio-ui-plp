import React from 'react';
import { renderToString } from 'react-dom/server';
import { act } from 'react-dom/test-utils';
import Pagination from '../src/components/Pagination/Pagination';

describe('Pagination Component (Server-Side Rendering)', () => {
  const pagination = {
    currentPage: 1,
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    pages: [1, 2, 3, 4, 5],
    prevPage: jest.fn(),
    totalPages: 5,
  };

  it('renders the pagination buttons', () => {
    act(() => {
      const html = renderToString(<Pagination pagination={pagination} />);
      expect(html).toContain('Previous');
      expect(html).toContain('Next');
      pagination.pages.forEach((page) => {
        expect(html).toContain(page.toString());
      });
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

    act(() => {
      const html = renderToString(<Pagination {...paginationProps} />);
      expect(mockChildren).toHaveBeenCalled();
      expect(html).toContain('Custom Render');
    });
  });
});
