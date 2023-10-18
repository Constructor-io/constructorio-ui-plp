import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import useCioClient from './hooks/useCioClient';
import { PlpContext } from './types';

const plpContext = createContext<PlpContext | null>(null);
plpContext.displayName = 'PlpContext';

/**
 * React Hook to access state provided by PlpContextProvider.
 * Note: Should only be used by components nested under a PlpContextProvider
 */
export function usePlpState() {
  return useContext(plpContext);
}

export function PlpContextProvider(props: PropsWithChildren<{ apiKey: string }>) {
  const { apiKey, children } = props;
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
    }),
    [cioClient, cioClientOptions],
  );

  return <plpContext.Provider value={state}>{children}</plpContext.Provider>;
}
