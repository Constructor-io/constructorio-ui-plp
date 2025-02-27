import type { Breadcrumb, UseCioBreadcrumbProps } from '../../hooks/useCioBreadcrumb';

export type BreadcrumbsProps = UseCioBreadcrumbProps;

export interface BreadcrumbProps extends Partial<Breadcrumb> {
  isCurrentPage?: boolean;
  onClick?: (path: string) => void;
}

export interface MoreBreadcrumbsMenuProps {
  breadcrumbs: Breadcrumb[];
}
