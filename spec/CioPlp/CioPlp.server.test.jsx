import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CioPlp from '../../src/components/CioPlp';
import { useCioPlpContext } from '../../src/hooks/useCioPlpContext';
import { DEMO_API_KEY } from '../../src/constants';

describe('CioPlp React Server-Side Rendering', () => {
  it("throws an error if apiKey isn't provided", () => {
    expect(() => {
      ReactDOMServer.renderToString(<CioPlp />);
    }).toThrow();
  });

  it('renders CioPlp provider without children on the server without error', () => {
    // Render the component to a string
    const html = ReactDOMServer.renderToString(<CioPlp apiKey={DEMO_API_KEY} />);

    expect(html).toContain('');
  });

  it('renders CioPlp provider with children correctly on the server', () => {
    // Render the component to a string
    const html = ReactDOMServer.renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <div>Test</div>
      </CioPlp>,
    );
    expect(html).toContain('<div>Test</div>');
  });

  it('renders CioPlp provider with render props on the server', () => {
    // Render the component to a string
    const html = ReactDOMServer.renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>{() => <div>Test</div>}</CioPlp>,
    );
    expect(html).toContain('<div>Test</div>');
  });

  it('renders CioPlp provider with children that has access to Context value on the server', () => {
    function ContextConsumer() {
      const context = useCioPlpContext();

      return <div>{JSON.stringify(context)}</div>;
    }

    // Render the component to a string
    const html = ReactDOMServer.renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <ContextConsumer />
      </CioPlp>,
    );
    expect(html).toContain(
      '<div>{&quot;cioClient&quot;:null,&quot;cioClientOptions&quot;:{},&quot;getters&quot;:{},&quot;formatters&quot;:{},&quot;callbacks&quot;:{}}</div>',
    );
  });
});
