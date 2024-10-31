import { Group } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useCioPlpContext } from './useCioPlpContext';
import useFilter from './useFilter';

export interface UseGroupReturn {
  groups: Array<Group>;
  setGroup: (groupId: string) => void;
}

export interface UseGroupProps {
  /**
   * Used to build and render the groups filter dynamically
   */
  groups: Array<Group>;
}

export default function useGroups(props: UseGroupProps): UseGroupReturn {
  const { groups } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useGroups must be used within a component that is a child of <CioPlp />');
  }

  const { setFilter } = useFilter({ facets: [] });
  const setGroup = (groupId: string) => {
    setFilter('groupId', groupId);
  };

  return {
    groups,
    setGroup,
  };
}
