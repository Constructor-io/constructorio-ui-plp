import React from 'react';
import useProductSwatch from '../../useProductSwatch';
import { UseProductSwatchProps } from '../../../../types';
import ProductSwatch from '../../ProductSwatch';

export default function UseProductSwatchExample(props: UseProductSwatchProps) {
  const swatchObject = useProductSwatch(props);

  return <ProductSwatch swatchObject={swatchObject} />;
}
