import type { UseCioBreadcrumbProps } from '../../hooks/useCioBreadcrumb';
import type { Breadcrumb } from '../../types';

export type BreadcrumbsProps = UseCioBreadcrumbProps;

export interface BreadcrumbProps extends Partial<Breadcrumb> {
  isCurrentPage?: boolean;
  onClick?: (path: string) => void;
}

export interface MoreBreadcrumbsMenuProps {
  breadcrumbs: Breadcrumb[];
}
