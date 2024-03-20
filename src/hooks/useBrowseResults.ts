import { useEffect, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import useRequestConfigs from './useRequestConfigs';
import { transformBrowseResponse } from '../utils/transformers';
import usePagination from '../components/Pagination/usePagination';
import { PaginationProps, PlpBrowseResponse } from '../types';
import { getBrowseParamsFromRequestConfigs } from '../utils';
import useFirstRender from './useFirstRender';

export interface UseBrowseResultsProps {
  initialBrowseResponse?: PlpBrowseResponse;
}

export type UseBrowseResultsReturn = {
  browseResults: PlpBrowseResponse | null;
  handleSubmit: () => void;
  pagination: PaginationProps;
};

/* eslint-disable max-len */
/**
 * A React Hook to call to utilize Constructor.io Browse
 * @param {object} [props.initialBrowseResponse] Initial value for browse results. Results will not be re-fetched on first render if this is provided
 */
/* eslint-enable max-len */
export default function useBrowseResults(
  props: UseBrowseResultsProps = {},
): UseBrowseResultsReturn {
  const { isFirstRender } = useFirstRender();
  const { initialBrowseResponse } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error(
      'useBrowseResults() must be used within a component that is a child of <CioPlp />',
    );
  }

  const { cioClient: client } = contextValue;
  const { requestConfigs } = useRequestConfigs();
  const {
    filterName,
    filterValue,
    queryParams: browseParams,
  } = getBrowseParamsFromRequestConfigs(requestConfigs);

  if ((!filterName || !filterValue) && typeof window !== 'undefined') {
    throw new Error('Unable to retrieve filterName and filterValue from the url.');
  }

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (!client && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  const [browseResponse, setBrowseResponse] = useState<PlpBrowseResponse | null>(
    initialBrowseResponse || null,
  );

  const pagination = usePagination({
    totalNumResults: browseResponse?.totalNumResults,
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
    if (client && filterName && filterValue && (!initialBrowseResponse || !isFirstRender)) {
      client.browse
        .getBrowseResults(filterName, filterValue, {
          ...browseParams,
          page: pagination.currentPage || browseParams?.page,
        })
        .then((res) => setBrowseResponse(transformBrowseResponse(res)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  return { browseResults: browseResponse, handleSubmit, pagination };
}
