import React from 'react';
import { usePlpContext } from '../../PlpContext';

export default function CioPlp() {
  const state = usePlpContext();

  return (
    <div>
      <div>This is a Product Listing Page (PLP)</div>
      <div>{JSON.stringify(state?.cioClientOptions)}</div>
    </div>
  );
}
