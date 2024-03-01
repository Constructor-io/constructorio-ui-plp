import { useEffect, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { PlpBrowseResponse, PlpSearchResponse, PlpSortOption, UseSortReturn } from '../types';
import { transformSortOptionsResponse } from '../utils/transformers';
import useRequestConfigs from './useRequestConfigs';

const useSort = (searchOrBrowseResponse: PlpBrowseResponse | PlpSearchResponse): UseSortReturn => {
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useSort must be used within a component that is a child of <CioPlp />');
  }

  const { cioClient } = contextValue;

  // Throw error if client is not provided and window is defined (i.e. not SSR)
  if (!cioClient && typeof window !== 'undefined') {
    throw new Error('CioClient required');
  }

  const [selectedSort, setSelectedSort] = useState<PlpSortOption>({
    sortBy: '',
    sortOrder: 'ascending',
    displayName: '',
  });

  const sortOptions = transformSortOptionsResponse(searchOrBrowseResponse.sortOptions);
  const {
    requestConfigs: { sortBy, sortOrder },
    setRequestConfigs,
  } = useRequestConfigs();

  useEffect(() => {
    const sortOption = sortOptions.find(
      (option) => option.sortBy === sortBy && option.sortOrder === sortOrder,
    );
    if (sortOption) setSelectedSort(sortOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const changeSelectedSort = (sortOption: PlpSortOption) => {
    setRequestConfigs({ sortBy: sortOption.sortBy, sortOrder: sortOption.sortOrder });
  };

  return {
    sortOptions,
    selectedSort,
    changeSelectedSort,
  };
};

export default useSort;
