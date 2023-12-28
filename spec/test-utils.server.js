import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CioPlpContext } from '../src/PlpContext';
import { DEMO_API_KEY } from '../src/constants';

function CioPlpContextWrapperProvider({ children }) {
  return <CioPlpContext apiKey={DEMO_API_KEY}>{children}</CioPlpContext>;
}

const customRenderToString = (ui) =>
  ReactDOMServer.renderToString(<CioPlpContextWrapperProvider>{ui}</CioPlpContextWrapperProvider>);

// eslint-disable-next-line import/prefer-default-export
export { customRenderToString as renderToStringWithCioPlpContext };
