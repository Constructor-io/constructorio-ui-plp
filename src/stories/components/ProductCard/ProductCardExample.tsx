import React from 'react';
import ProductCard, { ProductCardProps } from '../../../components/ProductCard';
import { DEMO_API_KEY } from '../../../constants';
import CioPlp from '../../../components/CioPlp';

/**
 * A Product Card UI Component
 */
export default function ProductCardExample({ ...props }: ProductCardProps) {
  return (
    <CioPlp apiKey={DEMO_API_KEY}>
      <ProductCard {...props} />
    </CioPlp>
  );
}
