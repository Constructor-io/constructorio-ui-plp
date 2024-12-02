import React from 'react';
import { Meta } from '@storybook/react';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import CioPlp from '../../../components/CioPlp';
import { DEMO_API_KEY } from '../../../constants';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumbs>;

const groups = [
  {
    group_id: 'coffee',
    display_name: 'Coffee',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        display_name: 'All',
        group_id: 'all',
      },
    ],
  },
  {
    group_id: 'coffee-accessories',
    display_name: 'Coffee Accessories',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        display_name: 'All',
        group_id: 'all',
      },
      {
        display_name: 'Coffee',
        group_id: 'coffee',
      },
      {
        display_name: 'Coffee Tools',
        group_id: 'coffee-tools',
      },
    ],
  },
  {
    group_id: 'coffee-manual-grinders-espresso-ceramic',
    display_name: 'Manual Ceramic Conical Grinders',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        display_name: 'All',
        group_id: 'all',
      },
      {
        display_name: 'Coffee',
        group_id: 'coffee',
      },
      {
        display_name: 'Coffee Tools',
        group_id: 'coffee-tools',
      },
      {
        display_name: 'Coffee Grinders',
        group_id: 'coffee-grinders',
      },
      {
        display_name: 'Manual Grinders',
        group_id: 'manual-coffee-grinders',
      },
      {
        display_name: 'Manual Espresso Grinders',
        group_id: 'manual-espresso-grinders',
      },
      {
        display_name: 'Manual Conical Grinders',
        group_id: 'manual-espresso-grinders-conical',
      },
    ],
  },
];

export default meta;

export function Primary() {
  return (
    <CioPlp apiKey={DEMO_API_KEY}>
      <Breadcrumbs groups={groups} filterValue='coffee' />
    </CioPlp>
  );
}

export function FourOrLessParentBreadcrumbs() {
  return (
    <CioPlp apiKey={DEMO_API_KEY}>
      <Breadcrumbs groups={groups} filterValue='coffee-accessories' />
    </CioPlp>
  );
}

export function FourOrMoreParentBreadcrumbs() {
  return (
    <CioPlp apiKey={DEMO_API_KEY}>
      <Breadcrumbs groups={groups} filterValue='coffee-manual-grinders-espresso-ceramic' />
    </CioPlp>
  );
}
