import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  ConstructorClientOptions,
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useMemo } from 'react';
import version from '../version';

export type CioClientConfig = { apiKey?: string };

export interface UseCioClientProps {
  apiKey?: string;
  cioJsClient?: Nullable<ConstructorIOClient> | undefined;
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
}

type UseCioClient = (props: UseCioClientProps) => Nullable<ConstructorIOClient> | never;

const useCioClient: UseCioClient = (props) => {
  if (!props) {
    throw new Error('Either apiKey or cioJsClient is required');
  }

  const { apiKey, cioJsClient, options } = props;

  if (!apiKey && !cioJsClient) {
    throw new Error('Either apiKey or cioJsClient is required');
  }

  const memoizedCioClient = useMemo(() => {
    if (cioJsClient && typeof window !== 'undefined') return cioJsClient;

    if (apiKey && typeof window !== 'undefined') {
      return new ConstructorIOClient({
        apiKey,
        sendTrackingEvents: true,
        version: `cio-ui-plp-${version}`,
        ...options,
      });
    }

    return null;
  }, [apiKey, options, cioJsClient]);
  return memoizedCioClient;
};

export default useCioClient;
