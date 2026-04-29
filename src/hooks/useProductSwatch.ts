import { useEffect, useMemo, useState } from 'react';
import { useCioPlpContext } from './useCioPlpContext';
import { SwatchItem, UseProductSwatch } from '../types';
import {
  getSwatches as defaultGetSwatches,
  getPrice as defaultGetPrice,
  getSwatchPreview as defaultGetSwatchPreview,
  getSalePrice as defaultGetSalePrice,
  getRolloverImage as defaultGetRolloverImage,
} from '../utils/itemFieldGetters';

const useProductSwatch: UseProductSwatch = ({ item, config }) => {
  const { maxVisibleSwatches } = config ?? {};
  const [selectedVariation, setSelectedVariation] = useState<SwatchItem>();
  const [swatchList, setSwatchList] = useState<SwatchItem[]>([]);

  const state = useCioPlpContext();

  const getSwatches = state?.itemFieldGetters?.getSwatches || defaultGetSwatches;
  const getPrice = state?.itemFieldGetters?.getPrice || defaultGetPrice;
  const getSalePrice = state?.itemFieldGetters?.getSalePrice || defaultGetSalePrice;
  const getSwatchPreview = state?.itemFieldGetters?.getSwatchPreview || defaultGetSwatchPreview;
  const getRolloverImage = state?.itemFieldGetters?.getRolloverImage || defaultGetRolloverImage;

  useEffect(() => {
    if (item?.variations) {
      try {
        setSwatchList(
          getSwatches(item, getPrice, getSwatchPreview, getSalePrice, getRolloverImage) || [],
        );
      } catch (e) {
        // do nothing
      }
    }
  }, [item, getSwatches, getPrice, getSwatchPreview, getSalePrice, getRolloverImage]);

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

  const { visibleSwatches, hiddenSwatches } = useMemo(() => {
    if (!swatchList || maxVisibleSwatches === undefined) {
      return { visibleSwatches: swatchList, hiddenSwatches: undefined };
    }

    const visible = swatchList.slice(0, maxVisibleSwatches);
    const hidden = swatchList.slice(maxVisibleSwatches);

    return { visibleSwatches: visible, hiddenSwatches: hidden.length > 0 ? hidden : undefined };
  }, [swatchList, maxVisibleSwatches]);

  const totalSwatchCount = swatchList?.length ?? 0;
  const hasMoreSwatches = (hiddenSwatches?.length ?? 0) > 0;

  return {
    swatchList,
    selectedVariation,
    selectVariation,
    visibleSwatches,
    hiddenSwatches,
    totalSwatchCount,
    hasMoreSwatches,
  };
};

export default useProductSwatch;
