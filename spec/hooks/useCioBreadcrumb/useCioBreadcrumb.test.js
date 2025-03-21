import '@testing-library/jest-dom';
import { renderHookWithCioPlp } from '../../test-utils';
import useCioBreadcrumb from '../../../src/hooks/useCioBreadcrumb';
import groups from '../../local_examples/sampleGroups.json';

describe('Testing Hook: useBreadCrumb', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // This will reset all mocks after each test
  });

  const breadcrumbs = [
    { path: '/all', breadcrumb: 'All' },
    { path: '/all/men', breadcrumb: "Men's" },
    { path: '/all/men/men-accessories', breadcrumb: 'Accessories' },
    { path: '/all/men/men-accessories/men-shoes', breadcrumb: 'Shoes' },
  ];

  const filterValue = 'men-shoes-boots';
  const useBreadcrumbProps = { groups, filterValue };

  it('Should return crumbs array', async () => {
    const { result } = renderHookWithCioPlp(() => useCioBreadcrumb(useBreadcrumbProps));

    const {
      current: { breadcrumbs: crumbs },
    } = result;

    expect(crumbs).toHaveLength(groups[0].parents.length);

    crumbs.forEach((breadcrumb, index) => {
      expect(breadcrumb).toHaveProperty('path');
      expect(breadcrumb).toHaveProperty('breadcrumb');
      expect(breadcrumb.breadcrumb).toBe(groups[0].parents[index].displayName);
      expect(breadcrumb.path).toBe(breadcrumbs[index].path);
    });
  });

  it('Should return an empty array if there are no breadcrumbs', async () => {
    const { result } = renderHookWithCioPlp(() => useCioBreadcrumb({ groups, filterValue: 'All' }));

    const {
      current: { breadcrumbs: crumbs },
    } = result;

    expect(crumbs).not.toBeNull();
    expect(crumbs).toHaveLength(0);
  });

  it('Should return the current page display name', async () => {
    const { result } = renderHookWithCioPlp(() => useCioBreadcrumb(useBreadcrumbProps));

    const {
      current: { currentPage },
    } = result;

    expect(currentPage).toBe(groups[0].display_name);
  });
});
