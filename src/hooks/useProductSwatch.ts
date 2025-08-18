import { useEffect, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { SwatchItem, UseProductSwatch } from '../types';
import {
  getSwatches as defaultGetSwatches,
  getPrice as defaultGetPrice,
  getSwatchPreview as defaultGetSwatchPreview,
  getSalePrice as defaultGetSalePrice,
} from '../utils/itemFieldGetters';

const useProductSwatch: UseProductSwatch = ({ item }) => {
  const [selectedVariation, setSelectedVariation] = useState<SwatchItem>();
  const [swatchList, setSwatchList] = useState<SwatchItem[]>([]);

  const state = useCioPlpContext();

  const getSwatches = state?.itemFieldGetters?.getSwatches || defaultGetSwatches;
  const getPrice = state?.itemFieldGetters?.getPrice || defaultGetPrice;
  const getSalePrice = state?.itemFieldGetters?.getSalePrice || defaultGetSalePrice;
  const getSwatchPreview = state?.itemFieldGetters?.getSwatchPreview || defaultGetSwatchPreview;

  useEffect(() => {
    if (item?.variations) {
      try {
        setSwatchList(getSwatches(item, getPrice, getSwatchPreview, getSalePrice) || []);
      } catch (e) {
        // do nothing
      }
    }
  }, [item, getSwatches, getPrice, getSwatchPreview, getSalePrice]);

  useEffect(() => {
    if (item?.variations) {
      const initialSwatch = swatchList?.find((swatch) => swatch?.variationId === item?.variationId);
      if (initialSwatch) {
        setSelectedVariation(initialSwatch);
      }
    }
  }, [swatchList, item]);

  const selectVariation = (swatch: SwatchItem) => {
    setSelectedVariation(swatch);
  };

  return {
    swatchList,
    selectedVariation,
    selectVariation,
  };
};

export default useProductSwatch;
