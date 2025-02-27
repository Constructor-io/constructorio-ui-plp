import { useCallback, useMemo } from 'react';
import { PlpItemGroup } from '../types';
import useRequestConfigs from './useRequestConfigs';

export interface Breadcrumb {
  path: string;
  groupId: string;
  breadcrumb: string;
}

const generateBreadcrumbs = (currentGroup?: PlpItemGroup) => {
  let pathAccumulator = '';

  const crumbs = currentGroup?.parents?.map<Breadcrumb>((parent) => {
    pathAccumulator += `/${parent.groupId}`;

    return {
      path: pathAccumulator,
      groupId: parent.groupId,
      breadcrumb: parent.displayName,
    };
  });

  return crumbs || [];
};

const getCurrentGroup = (groups: PlpItemGroup[], filterValue: string) =>
  groups.find((group) => filterValue === group.groupId);

export interface UseCioBreadcrumbProps {
  /**
   * An array with all groups on the application.
   */
  groups: PlpItemGroup[];
  /**
   * Filter value of the current group the user is in.
   */
  filterValue: string;
}

export default function useCioBreadcrumb(props: UseCioBreadcrumbProps) {
  const { groups, filterValue } = props;
  const { setRequestConfigs } = useRequestConfigs();

  const currentGroup = useMemo(() => getCurrentGroup(groups, filterValue), [groups, filterValue]);
  const breadcrumbs = generateBreadcrumbs(currentGroup);

  const onBreadcrumbClick = useCallback(
    (groupId: string) => {
      setRequestConfigs({ filterName: 'groupId', filterValue: groupId });
    },
    [setRequestConfigs],
  );

  return { breadcrumbs, currentPage: currentGroup?.displayName, onBreadcrumbClick };
}
