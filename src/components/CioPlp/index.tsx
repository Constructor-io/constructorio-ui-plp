import React, { useMemo, useState } from 'react';
import useCioClient from '../../hooks/useCioClient';
import * as defaultGetters from '../../utils/getters';
import * as defaultFormatters from '../../utils/formatters';
import { PlpContext } from '../../hooks/useCioPlpContext';
import {
  Callbacks,
  Formatters,
  Getters,
  PlpContextType,
  ConstructorIOClient,
  PropsWithChildrenRenderProps,
} from '../../types';

interface CioPlpProps {
  apiKey: string;
  cioClient?: ConstructorIOClient;
  formatters?: Formatters;
  callbacks?: Callbacks;
  getters?: Getters;
}

// Children function (omit setters from context)
type ChildrenFunctionProps = Omit<PlpContextType, 'setters'>;

export default function CioPlp(
  props: PropsWithChildrenRenderProps<CioPlpProps, ChildrenFunctionProps>,
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
