import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { ConstructorClientOptions } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useState } from 'react';
import version from '../version';
import { Nullable } from '../types';

type UseCioClient = (cioConfig?: ConstructorClientOptions) => Nullable<ConstructorIOClient> | never;

const useCioClient: UseCioClient = (cioConfig) => {
  const apiKey = cioConfig?.apiKey;
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  // On the server ConstructorIOClient will be null
  const [cioClient, setCioClient] = useState<ConstructorIOClient | null>(null);

  // Insures that the javascript ConstructorIOClient is only created on the client side and never on the server side
  useEffect(() => {
    setCioClient(
      new ConstructorIOClient({
        sendTrackingEvents: true,
        version: `cio-ui-plp-${version}`,
        ...cioConfig,
      }),
    );
  }, [cioConfig]);

  return cioClient;
};

export default useCioClient;
