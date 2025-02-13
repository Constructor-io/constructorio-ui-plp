import type { Breadcrumb, UseCioBreadcrumbProps } from '../../hooks/useCioBreadcrumb';

export type BreadcrumbsProps = UseCioBreadcrumbProps;

export interface BreadcrumbProps extends Partial<Breadcrumb> {
  isCurrentPage?: boolean;
  onClickHandler?: (path: string) => void;
}

export interface MoreBreadcrumbsMenuProps {
  breadcrumbs: Breadcrumb[];
}
