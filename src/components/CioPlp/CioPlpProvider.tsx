import React, { useMemo, useState } from 'react';
import useCioClient from '../../hooks/useCioClient';
import * as defaultGetters from '../../utils/itemFieldGetters';
import * as defaultFormatters from '../../utils/formatters';
import * as defaultUrlHelpers from '../../utils/urlHelpers';
import { PlpContextValue, IncludeRenderProps, CioPlpProviderProps } from '../../types';
import { PlpContext } from '../../hooks/useCioPlpContext';

export default function CioPlpProvider(
  props: IncludeRenderProps<CioPlpProviderProps, PlpContextValue>,
) {
  const {
    apiKey,
    formatters,
    callbacks,
    itemFieldGetters,
    urlHelpers,
    staticRequestConfigs = {},
    cioClient: customCioClient,
    children,
  } = props;
  const [cioClientOptions, setCioClientOptions] = useState({});

  const cioClient = useCioClient(apiKey);

  const contextValue = useMemo(
    (): PlpContextValue => ({
      cioClient: customCioClient || cioClient,
      cioClientOptions,
      setCioClientOptions,
      staticRequestConfigs,
      itemFieldGetters: { ...defaultGetters, ...itemFieldGetters },
      formatters: { ...defaultFormatters, ...formatters },
      callbacks: { ...callbacks },
      urlHelpers: { ...defaultUrlHelpers, ...urlHelpers },
    }),
    [
      cioClient,
      customCioClient,
      cioClientOptions,
      itemFieldGetters,
      formatters,
      callbacks,
      urlHelpers,
      staticRequestConfigs,
    ],
  );

  return (
    <PlpContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </PlpContext.Provider>
  );
}
