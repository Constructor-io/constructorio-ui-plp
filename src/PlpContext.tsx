import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import useCioClient from './hooks/useCioClient';
import * as defaultGetters from './utils/getters';
import * as defaultFormatters from './utils/formatters';
import * as defaultEncoders from './utils/encoders';
import { Callbacks, Formatters, Getters, PlpContext, Encoders, RequestConfigs } from './types';

const plpContext = createContext<PlpContext | null>(null);
plpContext.displayName = 'PlpContext';

/**
 * React Hook to access state provided by CioPlpContext.
 * Note: Should only be used by components nested under a CioPlpContext
 */
export function useCioPlpContext() {
  return useContext(plpContext);
}

export function CioPlpContext(
  props: PropsWithChildren<{
    apiKey: string;
    formatters?: Partial<Formatters>;
    callbacks?: Partial<Callbacks>;
    getters?: Partial<Getters>;
    encoders?: Partial<Encoders>;
    staticRequestConfigs?: RequestConfigs;
  }>,
) {
  const {
    apiKey,
    formatters,
    callbacks,
    getters,
    encoders,
    children,
    staticRequestConfigs = {},
  } = props;
  const [cioClientOptions, setCioClientOptions] = useState({});

  const cioClient = useCioClient(apiKey);

  const state = useMemo(
    () => ({
      cioClient,
      cioClientOptions,
      setCioClientOptions,
      staticRequestConfigs,
      getters: { ...defaultGetters, ...getters },
      formatters: { ...defaultFormatters, ...formatters },
      callbacks: { ...callbacks },
      encoders: { ...defaultEncoders, ...encoders },
    }),
    [cioClient, cioClientOptions, getters, formatters, callbacks, encoders, staticRequestConfigs],
  );

  return <plpContext.Provider value={state}>{children}</plpContext.Provider>;
}
