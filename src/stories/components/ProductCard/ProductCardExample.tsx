import React from 'react';
import ProductCard, { ProductCardProps } from '../../../components/ProductCard';
import { DEMO_API_KEY } from '../../../constants';
import { CioPlpContext } from '../../../PlpContext';

/**
 * A Product Card UI Component
 */
export default function ProductCardExample({ ...props }: ProductCardProps) {
  return (
    <CioPlpContext apiKey={DEMO_API_KEY}>
      <ProductCard {...props} />
    </CioPlpContext>
  );
}
