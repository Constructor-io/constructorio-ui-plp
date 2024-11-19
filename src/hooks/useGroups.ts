import { useCioPlpContext } from './useCioPlpContext';
import useFilter from './useFilter';
import { PlpItemGroup } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface UseGroupReturn {
  groups: Array<PlpItemGroup>;
  groupOptions: Array<PlpItemGroup>;
  setGroup: (groupId: string) => void;
  currentGroupId: string | null;
}

export interface UseGroupProps {
  /**
   * Used to build and render the groups filter dynamically
   */
  groups: Array<PlpItemGroup>;
}

export default function useGroups(props: UseGroupProps): UseGroupReturn {
  const { groups } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useGroups must be used within a component that is a child of <CioPlp />');
  }

  const { setFilter } = useFilter({ facets: [] });
  const { requestConfigs } = useRequestConfigs();
  let groupOptions = groups;

  let currentGroupId = requestConfigs.filters?.groupId?.toString() || null;
  if (currentGroupId || groups.length === 1) {
    currentGroupId = groups[0].groupId;
    groupOptions = groups[0].children;
  }

  const setGroup = (groupId: string) => {
    setFilter('groupId', groupId);
  };

  return {
    groups,
    groupOptions,
    setGroup,
    currentGroupId,
  };
}
