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
  cioClient?: Nullable<ConstructorIOClient> | undefined;
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents' | 'version'>;
}

type UseCioClient = (props: UseCioClientProps) => Nullable<ConstructorIOClient> | never;

const useCioClient: UseCioClient = (props) => {
  if (!props) {
    throw new Error('Api Key or cioClient required');
  }

  const { apiKey, cioClient, options } = props;

  if (!apiKey && !cioClient) {
    throw new Error('Api Key or cioClient required');
  }

  const memoizedCioClient = useMemo(() => {
    if (cioClient && typeof window !== 'undefined') return cioClient;

    if (apiKey && typeof window !== 'undefined') {
      return new ConstructorIOClient({
        apiKey,
        sendTrackingEvents: true,
        version: `cio-ui-plp-${version}`,
        ...options,
      });
    }

    return null;
  }, [apiKey, options, cioClient]);
  return memoizedCioClient;
};

export default useCioClient;
