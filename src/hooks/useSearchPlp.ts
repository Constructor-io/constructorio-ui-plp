import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { usePlpState } from '../PlpContext';
import { transformSearchResponse } from '../transformers';
import { PlpSearchResponse } from '../types';

export type UseCioPlpHook = { cioClient: ConstructorIOClient };
export type UseSearchPlpConfigs = {
  cioClient?: ConstructorIOClient;
  searchParams?: SearchParameters;
};

export default async function useSearchPlp(
  query: string,
  configs: UseSearchPlpConfigs,
): Promise<PlpSearchResponse> {
  const { cioClient, searchParams } = configs;
  const state = usePlpState();
  const client = cioClient || state?.cioClient;

  if (!client) {
    throw new Error('CioClient required');
  }

  const res = await client.search.getSearchResults(query, searchParams);

  return transformSearchResponse(res);
}
