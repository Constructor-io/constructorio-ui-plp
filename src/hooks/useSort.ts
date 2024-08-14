import { useEffect, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { PlpSortOption, UseSortReturn } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseSortProps {
  /**
   * Used to build and render sort options dynamically
   */
  sortOptions: Array<PlpSortOption>;
}

const useSort = ({ sortOptions }: UseSortProps): UseSortReturn => {
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useSort must be used within a component that is a child of <CioPlp />');
  }

  const [selectedSort, setSelectedSort] = useState<PlpSortOption | null>(null);

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
    else if (sortOptions.length) {
      const defaultSort = sortOptions.find((option) => option.status === 'selected');
      if (defaultSort) setSelectedSort(defaultSort);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  const changeSelectedSort = (sortOption: PlpSortOption) => {
    setSelectedSort(sortOption);
    setRequestConfigs({ sortBy: sortOption.sortBy, sortOrder: sortOption.sortOrder, page: 1 });
  };

  return {
    sortOptions,
    selectedSort,
    changeSelectedSort,
  };
};

export default useSort;
