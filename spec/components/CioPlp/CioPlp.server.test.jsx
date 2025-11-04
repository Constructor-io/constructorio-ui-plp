import React from 'react';
import ReactDOMServer from 'react-dom/server';
import CioPlp from '../../../src/components/CioPlp';
import { useCioPlpContext } from '../../../src/hooks/useCioPlpContext';
import { DEMO_API_KEY } from '../../../src/constants';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';

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
      '<div class="cio-plp"><div>{&quot;cioClient&quot;:null,&quot;cioClientOptions&quot;:{},&quot;staticRequestConfigs&quot;:{},&quot;itemFieldGetters&quot;:{},&quot;formatters&quot;:{},&quot;callbacks&quot;:{},&quot;urlHelpers&quot;:{&quot;defaultQueryStringMap&quot;:{&quot;query&quot;:&quot;q&quot;,&quot;page&quot;:&quot;page&quot;,&quot;offset&quot;:&quot;offset&quot;,&quot;resultsPerPage&quot;:&quot;numResults&quot;,&quot;filters&quot;:&quot;filters&quot;,&quot;sortBy&quot;:&quot;sortBy&quot;,&quot;sortOrder&quot;:&quot;sortOrder&quot;,&quot;section&quot;:&quot;section&quot;}},&quot;renderOverrides&quot;:{}}</div></div>',
    );
  });

  it('renders CioPlp with hideGroups set to true on the server', () => {
    // Render the component with hideGroups config and initial data containing groups
    const html = ReactDOMServer.renderToString(
      <CioPlp
        apiKey={DEMO_API_KEY}
        groupsConfigs={{ hideGroups: true }}
        initialSearchResponse={mockSearchResponse}
      />,
    );
    // Groups container should not be present when hideGroups is true
    expect(html).not.toContain('cio-groups-container');
    expect(html).not.toContain('cio-groups-breadcrumbs');
  });

  it('renders CioPlp with hideGroups set to false on the server', () => {
    // Render the component with hideGroups config and initial data containing groups
    const html = ReactDOMServer.renderToString(
      <CioPlp
        apiKey={DEMO_API_KEY}
        groupsConfigs={{ hideGroups: false }}
        initialSearchResponse={mockSearchResponse}
      />,
    );
    // Groups container should be present when hideGroups is false
    expect(html).toContain('cio-groups-container');
    expect(html).toContain('cio-groups-breadcrumbs');
  });
});
