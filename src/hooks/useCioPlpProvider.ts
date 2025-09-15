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
    renderOverrides = {},
    cioClient: customCioClient,
    cioClientOptions: customCioClientOptions = {},
  } = props;

  const [cioClientOptions, setCioClientOptions] = useState(customCioClientOptions);
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
      renderOverrides: { ...renderOverrides },
    }),
    [
      cioClient,
      cioClientOptions,
      itemFieldGetters,
      formatters,
      callbacks,
      urlHelpers,
      renderOverrides,
      staticRequestConfigs,
    ],
  );

  return contextValue;
}
