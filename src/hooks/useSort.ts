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

  const [selectedSort, setSelectedSort] = useState<PlpSortOption | null>(null);

  const sortOptions = transformSortOptionsResponse(searchOrBrowseResponse.sortOptions);
  const {
    requestConfigs: { sortBy, sortOrder },
    setRequestConfigs,
  } = useRequestConfigs();

  // Read sort configs from url and set state
  useEffect(() => {
    const sortOption = sortOptions.find(
      (option) => option.sortBy === sortBy && option.sortOrder === sortOrder,
    );
    if (sortOption) setSelectedSort(sortOption);
    // Select default sort option
    else if (sortOptions.length) setSelectedSort(sortOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const changeSelectedSort = (sortOption: PlpSortOption) => {
    setSelectedSort(sortOption);
    setRequestConfigs({ sortBy: sortOption.sortBy, sortOrder: sortOption.sortOrder });
  };

  return {
    sortOptions,
    selectedSort,
    changeSelectedSort,
  };
};

export default useSort;
