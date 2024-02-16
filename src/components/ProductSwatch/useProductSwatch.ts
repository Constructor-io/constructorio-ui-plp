import { useEffect, useState } from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { SwatchItem, UseProductSwatch } from '../../types';

const useProductSwatch: UseProductSwatch = ({ item }) => {
  const [selectedVariation, setSelectedVariation] = useState<SwatchItem>();
  const [swatchList, setSwatchList] = useState<SwatchItem[]>();

  const state = useCioPlpContext();

  const getSwatches = state?.itemFieldGetters?.getSwatches;
  const getPrice = state?.itemFieldGetters?.getPrice;
  const getSwatchPreview = state?.itemFieldGetters?.getSwatchPreview;

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
