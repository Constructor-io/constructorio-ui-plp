/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CioPlpContext, useCioPlpContext } from '../src/PlpContext';
import { DEMO_API_KEY } from '../src/constants';

describe('CioPlpContext React Server-Side Rendering', () => {
  it("throws an error if apiKey isn't provided", () => {
    expect(() => {
      ReactDOMServer.renderToString(<CioPlpContext />);
    }).toThrow();
  });

  it('renders CioPlpContext without children on the server without error', () => {
    // Render the component to a string
    const html = ReactDOMServer.renderToString(<CioPlpContext apiKey={DEMO_API_KEY} />);

    expect(html).toContain('');
  });

  it('renders CioPlpContext with children correctly on the server', () => {
    // Render the component to a string
    const html = ReactDOMServer.renderToString(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <div>Test</div>
      </CioPlpContext>,
    );
    expect(html).toContain('<div>Test</div>');
  });

  it('renders CioPlpContext with children that has access to Context value on the server', () => {
    function ContextConsumer() {
      const context = useCioPlpContext(CioPlpContext);

      return <div>{JSON.stringify(context)}</div>;
    }

    // Render the component to a string
    const html = ReactDOMServer.renderToString(
      <CioPlpContext apiKey={DEMO_API_KEY}>
        <ContextConsumer />
      </CioPlpContext>,
    );
    expect(html).toContain(
      '<div>{&quot;cioClient&quot;:null,&quot;cioClientOptions&quot;:{},&quot;getters&quot;:{},&quot;formatters&quot;:{},&quot;callbacks&quot;:{}}</div>',
    );
  });
});
