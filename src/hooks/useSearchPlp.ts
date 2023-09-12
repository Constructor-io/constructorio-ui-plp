import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import { SearchParameters } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useState } from 'react';
import { usePlpState } from '../PlpContext';
import { transformSearchResponse } from '../transformers';
import { PlpSearchResponse } from '../types';

export type UseCioPlpHook = { cioClient: ConstructorIOClient };
export type UseSearchPlpConfigs = {
  cioClient?: ConstructorIOClient;
  searchParams?: SearchParameters;
};

export default function useSearchPlp(
  query: string,
  configs: UseSearchPlpConfigs = {},
): PlpSearchResponse | null {
  const { cioClient, searchParams } = configs;
  const state = usePlpState();
  const client = cioClient || state?.cioClient;

  if (!client) {
    throw new Error('CioClient required');
  }

  const [searchResponse, setSearchResponse] = useState<PlpSearchResponse | null>(null);
  useEffect(() => {
    client.search
      .getSearchResults(query, searchParams)
      .then((res) => setSearchResponse(transformSearchResponse(res)));
  }, [client, query, searchParams]);

  return searchResponse;
}
