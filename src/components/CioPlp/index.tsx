import React, { useMemo, useState } from 'react';
import useCioClient from '../../hooks/useCioClient';
import * as defaultGetters from '../../utils/getters';
import * as defaultFormatters from '../../utils/formatters';
import {
  Callbacks,
  Formatters,
  Getters,
  PlpContextValue,
  ConstructorIOClient,
  IncludeRenderProps,
  Nullable,
} from '../../types';
import { PlpContext } from '../../hooks/useCioPlpContext';

export interface CioPlpProviderProps {
  apiKey: string;
  cioClient?: Nullable<ConstructorIOClient>;
  formatters?: Formatters;
  callbacks?: Callbacks;
  getters?: Getters;
}

// Children function props
type ChildrenFunctionProps = PlpContextValue;

export function CioPlpProvider(
  props: IncludeRenderProps<CioPlpProviderProps, ChildrenFunctionProps>,
) {
  const { apiKey, formatters, callbacks, getters, cioClient: customCioClient, children } = props;
  const [cioClientOptions, setCioClientOptions] = useState({});

  const cioClient = useCioClient(apiKey);

  const contextValue = useMemo(
    (): PlpContextValue => ({
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
