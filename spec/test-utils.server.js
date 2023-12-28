/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import ReactDOMServer from 'react-dom/server';
import React from 'react';

export function RenderHookServerSideWrapper({
  renderCallback,
  renderCallbackProps,
  onRenderHookValue,
}) {
  const hookValue = renderCallback(renderCallbackProps.initialProps);
  // expose the hook value to the test by testing what is passed to onRenderHookValue
  onRenderHookValue(hookValue);
  return null;
}

export function renderHookServerSide(
  renderCallback,
  renderCallbackProps,
  onRenderHookValue = jest.fn(),
) {
  return {
    html: ReactDOMServer.renderToString(
      <RenderHookServerSideWrapper
        renderCallback={renderCallback}
        renderCallbackProps={renderCallbackProps}
        onRenderHookValue={onRenderHookValue}
      />,
    ),
    onRenderHookValue,
  };
}
