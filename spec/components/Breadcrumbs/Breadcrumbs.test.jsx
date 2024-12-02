import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEMO_API_KEY } from '../../../src/constants';
import CioPlp from '../../../src/components/CioPlp';
import Breadcrumbs from '../../../src/components/Breadcrumbs/Breadcrumbs';

describe('Testing Component: Breadcrumbs', () => {
  const originalWindowLocation = window.location;

  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      value: new URL('https://example.com'),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
    });
    jest.resetAllMocks();
  });

  const groups = [
    {
      group_id: 'all',
      display_name: 'All',
      count: 2,
      data: {},
      children: [],
      parents: [],
    },
    {
      group_id: 'men-shoes-boots',
      display_name: 'Boots',
      count: 2,
      data: {},
      children: [],
      parents: [
        {
          display_name: 'All',
          group_id: 'all',
        },
        {
          display_name: "Men's",
          group_id: 'men',
        },
        {
          display_name: 'Accessories',
          group_id: 'men-accessories',
        },
        {
          display_name: 'Shoes',
          group_id: 'men-shoes',
        },
      ],
    },
    {
      group_id: 'men-shoes-boots-camping',
      display_name: 'Camping Boots',
      count: 2,
      data: {},
      children: [],
      parents: [
        {
          display_name: 'All',
          group_id: 'all',
        },
        {
          display_name: "Men's",
          group_id: 'men',
        },
        {
          display_name: 'Accessories',
          group_id: 'men-accessories',
        },
        {
          display_name: 'Shoes',
          group_id: 'men-shoes',
        },
        {
          display_name: 'Boots',
          group_id: 'men-shoes-boots',
        },
        {
          display_name: 'Heavy Duty Boots',
          group_id: 'men-shoes-boots-heavy-duty',
        },
      ],
    },
  ];
  const filterValue = 'men-shoes-boots';
  const breadcrumbProps = { groups, filterValue };

  it('Should render only the current page when no parent breadcrumbs are present', () => {
    const { getByText, queryAllByRole } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Breadcrumbs {...breadcrumbProps} filterValue='all' />
      </CioPlp>,
    );
    expect(getByText('All')).toBeInTheDocument();
    expect(queryAllByRole('link')).toHaveLength(0);
  });

  it('Should render all parent links when there is 4 or less', () => {
    const bootsBreadcrumbs = [
      { path: '/all', breadcrumb: 'All' },
      { path: '/all/men', breadcrumb: "Men's" },
      { path: '/all/men/men-accessories', breadcrumb: 'Accessories' },
      { path: '/all/men/men-accessories/men-shoes', breadcrumb: 'Shoes' },
    ];
    const { getByText, queryAllByRole } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Breadcrumbs {...breadcrumbProps} />
      </CioPlp>,
    );
    expect(queryAllByRole('link')).toHaveLength(bootsBreadcrumbs.length);
    bootsBreadcrumbs.forEach((breadcrumb) => {
      expect(getByText(breadcrumb.breadcrumb)).toBeInTheDocument();
    });
  });

  it('Should render the first two and last two parent breadcrumbs and hide the rest in a More Menu', () => {
    const { getByTestId, queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Breadcrumbs {...breadcrumbProps} filterValue='men-shoes-boots-camping' />
      </CioPlp>,
    );

    const moreMenu = getByTestId('cio-more-menu');

    const visibleParentBreadcrumbs = [
      { path: '/all', breadcrumb: 'All' },
      { path: '/all/men', breadcrumb: "Men's" },
      { path: '/all/men/men-accessories/men-shoes/men-shoes-boots', breadcrumb: 'Boots' },
      {
        path: '/all/men/men-accessories/men-shoes/men-shoes-boots/men-shoes-boots-heavy-duty',
        breadcrumb: 'Heavy Duty Boots',
      },
    ];

    const moreMenuLinks = [
      { path: '/all/men/men-accessories', breadcrumb: 'Accessories' },
      { path: '/all/men/men-accessories/men-shoes', breadcrumb: 'Shoes' },
    ];

    expect(moreMenu).toHaveAttribute('aria-hidden', 'true');
    moreMenuLinks.forEach((link) => {
      expect(queryByText(link.breadcrumb)).not.toBeInTheDocument();
    });
    visibleParentBreadcrumbs.forEach((link) => {
      expect(queryByText(link.breadcrumb)).toBeInTheDocument();
    });
  });
  it('Should expand the More Menu and show the hidden breadcrumbs when the More Menu button is clicked', () => {
    const { getByTestId, queryByText } = render(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Breadcrumbs {...breadcrumbProps} filterValue='men-shoes-boots-camping' />
      </CioPlp>,
    );

    const moreMenuButton = getByTestId('cio-more-menu-button');
    fireEvent.click(moreMenuButton);
    const moreMenu = getByTestId('cio-more-menu');

    const moreMenuLinks = [
      { path: '/all/men/men-accessories', breadcrumb: 'Accessories' },
      { path: '/all/men/men-accessories/men-shoes', breadcrumb: 'Shoes' },
    ];

    expect(moreMenu).toHaveAttribute('aria-hidden', 'false');
    moreMenuLinks.forEach((link) => {
      expect(queryByText(link.breadcrumb)).toBeInTheDocument();
    });
  });
});
