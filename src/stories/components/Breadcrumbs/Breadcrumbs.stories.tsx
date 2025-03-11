import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import Breadcrumbs from '../../../components/Breadcrumbs';
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
    groupId: 'coffee',
    displayName: 'Coffee',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        displayName: 'All',
        groupId: 'all',
      },
    ],
  },
  {
    groupId: 'coffee-accessories',
    displayName: 'Coffee Accessories',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        displayName: 'All',
        groupId: 'all',
      },
      {
        displayName: 'Coffee',
        groupId: 'coffee',
      },
      {
        displayName: 'Coffee Tools',
        groupId: 'coffee-tools',
      },
    ],
  },
  {
    groupId: 'coffee-manual-grinders-espresso-ceramic',
    displayName: 'Manual Ceramic Conical Grinders',
    count: 2,
    data: {},
    children: [],
    parents: [
      {
        displayName: 'All',
        groupId: 'all',
      },
      {
        displayName: 'Coffee',
        groupId: 'coffee',
      },
      {
        displayName: 'Coffee Tools',
        groupId: 'coffee-tools',
      },
      {
        displayName: 'Coffee Grinders',
        groupId: 'coffee-grinders',
      },
      {
        displayName: 'Manual Grinders',
        groupId: 'manual-coffee-grinders',
      },
      {
        displayName: 'Manual Espresso Grinders',
        groupId: 'manual-espresso-grinders',
      },
      {
        displayName: 'Manual Conical Grinders',
        groupId: 'manual-espresso-grinders-conical',
      },
    ],
  },
];

export default meta;

export function Primary() {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);
  
  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <Breadcrumbs groups={groups} filterValue='coffee' />
    </CioPlp>
  );
}

export function FourOrLessParentBreadcrumbs() {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <Breadcrumbs groups={groups} filterValue='coffee-accessories' />
    </CioPlp>
  );
}

export function MoreThanFourParentBreadcrumbs() {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  return (
    <CioPlp
      apiKey={DEMO_API_KEY}
      urlHelpers={{
        setUrl: (url) => {
          setCurrentUrl(url);
        },
        getUrl: () => currentUrl,
      }}>
      <Breadcrumbs groups={groups} filterValue='coffee-manual-grinders-espresso-ceramic' />
    </CioPlp>
  );
}
