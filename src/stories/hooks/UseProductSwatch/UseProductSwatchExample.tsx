import React from 'react';
import useProductSwatch from '../../../components/ProductSwatch/useProductSwatch';
import { UseProductSwatchProps } from '../../../types';
import ProductSwatch from '../../../components/ProductSwatch/ProductSwatch';
import CioPlp from '../../../components/CioPlp';
import { DEMO_API_KEY } from '../../../constants';

export default function UseProductSwatchExample(props: UseProductSwatchProps) {
  const swatchObject = useProductSwatch(props);

  return (
    <CioPlp apiKey={DEMO_API_KEY}>
      <ProductSwatch swatchObject={swatchObject} />
    </CioPlp>
  );
}
