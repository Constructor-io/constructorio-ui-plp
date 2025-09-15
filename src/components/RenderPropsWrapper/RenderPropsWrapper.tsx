/* eslint-disable no-nested-ternary */
import React, { ReactNode } from 'react';
import { RenderPropsChildren } from '../../types';
import CustomHtmlRender from './CustomHtmlRender';

export interface ReactPropsWrapperProps<T> {
  /**
   * The props to be passed to the render props function provided
   */
  props: T;
  /**
   * The default implementation to be nested within the wrapper
   */
  children: ReactNode;
  /**
   * One of Function<T> | JSX. Overrides default implementation
   */
  override?: RenderPropsChildren<T>;
  /**
   * One of Function<T> | JSX. Overrides default implementation
   */
  htmlOverride?: (props: T) => HTMLElement | ReactNode;
  /**
   * Object containing the attributes to be spread on the top-level div. To be used with `htmlOverride`
   */
  topLevelAttributes?: object;
}

export default function RenderPropsWrapper<T>({
  props,
  children,
  override,
  htmlOverride,
  topLevelAttributes,
}: ReactPropsWrapperProps<T>) {
  const isRenderProps = typeof override === 'function';
  const isJSX = typeof override === 'object';
  const isHtmlOverride = typeof htmlOverride === 'function';

  return (
    <>
      {isRenderProps ? (
        override(props)
      ) : isJSX ? (
        override
      ) : isHtmlOverride ? (
        <CustomHtmlRender
          {...props}
          renderHtml={htmlOverride}
          topLevelAttributes={topLevelAttributes}
        />
      ) : (
        // Default implementation
        children
      )}
    </>
  );
}
