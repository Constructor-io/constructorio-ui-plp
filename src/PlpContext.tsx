import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import useCioClient from './hooks/useCioClient';
import * as defaultGetters from './utils/getters';
import * as defaultFormatters from './utils/formatters';
import { Callbacks, Formatters, Getters, PlpContext } from './types';

const plpContext = createContext<PlpContext | null>(null);
plpContext.displayName = 'PlpContext';

/**
 * React Hook to access state provided by PlpContextProvider.
 * Note: Should only be used by components nested under a PlpContextProvider
 */
export function usePlpContext() {
  return useContext(plpContext);
}

export function PlpContextProvider(
  props: PropsWithChildren<{
    apiKey: string;
    formatters?: Formatters;
    callbacks?: Callbacks;
    getters?: Getters;
  }>,
) {
  const { apiKey, formatters, callbacks, getters, children } = props;
  const [cioClientOptions, setCioClientOptions] = useState({});
  // More states

  const cioClient = useCioClient(apiKey);

  // To Consider: Splitting the context into separate layers
  // Global Configurations
  // Api Results
  // User activity
  const state = useMemo(
    () => ({
      cioClient,
      cioClientOptions,
      setCioClientOptions,
      getters: { ...defaultGetters, ...getters },
      formatters: { ...defaultFormatters, ...formatters },
      callbacks: { ...callbacks },
    }),
    [cioClient, cioClientOptions, getters, formatters, callbacks],
  );

  return <plpContext.Provider value={state}>{children}</plpContext.Provider>;
}
