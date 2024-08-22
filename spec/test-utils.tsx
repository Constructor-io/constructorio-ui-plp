import React from 'react';
import { render, renderHook } from '@testing-library/react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { DEMO_API_KEY } from '../src/constants';
import apiBrowseResponse from './local_examples/apiBrowseResponse.json';
import apiSearchResponse from './local_examples/apiSearchResponse.json';
import CioPlp, { CioPlpProvider } from '../src/components/CioPlp';

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

jest.mock('../src/hooks/useCioClient', () => ({
  __esModule: true,
  default: () => (() => mockConstructorIOClient)(),
}));

// Context Wrapper
function CioPlpWrapper({ children }: { children: any }) {
  return <CioPlp apiKey={DEMO_API_KEY}>{children}</CioPlp>;
}

const customRender = (ui, options) => render(ui, { wrapper: CioPlpWrapper, ...options });

const customRenderHook: typeof renderHook = (callback, options) =>
  renderHook(callback, {
    wrapper: ({ children }) => (
      <CioPlpProvider apiKey={DEMO_API_KEY} {...options?.initialProps}>
        {children}
      </CioPlpProvider>
    ),
  });

const delay = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

export {
  customRender as renderWithCioPlp,
  customRenderHook as renderHookWithCioPlp,
  mockConstructorIOClient,
  CioPlpWrapper,
  delay,
};
