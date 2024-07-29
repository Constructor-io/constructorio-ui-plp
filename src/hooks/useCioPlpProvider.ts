import { useMemo, useState } from 'react';
import useCioClient from './useCioClient';
import * as defaultGetters from '../utils/itemFieldGetters';
import * as defaultFormatters from '../utils/formatters';
import * as defaultUrlHelpers from '../utils/urlHelpers';
import { PlpContextValue, IncludeRenderProps, CioPlpProviderProps } from '../types';

export default function useCioPlpProvider(
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
  } = props;

  const [cioClientOptions, setCioClientOptions] = useState({});
  const cioClient = useCioClient({ apiKey, cioClient: customCioClient, options: cioClientOptions });

  const contextValue = useMemo(
    (): PlpContextValue => ({
      cioClient,
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
      cioClientOptions,
      itemFieldGetters,
      formatters,
      callbacks,
      urlHelpers,
      staticRequestConfigs,
    ],
  );

  return contextValue;
}
