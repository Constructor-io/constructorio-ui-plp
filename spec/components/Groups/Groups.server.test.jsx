import '@testing-library/jest-dom';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DEMO_API_KEY } from '../../../src/constants';
import CioPlp from '../../../src/components/CioPlp';
import Groups from '../../../src/components/Groups';
import mockTransformedGroups from '../../local_examples/sampleGroups.json';

const groupsProps = { groups: mockTransformedGroups };

describe('Testing Component on the server: Groups', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks(); // This will reset all mocks after each test
  });

  it('Should throw error if used outside the CioPlp', () => {
    expect(() => renderToString(<Groups {...groupsProps} />)).toThrow();
  });

  it('Should render groups based on search or browse response', async () => {
    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Groups {...groupsProps} />
      </CioPlp>,
    );

    mockTransformedGroups.forEach((group) => {
      expect(html).toContain(group.displayName);
    });
  });

  it('Should render correctly with render props', () => {
    const mockChildren = jest.fn().mockReturnValue(<div>Custom Groups</div>);

    const groupsPropsWithChildren = {
      ...groupsProps,
      children: mockChildren,
    };

    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Groups {...groupsPropsWithChildren} />
      </CioPlp>,
    );
    expect(mockChildren).toHaveBeenCalled();
    expect(html).toContain('Custom Groups');
  });
});
