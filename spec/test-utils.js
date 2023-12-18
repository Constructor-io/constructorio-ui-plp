/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render } from '@testing-library/react';
import ConstructorIO from '@constructor-io/constructorio-client-javascript';
import { CioPlpContext } from '../src/PlpContext';
import { DEMO_API_KEY } from '../src/constants';
import apiBrowseResponse from './local_examples/apiBrowseResponse.json';

// ConstructorIO Client Mock
class MockConstructorIO extends ConstructorIO {
  browse = {
    getBrowseResults: jest.fn().mockResolvedValue(apiBrowseResponse),
  };
  // Override other methods as needed
}

const mockConstructorIOClient = new MockConstructorIO({ apiKey: DEMO_API_KEY });

// Context Wrapper
function CioPlpContextWrapperProvider({ children }) {
  return <CioPlpContext apiKey={DEMO_API_KEY}>{children}</CioPlpContext>;
}

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: CioPlpContextWrapperProvider, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as renderWithCioPlpContext, mockConstructorIOClient };
