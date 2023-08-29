import React from 'react';
import { usePlpState } from '../../PlpContext';

export default function ProductCard() {
  const state = usePlpState();

  return (
    <div>
      <div>This is a Product Card</div>
      <div>{JSON.stringify(state?.cioClientOptions)}</div>
    </div>
  );
}
