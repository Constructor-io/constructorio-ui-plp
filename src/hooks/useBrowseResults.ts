import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  IBrowseParameters,
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useState } from 'react';
import { useCioPlpContext } from '../PlpContext';
import { transformBrowseResponse } from '../utils/transformers';
import { PlpBrowseResponse } from '../types';

export type UseBrowseResultsConfig = {
  cioClient?: Nullable<ConstructorIOClient>;
  browseParams?: IBrowseParameters;
};

/**
 * A React Hook to call to utilize Constructor.io Browse
 * @param filterName Browse Filter Name
 * @param filterValue Browse Filter Value
 * @param configs A configuration object
 * @param configs.cioClient A CioClient created by useCioClient. Required if called outside of the CioPlpContext.
 * @param configs.browseParams Browse Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-browse.html#~getBrowseResults for the full list of options.
 */
export default function useBrowseResults(
  filterName: string,
  filterValue: string,
  configs: UseBrowseResultsConfig = {},
): PlpBrowseResponse | null {
  const { cioClient, browseParams } = configs;
  const state = useCioPlpContext();
  const client = cioClient || state?.cioClient;

  if (!client) {
    throw new Error('CioClient required');
  }

  const [browseResponse, setBrowseResponse] = useState<PlpBrowseResponse | null>(null);
  useEffect(() => {
    client.browse
      .getBrowseResults(filterName, filterValue, browseParams)
      .then((res) => setBrowseResponse(transformBrowseResponse(res)));
  }, [client, filterName, filterValue, browseParams]);

  return browseResponse;
}
