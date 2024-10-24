import { Group } from '@constructor-io/constructorio-client-javascript/lib/types';
import { useMemo } from 'react';

const generateBreadcrumbs = (groups: Partial<Group>[], filterValue: string) => {
  const currentGroup = groups.find((group) => filterValue === group.group_id);

  let pathAccumulator = '';

  const crumbs = currentGroup?.parents?.map((parent) => {
    pathAccumulator += `/${parent.group_id}`;

    return {
      path: pathAccumulator,
      breadcrumb: parent.display_name,
    };
  });

  return crumbs;
};

export interface UseCioBreadcrumbProps {
  groups: Partial<Group>[];
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
