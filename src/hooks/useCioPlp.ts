import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import useCioClient from './useCioClient';

export type CioPlpConfigs = { apiKey?: string };
export type UseCioPlpHook = { cioClient: ConstructorIOClient };

type UseCioPlp = (configs: CioPlpConfigs) => UseCioPlpHook;

const useCioPlp: UseCioPlp = (configs) => {
  const { apiKey } = configs;
  if (!apiKey) {
    throw new Error('Api Key required');
  }

  const cioClient = useCioClient(apiKey);

  return {
    cioClient,
  };
};

export default useCioPlp;
