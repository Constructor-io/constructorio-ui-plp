import { PlpFacet, PlpFacetOption, FacetConfig } from '../types';

export function shouldRenderVisualFacet(
  facet: PlpFacet,
  perFacetConfigs?: Record<string, FacetConfig>,
  isVisualFilterFn?: (facet: PlpFacet) => boolean,
): boolean {
  const perFacetConfig = perFacetConfigs?.[facet.name];

  if (perFacetConfig?.isVisualFacet !== undefined) {
    return perFacetConfig.isVisualFacet;
  }

  if (typeof isVisualFilterFn === 'function') {
    return isVisualFilterFn(facet);
  }

  // cio_render_visual can hold any value; only boolean `true` enables visual rendering
  return facet.data?.cio_render_visual === true;
}

export interface VisualOption {
  type: 'image' | 'color';
  value: string;
}

export function resolveVisualOption(
  option: PlpFacetOption,
  getVisualImageUrl?: (option: PlpFacetOption) => string | undefined,
  getVisualColorHex?: (option: PlpFacetOption) => string | undefined,
): VisualOption | null {
  if (typeof getVisualImageUrl === 'function') {
    const imageUrl = getVisualImageUrl(option);

    if (imageUrl) return { type: 'image', value: imageUrl };
  }

  if (typeof getVisualColorHex === 'function') {
    const colorHex = getVisualColorHex(option);

    if (colorHex) return { type: 'color', value: colorHex };
  }

  if (option.data?.image_url) {
    return { type: 'image', value: option.data.image_url };
  }

  if (option.data?.hex_color) {
    return { type: 'color', value: option.data.hex_color };
  }

  return null;
}
