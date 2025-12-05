import { useMemo, useState } from 'react';
import useCioClient from './useCioClient';
import * as defaultGetters from '../utils/itemFieldGetters';
import * as defaultFormatters from '../utils/formatters';
import * as defaultUrlHelpers from '../utils/urlHelpers';
import { getShopifyDefaults } from '../utils/shopifyDefaults';
import { PlpContextValue, IncludeRenderProps, CioPlpProviderProps } from '../types';

const EMPTY_SHOPIFY_DEFAULTS = { callbacks: {}, urlHelpers: {} };

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
    useShopifyDefaults = false,
  } = props;

  const [cioClientOptions, setCioClientOptions] = useState(customCioClientOptions);
  const cioClient = useCioClient({ apiKey, cioClient: customCioClient, options: cioClientOptions });

  const shopifyDefaults = useMemo(
    () => (useShopifyDefaults ? getShopifyDefaults() : EMPTY_SHOPIFY_DEFAULTS),
    [useShopifyDefaults],
  );

  const contextValue = useMemo(
    (): PlpContextValue => ({
      cioClient,
      cioClientOptions,
      setCioClientOptions,
      staticRequestConfigs,
      itemFieldGetters: { ...defaultGetters, ...itemFieldGetters },
      formatters: { ...defaultFormatters, ...formatters },
      callbacks: { ...shopifyDefaults.callbacks, ...callbacks },
      urlHelpers: { ...defaultUrlHelpers, ...shopifyDefaults.urlHelpers, ...urlHelpers },
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
      shopifyDefaults,
    ],
  );

  return contextValue;
}
