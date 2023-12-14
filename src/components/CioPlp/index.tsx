import React from 'react';
import { useCioPlpContext } from '../../PlpContext';

export default function CioPlp() {
  const state = useCioPlpContext();

  return (
    <div>
      <div>This is a Product Listing Page (PLP)</div>
      <div>{JSON.stringify(state?.cioClientOptions)}</div>
    </div>
  );
}
