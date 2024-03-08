import ConstructorIOClient from '@constructor-io/constructorio-client-javascript';
import {
  IBrowseParameters,
  Nullable,
} from '@constructor-io/constructorio-client-javascript/lib/types';
import { useEffect, useRef, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { transformBrowseResponse } from '../utils/transformers';
import { PaginationProps, PlpBrowseResponse } from '../types';
import usePagination from '../components/Pagination/usePagination';

export type UseBrowseResultsConfig = {
  cioClient?: Nullable<ConstructorIOClient>;
  browseParams?: IBrowseParameters;
};

export type UseBrowseResultsReturn = {
  browseResults: PlpBrowseResponse | null;
  handleSubmit: () => void;
  pagination: PaginationProps;
};

/**
 * A React Hook to call to utilize Constructor.io Browse
 * @param filterName Browse Filter Name
 * @param filterValue Browse Filter Value
 * @param configs A configuration object
 * @param configs.cioClient A CioClient created by useCioClient. Required if called outside of the CioPlp provider.
 * @param configs.browseParams Browse Parameters to be passed in along with the request. See https://constructor-io.github.io/constructorio-client-javascript/module-browse.html#~getBrowseResults for the full list of options.
 */
export default function useBrowseResults(
  filterName: string,
  filterValue: string,
  configs: UseBrowseResultsConfig = {},
  initialBrowseResponse?: PlpBrowseResponse,
): UseBrowseResultsReturn {
  const firstRender = useRef(true);
  const { cioClient, browseParams } = configs;
  const state = useCioPlpContext();
  const client = cioClient || state?.cioClient;

  if (!filterName || !filterValue) {
    throw new Error('filterName and filterValue are required');
  }
  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (!client && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  const [browseResponse, setBrowseResponse] = useState<PlpBrowseResponse | null>(
    initialBrowseResponse || null,
  );
  const pagination = usePagination({
    initialPage: browseResponse?.rawResponse.request?.page,
    totalNumResults: browseResponse?.totalNumResults,
    resultsPerPage: browseResponse?.numResultsPerPage,
  });

  const handleSubmit = () => {
    if (client && filterName && filterValue) {
      client.browse
        .getBrowseResults(filterName, filterValue, {
          ...browseParams,
          page: pagination.currentPage || browseParams?.page,
        })
        .then((res) => setBrowseResponse(transformBrowseResponse(res)));
    }
  };

  useEffect(() => {
    if (client && filterName && filterValue && (!initialBrowseResponse || !firstRender)) {
      client.browse
        .getBrowseResults(filterName, filterValue, {
          ...browseParams,
          page: pagination.currentPage || browseParams?.page,
        })
        .then((res) => setBrowseResponse(transformBrowseResponse(res)));
    }

    if (firstRender.current) {
      firstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  return { browseResults: browseResponse, handleSubmit, pagination };
}
