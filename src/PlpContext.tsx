import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import useCioClient from './hooks/useCioClient';
import { PlpContext } from './types';

const plpContext = createContext<PlpContext | null>(null);

/**
 * React Hook to access state provided by PlpContextProvider.
 * Note: Should only be used by components nested under a PlpContextProvider
 */
export function usePlpState() {
  return useContext(plpContext);
}

// const defaultState = {};

// function stateReducer(state, action) {
//   const { payload } = action;
//   return {};
// }

export function PlpContextProvider(props: PropsWithChildren<{ apiKey: string }>) {
  const { apiKey, children } = props;
  const [cioClientOptions, setCioClientOptions] = useState({});
  // More states

  // const [states, dispatch] = useReducer(stateReducer, {});
  const cioClient = useCioClient(apiKey);

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
