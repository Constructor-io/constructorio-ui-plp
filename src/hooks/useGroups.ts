import { useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import useFilter from './useFilter';
import { PlpItemGroup } from '../types';
import useRequestConfigs from './useRequestConfigs';
import useOptionsList, { UseOptionsListProps } from './useOptionsList';
import useCioBreadcrumb, { Breadcrumb } from './useCioBreadcrumb';

export interface UseGroupProps extends Omit<UseOptionsListProps<PlpItemGroup>, 'options'> {
  /**
   * Used to build and render the groups filter dynamically
   */
  groups: Array<PlpItemGroup>;
}

export default function useGroups(props: UseGroupProps) {
  const { groups, initialNumOptions: numOptionsProps } = props;
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

  const setGroup = (groupId: string | null) => {
    setFilter('group_id', groupId);
  };

  const breadcrumbs = useCioBreadcrumb({ groups, filterValue: currentGroupId || 'all' }) || [];
  const { initialNumOptions, isShowAll, setIsShowAll, optionsToRender, setOptionsToRender } =
    useOptionsList({
      options: groupOptions,
      initialNumOptions: numOptionsProps,
    });

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>();

  const onOptionSelect = (groupId: string | null) => {
    if (groupId === currentGroupId || groupId === selectedGroupId) {
      setSelectedGroupId(null);
      setGroup(null);
    } else {
      setSelectedGroupId(groupId);
      setGroup(groupId);
    }
  };

  const goToGroupFilter = (breadcrumb: Breadcrumb) => {
    const groupIds = breadcrumb?.path?.split('/');
    const targetGroupId = groupIds[groupIds.length - 1];

    // If there are no parents, remove the filter entirely.
    // This assumes a one-root-node hierarchy
    if (groupIds.length > 2) {
      onOptionSelect(targetGroupId);
    } else {
      onOptionSelect(null);
    }
  };

  return {
    groups,
    groupOptions,
    setGroup,
    currentGroupId,
    selectedGroupId,
    setSelectedGroupId,
    onOptionSelect,
    goToGroupFilter,

    // useCioBreadcrumbs
    breadcrumbs,

    // useOptionsList
    initialNumOptions,
    isShowAll,
    setIsShowAll,
    optionsToRender,
    setOptionsToRender,
  };
}
