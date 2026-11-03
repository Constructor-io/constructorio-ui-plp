import { useMemo, useState } from 'react';
import useCioClient from './useCioClient';
import * as defaultGetters from '../utils/itemFieldGetters';
import * as defaultFormatters from '../utils/formatters';
import * as defaultUrlHelpers from '../utils/urlHelpers';
import { setUrlWithPushState } from '../utils/spaUrlHelpers';
import { shopifyDefaults } from '../utils/shopifyDefaults';
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
    enableSpaNavigation = false,
    staticRequestConfigs = {},
    renderOverrides = {},
    cioClient: customCioClient,
    cioClientOptions: customCioClientOptions = {},
    useShopifyDefaults = false,
    translations,
    componentOverrides = {},
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
      callbacks: { ...(useShopifyDefaults && shopifyDefaults.callbacks), ...callbacks },
      urlHelpers: {
        ...defaultUrlHelpers,
        ...(enableSpaNavigation && { setUrl: setUrlWithPushState }),
        ...(useShopifyDefaults && shopifyDefaults.urlHelpers),
        ...urlHelpers,
      },
      enableSpaNavigation,
      renderOverrides: { ...renderOverrides },
      translations,
      componentOverrides: { ...componentOverrides },
    }),
    [
      cioClient,
      cioClientOptions,
      itemFieldGetters,
      formatters,
      callbacks,
      urlHelpers,
      enableSpaNavigation,
      renderOverrides,
      staticRequestConfigs,
      useShopifyDefaults,
      translations,
      componentOverrides,
    ],
  );

  return contextValue;
}
