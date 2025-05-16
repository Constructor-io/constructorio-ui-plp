import { useEffect, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { SwatchItem, UseProductSwatch, Variation } from '../types';
import {
  getSwatches as defaultGetSwatches,
  getSwatchPreview as defaultGetSwatchPreview,
} from '../utils/itemFieldGetters';

const useProductSwatch: UseProductSwatch = ({ item }) => {
  const [selectedVariation, setSelectedVariation] = useState<Variation>();
  const [swatchList, setSwatchList] = useState<SwatchItem[]>([]);

  const state = useCioPlpContext();

  const getSwatches = state?.itemFieldGetters?.getSwatches || defaultGetSwatches;
  const getSwatchPreview = state?.itemFieldGetters?.getSwatchPreview || defaultGetSwatchPreview;

  useEffect(() => {
    if (item?.variations) {
      try {
        const swatches = getSwatches(item, getSwatchPreview);
        setSwatchList(swatches || []);
      } catch (e) {
        // do nothing
      }
    }
  }, [item, getSwatches, getSwatchPreview]);

  useEffect(() => {
    if (item?.variations) {
      const initialVariation = item?.variations?.[0];
      if (initialVariation) {
        setSelectedVariation(initialVariation);
      }
    }
  }, [swatchList, item]);

  const selectVariation = (variation: Variation) => {
    setSelectedVariation(variation);
  };

  return {
    swatchList,
    selectedVariation,
    selectVariation,
  };
};

export default useProductSwatch;
