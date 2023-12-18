import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useMemo } from 'react';
import version from '../version';

export type CioClientConfig = { apiKey?: string };
type UseCioClient = (
  apiKey: string,
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>,
) => Nullable<ConstructorIOClient> | never;

const useCioClient: UseCioClient = (apiKey, options?) => {
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  const memoizedCioClient = useMemo(() => {
    if (apiKey && typeof window !== 'undefined') {
      return new ConstructorIOClient({
        apiKey,
        sendTrackingEvents: true,
        version: `cio-ui-plp-${version}`,
        ...options,
      });
    }

    return null;
  }, [apiKey, options]);
  return memoizedCioClient!;
};

export default useCioClient;
