import React from 'react';
import { usePlpState } from '../../PlpContext';

export default function CioPlp() {
  const state = usePlpState();

  return (
    <div>
      <div>This is a Product Listing Page (PLP)</div>
      <div>{JSON.stringify(state?.cioClientOptions)}</div>
    </div>
  );
}
