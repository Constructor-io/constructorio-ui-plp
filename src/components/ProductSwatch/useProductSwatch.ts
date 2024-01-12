import { useEffect, useState } from 'react';
import { useCioPlpContext } from '../../hooks/useCioPlpContext';
import { SwatchItem, UseProductSwatch } from '../../types';
import { getSwatches as defaultGetSwatches } from '../../utils/getters';

const useProductSwatch: UseProductSwatch = ({ item }) => {
  const [selectedVariation, setSelectedVariation] = useState<SwatchItem>();
  const [swatchList, setSwatchList] = useState<[SwatchItem]>();

  const state = useCioPlpContext();

  const getSwatches = state?.getters?.getSwatches || defaultGetSwatches;

  useEffect(() => {
    if (item?.variations) {
      setSwatchList(getSwatches(item));
    }
  }, [item, getSwatches]);

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
