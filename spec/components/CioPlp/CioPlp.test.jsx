import React from 'react';
import { render } from '@testing-library/react';
import CioPlp from '../../../src/components/CioPlp';
import { useCioPlpContext } from '../../../src/hooks/useCioPlpContext';
import { DEMO_API_KEY } from '../../../src/constants';
import '@testing-library/jest-dom';
import { mockConstructorIOClient } from '../../test-utils';

const originalWindowLocation = window.location;

describe('CioPlp React Client-Side Rendering', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com?q=red'),
    });

    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });

    jest.resetAllMocks();
  });

  it("throws an error if apiKey isn't provided", () => {
    expect(() => {
      render(<CioPlp />);
    }).toThrow();
  });

  it('renders CioPlp provider without children on the client without error', () => {
    expect(() => render(<CioPlp apiKey={DEMO_API_KEY} />)).not.toThrow();
  });

  it('renders CioPlp provider without children on the client without error, if client is provided', () => {
    expect(() => render(<CioPlp cioClient={mockConstructorIOClient} />)).not.toThrow();
  });

  it('renders CioPlp provider with children correctly on the client', () => {
    // Render the component to a string
    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <div>Test</div>
      </CioPlp>,
    );
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('renders CioPlp provider with render props on the client', () => {
    const { getByText } = render(<CioPlp apiKey={DEMO_API_KEY}>{() => <div>Test</div>}</CioPlp>);

    expect(getByText('Test')).toBeInTheDocument();
  });

  it('renders CioPlp provider with children that has access to Context value on the client', () => {
    function ContextConsumer() {
      const context = useCioPlpContext();

      return <div className='context-consumer'>{context.cioClient.options.serviceUrl}</div>;
    }

    // Render the component to a string
    const { getByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ContextConsumer />
      </CioPlp>,
    );
    expect(getByText('https://ac.cnstrc.com')).toBeInTheDocument();
  });
});
