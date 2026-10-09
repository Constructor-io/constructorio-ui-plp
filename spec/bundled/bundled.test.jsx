import { act, waitFor } from '@testing-library/react';
import mockSearchResponse from '../local_examples/apiSearchResponse.json';
import CioPlp from '../../src/bundled';
import useCioClient from '../../src/hooks/useCioClient';
import version from '../../src/version';

// Mock useCioClient to capture the options passed to it
jest.mock('../../src/hooks/useCioClient');

describe('Bundled CioPlp', () => {
  let container;
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a container element
    container = document.createElement('div');
    container.id = 'cio-plp-container';
    document.body.appendChild(container);

    // Setup mock client
    mockClient = {
      search: { getSearchResults: jest.fn().mockResolvedValue({ response: { results: [] } }) },
      browse: { getBrowseResults: jest.fn().mockResolvedValue({ response: { results: [] } }) },
      tracker: { trackSearchResultsLoaded: jest.fn() },
      options: {},
    };
    useCioClient.mockReturnValue(mockClient);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
  });

  it('should pass bundled c-param in cioClientOptions to useCioClient', async () => {
    await act(async () => {
      CioPlp({
        selector: '#cio-plp-container',
        apiKey: 'test-key',
      });
    });

    expect(useCioClient).toHaveBeenCalled();
    const callArgs = useCioClient.mock.calls[0][0];
    expect(callArgs.options.version).toBe(`cio-ui-plp-bundled-${version}`);
  });

  it('should preserve user cioClientOptions while setting bundled version', async () => {
    const userOptions = {
      sessionId: 123,
      clientId: 'user-client',
      segments: ['premium', 'returning'],
      serviceUrl: 'https://custom.cnstrc.com',
    };

    await act(async () => {
      CioPlp({
        selector: '#cio-plp-container',
        apiKey: 'test-key',
        cioClientOptions: userOptions,
      });
    });

    expect(useCioClient).toHaveBeenCalled();
    const callArgs = useCioClient.mock.calls[0][0];

    // User options should be preserved
    expect(callArgs.options.sessionId).toBe(123);
    expect(callArgs.options.clientId).toBe('user-client');
    expect(callArgs.options.segments).toEqual(['premium', 'returning']);
    expect(callArgs.options.serviceUrl).toBe('https://custom.cnstrc.com');

    // Bundled version should be set
    expect(callArgs.options.version).toBe(`cio-ui-plp-bundled-${version}`);
  });

  it('should override user-provided version with bundled version', async () => {
    await act(async () => {
      CioPlp({
        selector: '#cio-plp-container',
        apiKey: 'test-key',
        cioClientOptions: {
          version: 'user-custom-version',
          sessionId: 456,
        },
      });
    });

    expect(useCioClient).toHaveBeenCalled();
    const callArgs = useCioClient.mock.calls[0][0];

    // Bundled version should override user version
    expect(callArgs.options.version).toBe(`cio-ui-plp-bundled-${version}`);
    // Other user options should still be preserved
    expect(callArgs.options.sessionId).toBe(456);
  });

  it('should log error when container element is not found', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    CioPlp({
      selector: '#non-existent-container',
      apiKey: 'test-key',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'CioPlp: There were no elements found for the provided selector',
    );
    expect(useCioClient).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  describe('accessibility', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
      window.location = 'https://example.com/search?q=shoes';
      mockClient.search.getSearchResults.mockResolvedValue(mockSearchResponse);
    });

    afterEach(() => {
      window.location = originalWindowLocation;
    });

    it('should render the results live region and announce results with translations', async () => {
      await act(async () => {
        CioPlp({
          selector: '#cio-plp-container',
          apiKey: 'test-key',
          translations: { '{count} results found': '{count} products found' },
        });
      });

      const region = container.querySelector('[role="status"][aria-live="polite"]');
      expect(region).not.toBeNull();

      await waitFor(() =>
        expect(region.textContent).toBe(
          `${mockSearchResponse.response.total_num_results} products found`,
        ),
      );
    });

    it('should render an accessible sort control', async () => {
      await act(async () => {
        CioPlp({ selector: '#cio-plp-container', apiKey: 'test-key' });
      });

      await waitFor(() => expect(container.querySelector('.cio-plp-sort')).not.toBeNull());

      const trigger = container.querySelector('.cio-plp-sort button.collapsible');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      trigger
        .getAttribute('aria-controls')
        .split(' ')
        .forEach((id) => {
          expect(document.getElementById(id)).not.toBeNull();
        });
      expect(
        container.querySelectorAll(`#${trigger.getAttribute('aria-controls')} input[type="radio"]`)
          .length,
      ).toBe(mockSearchResponse.response.sort_options.length);
    });
  });
});
