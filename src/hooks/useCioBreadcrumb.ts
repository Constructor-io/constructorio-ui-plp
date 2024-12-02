import { Group } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useMemo } from 'react';

export interface Breadcrumb {
  path: string;
  breadcrumb: string;
}

const generateBreadcrumbs = (currentGroup?: Partial<Group>) => {
  let pathAccumulator = '';

  const crumbs = currentGroup?.parents?.map<Breadcrumb>((parent) => {
    pathAccumulator += `/${parent.group_id}`;

    return {
      path: pathAccumulator,
      breadcrumb: parent.display_name,
    };
  });

  return crumbs;
};

const getCurrentGroup = (groups: Partial<Group>[], filterValue: string) =>
  groups.find((group) => filterValue === group.group_id);

export interface UseCioBreadcrumbProps {
  groups: Partial<Group>[];
  filterValue: string;
}

export default function useCioBreadcrumb(props: UseCioBreadcrumbProps) {
  const { groups, filterValue } = props;

  const currentGroup = useMemo(() => getCurrentGroup(groups, filterValue), [groups, filterValue]);
  const breadcrumbs = generateBreadcrumbs(currentGroup);

  return { breadcrumbs, currentPage: currentGroup?.display_name };
}
