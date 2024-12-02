import { Breadcrumb } from '../../hooks/useCioBreadcrumb';

// eslint-disable-next-line import/prefer-default-export
export const splitBreadcrumbs = (breadcrumbs: Breadcrumb[] = []) => {
  const [firstElement, secondElement, ...rest] = breadcrumbs;
  const lastItems = rest.slice(-2);
  const middle = rest.slice(0, rest.length - 2);
  return {
    firstItems: [firstElement, secondElement].filter(Boolean),
    middle,
    lastItems,
  };
};
