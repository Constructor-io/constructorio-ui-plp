import { useEffect, useState } from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { SwatchItem, UseProductSwatch } from '../../types';
import {
  getSwatches as defaultGetSwatches,
  getPrice as defaultGetPrice,
  getSwatchPreview as defaultGetSwatchPreview,
} from '../../utils/getters';

const useProductSwatch: UseProductSwatch = ({ item }) => {
  const [selectedVariation, setSelectedVariation] = useState<SwatchItem>();
  const [swatchList, setSwatchList] = useState<SwatchItem[]>();

  const state = useCioPlpContext();

  const getSwatches = state?.getters?.getSwatches || defaultGetSwatches;
  const getPrice = state?.getters?.getPrice || defaultGetPrice;
  const getSwatchPreview = state?.getters?.getSwatchPreview || defaultGetSwatchPreview;

  useEffect(() => {
    if (item?.variations) {
      setSwatchList(getSwatches(item, getPrice, getSwatchPreview));
    }
  }, [item, getSwatches, getPrice, getSwatchPreview]);

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
