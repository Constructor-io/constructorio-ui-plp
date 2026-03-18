import { shouldRenderVisualFacet, resolveVisualOption } from '../../src/utils/visualFilterHelpers';

describe('visualFilterHelpers', () => {
  describe('shouldRenderVisualFacet', () => {
    const baseFacet = {
      displayName: 'Color',
      name: 'color',
      type: 'multiple' as const,
      data: {},
      hidden: false,
    };

    it('returns false when no config, no callback, and no data attribute', () => {
      expect(shouldRenderVisualFacet(baseFacet)).toBe(false);
    });

    it('returns true when facet.data.cio_render_visual is true', () => {
      const facet = { ...baseFacet, data: { cio_render_visual: true } };
      expect(shouldRenderVisualFacet(facet)).toBe(true);
    });

    it('returns false when facet.data.cio_render_visual is false', () => {
      const facet = { ...baseFacet, data: { cio_render_visual: false } };
      expect(shouldRenderVisualFacet(facet)).toBe(false);
    });

    it('isVisualFilterFn callback overrides data attribute', () => {
      const facet = { ...baseFacet, data: { cio_render_visual: false } };
      const isVisualFilterFn = () => true;
      expect(shouldRenderVisualFacet(facet, undefined, isVisualFilterFn)).toBe(true);
    });

    it('filterConfigs overrides callback', () => {
      const facet = { ...baseFacet, data: { cio_render_visual: true } };
      const isVisualFilterFn = () => true;
      const filterConfigs = { color: { renderVisual: false } };
      expect(shouldRenderVisualFacet(facet, filterConfigs, isVisualFilterFn)).toBe(false);
    });

    it('filterConfigs renderVisual: true overrides everything', () => {
      const facet = { ...baseFacet, data: { cio_render_visual: false } };
      const isVisualFilterFn = () => false;
      const filterConfigs = { color: { renderVisual: true } };
      expect(shouldRenderVisualFacet(facet, filterConfigs, isVisualFilterFn)).toBe(true);
    });

    it('falls through to callback when filterConfigs has no entry for the facet', () => {
      const isVisualFilterFn = jest.fn().mockReturnValue(true);
      const filterConfigs = { brand: { renderVisual: false } };
      expect(shouldRenderVisualFacet(baseFacet, filterConfigs, isVisualFilterFn)).toBe(true);
      expect(isVisualFilterFn).toHaveBeenCalledWith(baseFacet);
    });

    it('falls through to data attribute when filterConfigs entry has no renderVisual', () => {
      const facet = { ...baseFacet, data: { cio_render_visual: true } };
      const filterConfigs = { color: {} };
      expect(shouldRenderVisualFacet(facet, filterConfigs)).toBe(true);
    });
  });

  describe('resolveVisualOption', () => {
    const baseOption = {
      status: '',
      count: 10,
      displayName: 'Red',
      value: 'red',
      data: {},
    };

    it('returns null when no callbacks and no metadata', () => {
      expect(resolveVisualOption(baseOption)).toBeNull();
    });

    it('returns image from getVisualImageUrl callback', () => {
      const getVisualImageUrl = () => 'https://example.com/red.png';
      expect(resolveVisualOption(baseOption, getVisualImageUrl)).toEqual({
        type: 'image',
        value: 'https://example.com/red.png',
      });
    });

    it('returns color from getVisualColorHex callback', () => {
      const getVisualColorHex = () => '#FF0000';
      expect(resolveVisualOption(baseOption, undefined, getVisualColorHex)).toEqual({
        type: 'color',
        value: '#FF0000',
      });
    });

    it('image callback takes priority over color callback', () => {
      const getVisualImageUrl = () => 'https://example.com/red.png';
      const getVisualColorHex = () => '#FF0000';
      expect(resolveVisualOption(baseOption, getVisualImageUrl, getVisualColorHex)).toEqual({
        type: 'image',
        value: 'https://example.com/red.png',
      });
    });

    it('falls through to color callback when image callback returns undefined', () => {
      const getVisualImageUrl = () => undefined;
      const getVisualColorHex = () => '#FF0000';
      expect(resolveVisualOption(baseOption, getVisualImageUrl, getVisualColorHex)).toEqual({
        type: 'color',
        value: '#FF0000',
      });
    });

    it('returns image from option.data.image_url metadata', () => {
      const option = { ...baseOption, data: { image_url: 'https://example.com/red.png' } };
      expect(resolveVisualOption(option)).toEqual({
        type: 'image',
        value: 'https://example.com/red.png',
      });
    });

    it('returns color from option.data.hex_color metadata', () => {
      const option = { ...baseOption, data: { hex_color: '#FF0000' } };
      expect(resolveVisualOption(option)).toEqual({
        type: 'color',
        value: '#FF0000',
      });
    });

    it('image metadata takes priority over color metadata', () => {
      const option = {
        ...baseOption,
        data: { image_url: 'https://example.com/red.png', hex_color: '#FF0000' },
      };
      expect(resolveVisualOption(option)).toEqual({
        type: 'image',
        value: 'https://example.com/red.png',
      });
    });

    it('callback takes priority over metadata', () => {
      const option = { ...baseOption, data: { image_url: 'https://example.com/red.png' } };
      const getVisualColorHex = () => '#00FF00';
      expect(resolveVisualOption(option, undefined, getVisualColorHex)).toEqual({
        type: 'color',
        value: '#00FF00',
      });
    });

    it('returns null when callbacks return undefined and no metadata', () => {
      const getVisualImageUrl = () => undefined;
      const getVisualColorHex = () => undefined;
      expect(resolveVisualOption(baseOption, getVisualImageUrl, getVisualColorHex)).toBeNull();
    });
  });
});
