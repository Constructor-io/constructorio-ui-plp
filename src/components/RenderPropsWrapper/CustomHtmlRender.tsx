import React, { useRef, isValidElement, ReactNode } from 'react';

interface CustomHtmlRenderProps<T> {
  renderHtml: (props: T) => HTMLElement | ReactNode;
  topLevelAttributes?: object;
}

export default function CustomHtmlRender<T>(props: T & CustomHtmlRenderProps<T>) {
  const { renderHtml, topLevelAttributes = {}, ...otherProps } = props;
  const ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customElement = renderHtml(otherProps as T);

  const isDomElement = customElement instanceof HTMLElement;
  const isReactNode = isValidElement(customElement);

  if (isDomElement && ref.current) {
    ref.current.innerHTML = ''; // Clear previous content
    ref.current.appendChild(customElement);
  }

  if (isReactNode) {
    return customElement;
  }

  if (isDomElement) {
    return <div {...topLevelAttributes} ref={ref} />;
  }
  return null;
}
