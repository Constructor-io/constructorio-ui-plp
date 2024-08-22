import React from 'react';
import { renderToString } from 'react-dom/server';
import { act } from 'react-dom/test-utils';
import Pagination from '../../../src/components/Pagination';
import CioPlp from '../../../src/components/CioPlp';
import { DEMO_API_KEY } from '../../../src/constants';

describe('Testing Component on the server: Pagination', () => {
  it('renders the next and previous buttons', () => {
    const paginationProps = {
      totalNumResults: 100,
    };

    act(() => {
      const html = renderToString(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Pagination {...paginationProps} />
        </CioPlp>,
      );
      expect(html).toContain('<');
      expect(html).toContain('>');
    });
  });

  it('renders with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Pagination</div>);

    const paginationProps = {
      totalNumResults: 100,
      children: mockChildren,
    };

    act(() => {
      const html = renderToString(
        <CioPlp apiKey={DEMO_API_KEY}>
          <Pagination {...paginationProps} />
        </CioPlp>,
      );
      expect(mockChildren).toHaveBeenCalled();
      expect(html).toContain('Custom Pagination');
    });
  });
});
