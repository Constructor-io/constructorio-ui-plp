import React, { useMemo, useState, createContext, useContext } from 'react';
import useCioClient from './hooks/useCioClient';
import * as defaultGetters from './utils/getters';
import * as defaultFormatters from './utils/formatters';
import {
  Callbacks,
  Formatters,
  Getters,
  PlpContextType,
  ConstructorIOClient,
  IncludeRenderProps,
  Nullable,
} from './types';

export const PlpContext = createContext<PlpContextType | null>(null);
PlpContext.displayName = 'PlpContext';

/**
 * React Hook to access state provided by CioPlpContext.
 * Note: Should only be used by components nested under a CioPlpContext
 */
export function useCioPlpContext() {
  return useContext(PlpContext as React.Context<PlpContextType>);
}

export interface CioPlpContextProps {
  apiKey: string;
  cioClient?: Nullable<ConstructorIOClient>;
  formatters?: Formatters;
  callbacks?: Callbacks;
  getters?: Getters;
}

// Children function (omit setters from context)
type ChildrenFunctionProps = Omit<PlpContextType, 'setters'>;

// Todo: Rename to CioPlp/CioPlpProvider
export function CioPlpContext(
  props: IncludeRenderProps<CioPlpContextProps, ChildrenFunctionProps>,
) {
  const { apiKey, formatters, callbacks, getters, cioClient: customCioClient, children } = props;
  const [cioClientOptions, setCioClientOptions] = useState({});

  const cioClient = useCioClient(apiKey);

  const contextValue = useMemo(
    (): PlpContextType => ({
      cioClient: customCioClient || cioClient,
      cioClientOptions,
      setCioClientOptions,
      getters: { ...defaultGetters, ...getters },
      formatters: { ...defaultFormatters, ...formatters },
      callbacks: { ...callbacks },
    }),
    [cioClient, customCioClient, cioClientOptions, getters, formatters, callbacks],
  );

  return (
    <PlpContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </PlpContext.Provider>
  );
}
