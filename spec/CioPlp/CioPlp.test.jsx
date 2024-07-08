import React from 'react';
import { render } from '@testing-library/react';
import CioPlp from '../../src/components/CioPlp';
import { useCioPlpContext } from '../../src/hooks/useCioPlpContext';
import { DEMO_API_KEY } from '../../src/constants';
import '@testing-library/jest-dom';
import { mockConstructorIOClient } from '../test-utils';

describe('CioPlp React Client-Side Rendering', () => {
  beforeEach(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("throws an error if apiKey isn't provided", () => {
    expect(() => {
      render(<CioPlp />);
    }).toThrow();
  });

  // TODO: remove query
  it('renders CioPlp provider without children on the client without error', () => {
    expect(() =>
      render(<CioPlp apiKey={DEMO_API_KEY} staticRequestConfigs={{ query: 'red' }} />),
    ).not.toThrow();
  });

  // TODO: remove query
  it('renders CioPlp provider without children on the client without error, if client is provided', () => {
    expect(() =>
      render(
        <CioPlp cioClient={mockConstructorIOClient} staticRequestConfigs={{ query: 'red' }} />,
      ),
    ).not.toThrow();
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
