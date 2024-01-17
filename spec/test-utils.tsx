import React from 'react';
import { render, renderHook } from '@testing-library/react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { DEMO_API_KEY } from '../src/constants';
import apiBrowseResponse from './local_examples/apiBrowseResponse.json';
import apiSearchResponse from './local_examples/apiSearchResponse.json';

import CioPlp from '../src/components/CioPlp';

// ConstructorIO Client Mock
class MockConstructorIO extends ConstructorIO {
  browse = {
    getBrowseResults: jest.fn().mockResolvedValue(apiBrowseResponse),
  } as any;

  search = {
    getSearchResults: jest.fn().mockResolvedValue(apiSearchResponse),
  } as any;

  // Override other methods as needed
}

const mockConstructorIOClient =
  typeof window !== 'undefined' ? new MockConstructorIO({ apiKey: DEMO_API_KEY }) : null;

// Context Wrapper
function CioPlpWrapperApiKey({ children }: { children: any }) {
  return <CioPlp apiKey={DEMO_API_KEY}>{children}</CioPlp>;
}

function CioPlpWrapperCioClient({ children }: { children: any }) {
  return <CioPlp cioClient={mockConstructorIOClient}>{children}</CioPlp>;
}

const customRender = (ui, options) => render(ui, { wrapper: CioPlpWrapperApiKey, ...options });

const customRenderHookWithApiKey: typeof renderHook = (callback, options) =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <CioPlp apiKey={DEMO_API_KEY} {...options?.initialProps}>
        {children}
      </CioPlp>
    ),
  });

const customRenderHookWithCioClient: typeof renderHook = (callback, options) =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <CioPlp cioClient={mockConstructorIOClient} {...options?.initialProps}>
        {children}
      </CioPlp>
    ),
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export {
  customRender as renderWithCioPlp,
  customRenderHookWithApiKey as renderHookWithCioPlpApiKey,
  customRenderHookWithCioClient as renderHookWithCioPlpCioClient,
  mockConstructorIOClient,
  CioPlpWrapperApiKey,
  CioPlpWrapperCioClient,
};
