import ReactDOMServer from 'react-dom/server';
import React from 'react';
import CioPlp from '../src/components/CioPlp';

export function RenderHookServerSideWrapper({
  renderCallback,
  renderCallbackProps = {},
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
    result: onRenderHookValue.mock.calls[0][0],
  };
}

export function renderHookServerSideWithCioPlp(
  renderCallback,
  cioPlpProps,
  renderCallbackProps,
  onRenderHookValue = jest.fn(),
) {
  return {
    html: ReactDOMServer.renderToString(
      <CioPlp {...cioPlpProps}>
        <RenderHookServerSideWrapper
          renderCallback={renderCallback}
          renderCallbackProps={renderCallbackProps}
          onRenderHookValue={onRenderHookValue}
        />
        ,
      </CioPlp>,
    ),
    onRenderHookValue,
    result: onRenderHookValue.mock.calls[0][0],
  };
}
