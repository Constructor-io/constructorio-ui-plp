import { useCallback, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import useFilter from './useFilter';
import { PlpItemGroup } from '../types';
import useRequestConfigs from './useRequestConfigs';
import useOptionsList, { UseOptionsListProps } from './useOptionsList';
import useCioBreadcrumb, { Breadcrumb } from './useCioBreadcrumb';

export interface UseGroupProps
  extends Omit<UseOptionsListProps<PlpItemGroup>, 'options' | 'isHiddenOptionFn'> {
  /**
   * Used to build and render the groups filter dynamically
   */
  groups: Array<PlpItemGroup>;

  /**
   * Function that takes in a PlpItemGroup and returns `true` if the group should be hidden from the final render
   * @returns boolean
   */
  isHiddenGroupFn?: (group: PlpItemGroup) => boolean;
}

export default function useGroups(props: UseGroupProps) {
  const { groups, initialNumOptions: numOptionsProps, isHiddenGroupFn } = props;
  const contextValue = useCioPlpContext();

  if (!contextValue) {
    throw new Error('useGroups must be used within a component that is a child of <CioPlp />');
  }

  const { getIsHiddenGroupField } = contextValue.itemFieldGetters;
  const { setFilter } = useFilter({ facets: [] });
  const { getRequestConfigs } = useRequestConfigs();
  const requestConfigs = getRequestConfigs();

  let groupOptions = groups;
  let currentGroupId = requestConfigs.filters?.groupId?.toString() || null;
  if (currentGroupId || groups.length === 1) {
    currentGroupId = groups[0].groupId;
    groupOptions = groups[0].children;
  }

  const setGroup = (groupId: string | null) => {
    setFilter('group_id', groupId);
  };

  const isHiddenOptionFn = useCallback(
    (group: PlpItemGroup) =>
      (typeof isHiddenGroupFn === 'function' && isHiddenGroupFn(group)) ||
      (typeof getIsHiddenGroupField === 'function' && getIsHiddenGroupField(group)) ||
      false, // Ensure that isHiddenOptionFn never returns undefined
    [isHiddenGroupFn, getIsHiddenGroupField],
  );

  const { breadcrumbs, currentPage } =
    useCioBreadcrumb({ groups, filterValue: currentGroupId || 'all' }) || [];
  const { initialNumOptions, isShowAll, setIsShowAll, optionsToRender, setOptionsToRender } =
    useOptionsList({
      options: groupOptions,
      initialNumOptions: numOptionsProps,
      isHiddenOptionFn,
      nestedOptionsKey: 'children', // Enable recursive filtering for group children
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
    groupOptions,
    setGroup,
    currentGroupId,
    selectedGroupId,
    setSelectedGroupId,
    onOptionSelect,
    goToGroupFilter,

    // useCioBreadcrumbs
    breadcrumbs,
    currentPage,

    // useOptionsList
    initialNumOptions,
    isShowAll,
    setIsShowAll,
    optionsToRender,
    setOptionsToRender,
  };
}
