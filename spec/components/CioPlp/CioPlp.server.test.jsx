import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CioPlp from '../../../src/components/CioPlp';
import { useCioPlpContext } from '../../../src/hooks/useCioPlpContext';
import { DEMO_API_KEY } from '../../../src/constants';

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

  it('renders CioPlp provider without children on the server without error, if client is provided', () => {
    // Render the component to a string
    const html = ReactDOMServer.renderToString(<CioPlp cioClient={{}} />);

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
      '<div class=\"cio-plp\"><div>{&quot;cioClient&quot;:null,&quot;cioClientOptions&quot;:{},&quot;staticRequestConfigs&quot;:{},&quot;customConfigs&quot;:{},&quot;itemFieldGetters&quot;:{},&quot;formatters&quot;:{},&quot;callbacks&quot;:{},&quot;urlHelpers&quot;:{&quot;defaultQueryStringMap&quot;:{&quot;query&quot;:&quot;q&quot;,&quot;page&quot;:&quot;page&quot;,&quot;offset&quot;:&quot;offset&quot;,&quot;resultsPerPage&quot;:&quot;numResults&quot;,&quot;filters&quot;:&quot;filters&quot;,&quot;sortBy&quot;:&quot;sortBy&quot;,&quot;sortOrder&quot;:&quot;sortOrder&quot;,&quot;section&quot;:&quot;section&quot;}}}</div></div>',
    );
  });
});
