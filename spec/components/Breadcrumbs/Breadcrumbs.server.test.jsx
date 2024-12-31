import React from 'react';
import { renderToString } from 'react-dom/server';
import '@testing-library/jest-dom';
import { DEMO_API_KEY } from '../../../src/constants';
import CioPlp from '../../../src/components/CioPlp';
import Breadcrumbs from '../../../src/components/Breadcrumbs';

const groups = [
  {
    groupId: 'men-shoes-boots',
    displayName: 'Boots',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        displayName: 'All',
        groupId: 'all',
      },
      {
        displayName: 'Men',
        groupId: 'men',
      },
      {
        displayName: 'Accessories',
        groupId: 'men-accessories',
      },
      {
        displayName: 'Shoes',
        groupId: 'men-shoes',
      },
    ],
  },
];

const filterValue = 'men-shoes-boots';
const breadcrumbsProps = { groups, filterValue };

describe('Testing Component on the server: Breadcrumbs', () => {
  beforeEach(() => {
    // Mock console error to de-clutter the console for expected errors
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });

  afterAll(() => {
    jest.resetAllMocks(); // This will reset all mocks after each test
  });
  it('Should render all parent breadcrumbs and current page correctly', () => {
    const html = renderToString(
      <CioPlp apiKey={DEMO_API_KEY}>
        <Breadcrumbs {...breadcrumbsProps} />
      </CioPlp>,
    );
    const bootsBreadcrumbs = [
      { path: '/all', breadcrumb: 'All' },
      { path: '/all/men', breadcrumb: 'Men' },
      { path: '/all/men/men-accessories', breadcrumb: 'Accessories' },
      { path: '/all/men/men-accessories/men-shoes', breadcrumb: 'Shoes' },
    ];
    expect(html).toContain('Boots');
    bootsBreadcrumbs.forEach((breadcrumbItem) => {
      expect(html).toContain(breadcrumbItem.breadcrumb);
    });
  });
});
