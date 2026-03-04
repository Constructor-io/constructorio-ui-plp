import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CioPlp from '../../../src/components/CioPlp';
import { useCioPlpContext } from '../../../src/hooks/useCioPlpContext';
import { DEMO_API_KEY } from '../../../src/constants';
import '@testing-library/jest-dom';
import { mockConstructorIOClient } from '../../test-utils';
import mockSearchResponse from '../../local_examples/apiSearchResponse.json';

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

  describe('Shopify Defaults', () => {
    it('should pass useShopifyDefaults prop through to provider', () => {
      function ContextConsumer() {
        const context = useCioPlpContext();

        // Verify Shopify callbacks and urlHelpers are set
        const hasShopifyCallbacks =
          typeof context.callbacks.onAddToCart === 'function' &&
          typeof context.callbacks.onProductCardClick === 'function';
        const hasShopifyUrlHelpers = typeof context.urlHelpers.setUrl === 'function';

        return (
          <div>{hasShopifyCallbacks && hasShopifyUrlHelpers ? 'has-shopify' : 'no-shopify'}</div>
        );
      }

      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY} useShopifyDefaults>
          <ContextConsumer />
        </CioPlp>,
      );

      expect(getByText('has-shopify')).toBeInTheDocument();
    });

    it('should not apply Shopify defaults when prop is false', () => {
      function ContextConsumer() {
        const context = useCioPlpContext();
        const hasCallbacks = Object.keys(context.callbacks).length > 0;

        return <div>{hasCallbacks ? 'has-callbacks' : 'no-callbacks'}</div>;
      }

      const { getByText } = render(
        <CioPlp apiKey={DEMO_API_KEY} useShopifyDefaults={false}>
          <ContextConsumer />
        </CioPlp>,
      );

      expect(getByText('no-callbacks')).toBeInTheDocument();
    });

    it('should allow custom callbacks to override Shopify defaults', () => {
      const customCallback = jest.fn();

      function ContextConsumer() {
        const context = useCioPlpContext();

        // Verify the custom callback is set (not the Shopify default)
        return (
          <div>
            {context.callbacks.onAddToCart === customCallback
              ? 'custom-callback'
              : 'default-callback'}
          </div>
        );
      }

      const { getByText } = render(
        <CioPlp
          apiKey={DEMO_API_KEY}
          useShopifyDefaults
          callbacks={{ onAddToCart: customCallback }}>
          <ContextConsumer />
        </CioPlp>,
      );

      expect(getByText('custom-callback')).toBeInTheDocument();
    });
  });

  it('renders CioPlp with hideGroups set to true on the client', async () => {
    const { container } = render(
      <CioPlp
        apiKey={DEMO_API_KEY}
        groupsConfigs={{ hideGroups: true }}
        initialSearchResponse={mockSearchResponse}
      />,
    );
    // Groups container should not be present when hideGroups is true
    await waitFor(() => {
      expect(container.querySelector('.cio-groups-container')).not.toBeInTheDocument();
      expect(container.querySelector('.cio-groups-breadcrumbs')).not.toBeInTheDocument();
    });
  });

  it('renders CioPlp with hideGroups set to false on the client', async () => {
    const { container } = render(
      <CioPlp
        apiKey={DEMO_API_KEY}
        groupsConfigs={{ hideGroups: false }}
        initialSearchResponse={mockSearchResponse}
      />,
    );
    // Groups container should be present when hideGroups is false
    await waitFor(() => {
      expect(container.querySelector('.cio-groups-container')).toBeInTheDocument();
      expect(container.querySelector('.cio-groups-breadcrumbs')).toBeInTheDocument();
    });
  });

  it('renders CioPlp with filterConfigs renderCollapsed set to true on the client', async () => {
    const { container } = render(
      <CioPlp
        apiKey={DEMO_API_KEY}
        filterConfigs={{ renderCollapsed: true }}
        initialSearchResponse={mockSearchResponse}
      />,
    );

    await waitFor(() => {
      // All filter group arrows should indicate collapsed state (cio-arrow-up)
      const arrows = container.querySelectorAll('.cio-filter-group .cio-arrow');
      expect(arrows.length).toBeGreaterThan(0);
      arrows.forEach((arrow) => {
        expect(arrow).toHaveClass('cio-arrow-up');
      });
    });
  });

  it('renders CioPlp with filterConfigs renderCollapsed set to false on the client', async () => {
    const { container } = render(
      <CioPlp
        apiKey={DEMO_API_KEY}
        filterConfigs={{ renderCollapsed: false }}
        initialSearchResponse={mockSearchResponse}
      />,
    );

    await waitFor(() => {
      // All filter group arrows should indicate expanded state (cio-arrow-down)
      const arrows = container.querySelectorAll('.cio-filter-group .cio-arrow');
      expect(arrows.length).toBeGreaterThan(0);
      arrows.forEach((arrow) => {
        expect(arrow).toHaveClass('cio-arrow-down');
      });
    });
  });

  it('renders CioPlp with filterConfigs renderCollapsed=true also collapsing the Groups filter', async () => {
    const { container } = render(
      <CioPlp
        apiKey={DEMO_API_KEY}
        filterConfigs={{ renderCollapsed: true }}
        initialSearchResponse={mockSearchResponse}
      />,
    );

    await waitFor(() => {
      // Groups filter renders on search pages via initialSearchResponse
      const groupsArrow = container.querySelector('.cio-groups-container .cio-arrow');
      expect(groupsArrow).toBeInTheDocument();
      expect(groupsArrow).toHaveClass('cio-arrow-up');
    });
  });

  it('renders CioPlp with groupsConfigs.isCollapsed overriding filterConfigs.renderCollapsed for Groups', async () => {
    const { container } = render(
      <CioPlp
        apiKey={DEMO_API_KEY}
        filterConfigs={{ renderCollapsed: true }}
        groupsConfigs={{ isCollapsed: false }}
        initialSearchResponse={mockSearchResponse}
      />,
    );

    await waitFor(() => {
      // Groups filter should be expanded (groupsConfigs.isCollapsed=false overrides filterConfigs.renderCollapsed=true)
      const groupsArrow = container.querySelector('.cio-groups-container .cio-arrow');
      expect(groupsArrow).toBeInTheDocument();
      expect(groupsArrow).toHaveClass('cio-arrow-down');

      // Facet filter groups should still be collapsed
      const filterArrows = container.querySelectorAll('.cio-filter-group .cio-arrow');
      expect(filterArrows.length).toBeGreaterThan(0);
      filterArrows.forEach((arrow) => {
        expect(arrow).toHaveClass('cio-arrow-up');
      });
    });
  });
});
