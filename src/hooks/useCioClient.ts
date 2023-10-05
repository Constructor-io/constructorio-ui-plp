import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useMemo } from 'react';
import packageJSON from '../../package.json';

export type CioClientConfig = { apiKey?: string };
type UseCioClient = (
  apiKey: string,
  options?: Omit<ConstructorClientOptions, 'apiKey' | 'sendTrackingEvents'>,
) => ConstructorIOClient | never;

const useCioClient: UseCioClient = (apiKey, options?) => {
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  const memoizedCioClient = useMemo(
    () =>
      new ConstructorIOClient({
        apiKey,
        sendTrackingEvents: true,
        version: `cio-ui-plp-${packageJSON.version}`,
        ...options,
      }),
    [apiKey, options],
  );
  return memoizedCioClient!;
};

export default useCioClient;
