import { useMemo } from 'react';
import { PlpItemGroup } from '../types';

const generateBreadcrumbs = (groups: Partial<PlpItemGroup>[], filterValue: string) => {
  const currentGroup = groups.find((group) => filterValue === group.groupId);

  let pathAccumulator = '';

  const crumbs = currentGroup?.parents?.map((parent) => {
    pathAccumulator += `/${parent.groupId}`;

    return {
      path: pathAccumulator,
      breadcrumb: parent.displayName,
    };
  });

  return crumbs;
};

export interface UseCioBreadcrumbProps {
  groups: PlpItemGroup[];
  filterValue: string;
}

export default function useCioBreadcrumb(props: UseCioBreadcrumbProps) {
  const { groups, filterValue } = props;

  const breadcrumbs = useMemo(
    () => generateBreadcrumbs(groups, filterValue),
    [groups, filterValue],
  );

  return breadcrumbs;
}
