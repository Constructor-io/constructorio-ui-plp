import React, { useMemo, useState } from 'react';
import useCioClient from '../../hooks/useCioClient';
import * as defaultGetters from '../../utils/getters';
import * as defaultFormatters from '../../utils/formatters';
import * as defaultEncoders from '../../utils/encoders';
import { PlpContextValue, IncludeRenderProps, CioPlpProviderProps } from '../../types';
import { PlpContext } from '../../hooks/useCioPlpContext';

export default function CioPlpProvider(
  props: IncludeRenderProps<CioPlpProviderProps, PlpContextValue>,
) {
  const {
    apiKey,
    formatters,
    callbacks,
    getters,
    encoders,
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
      getters: { ...defaultGetters, ...getters },
      formatters: { ...defaultFormatters, ...formatters },
      callbacks: { ...callbacks },
      encoders: { ...defaultEncoders, ...encoders },
    }),
    [
      cioClient,
      customCioClient,
      cioClientOptions,
      getters,
      formatters,
      callbacks,
      encoders,
      staticRequestConfigs,
    ],
  );

  return (
    <PlpContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </PlpContext.Provider>
  );
}
